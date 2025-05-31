<?php
// Aktifkan error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Mengaktifkan CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Jika request method adalah OPTIONS, langsung return 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Log semua request
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'Unknown';
$requestUri = $_SERVER['REQUEST_URI'] ?? 'Unknown';
$requestHeaders = getallheaders();
$requestBody = file_get_contents('php://input');

// Simpan log ke file
$logFile = __DIR__ . '/simple_register.log';
$logMessage = date('Y-m-d H:i:s') . " - Method: $requestMethod, URI: $requestUri\n";
$logMessage .= "Headers: " . json_encode($requestHeaders) . "\n";
$logMessage .= "Body: $requestBody\n";
$logMessage .= "-----------------------------------\n";

file_put_contents($logFile, $logMessage, FILE_APPEND);

// Fungsi untuk koneksi ke database
function getConnection() {
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $db = 'apirestoran';
    
    try {
        $conn = new mysqli($host, $user, $pass, $db);
        
        // Cek koneksi
        if ($conn->connect_error) {
            throw new Exception('Database connection failed: ' . $conn->connect_error);
        }
        
        // Set karakter encoding
        $conn->set_charset("utf8");
        
        return $conn;
    } catch (Exception $e) {
        error_log('Database connection error: ' . $e->getMessage());
        return null;
    }
}

// Fungsi untuk mendapatkan data dari request
function getRequestData() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Jika JSON tidak valid, coba ambil dari $_POST
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log('Invalid JSON: ' . json_last_error_msg() . ' - Raw input: ' . $json);
        $data = $_POST;
    }
    
    return $data;
}

// Ambil data dari request
$data = getRequestData();

// Validasi data
if (empty($data)) {
    echo json_encode([
        'success' => false,
        'message' => 'Data tidak ditemukan'
    ]);
    exit;
}

if (!isset($data['name']) || !isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Data tidak lengkap'
    ]);
    exit;
}

// Sanitasi data
$name = htmlspecialchars(trim($data['name']));
$username = htmlspecialchars(trim($data['username']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = $data['password']; // Password akan di-hash
$role = isset($data['role']) ? htmlspecialchars(trim($data['role'])) : 'user';

// Validasi email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Format email tidak valid'
    ]);
    exit;
}

// Validasi password
if (strlen($password) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'Password harus minimal 6 karakter'
    ]);
    exit;
}

// Koneksi ke database
$conn = getConnection();
if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'Koneksi database gagal'
    ]);
    exit;
}

// Cek apakah username atau email sudah digunakan
$stmt = $conn->prepare("SELECT id, username, email FROM users WHERE username = ? OR email = ?");
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    $conn->close();
    exit;
}

$stmt->bind_param("ss", $username, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $existingUser = $result->fetch_assoc();
    $stmt->close();
    
    if ($existingUser['username'] === $username) {
        echo json_encode([
            'success' => false,
            'message' => 'Username sudah digunakan'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Email sudah digunakan'
        ]);
    }
    $conn->close();
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Siapkan timestamp
$now = date('Y-m-d H:i:s');

// Insert user baru
$stmt = $conn->prepare("INSERT INTO users (name, username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    $conn->close();
    exit;
}

$stmt->bind_param("sssssss", $name, $username, $email, $hashedPassword, $role, $now, $now);

if (!$stmt->execute()) {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mendaftarkan user: ' . $stmt->error
    ]);
    $stmt->close();
    $conn->close();
    exit;
}

$userId = $conn->insert_id;
$stmt->close();

// Ambil data user yang baru dibuat (tanpa password)
$stmt = $conn->prepare("SELECT id, name, username, email, role, created_at, updated_at FROM users WHERE id = ?");
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    $conn->close();
    exit;
}

$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();
$conn->close();

// Generate token untuk user baru
$token = bin2hex(random_bytes(32));

// Kirim response sukses
echo json_encode([
    'success' => true,
    'message' => 'Pendaftaran berhasil!',
    'data' => [
        'user' => $user,
        'token' => $token
    ]
]);
exit;
