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
$logFile = __DIR__ . '/simple_login.log';
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

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Username dan password diperlukan'
    ]);
    exit;
}

// Sanitasi data
$username = htmlspecialchars(trim($data['username']));
$password = $data['password'];

// Koneksi ke database
$conn = getConnection();
if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'Koneksi database gagal'
    ]);
    exit;
}

// Cari user berdasarkan username
$stmt = $conn->prepare("SELECT id, name, username, email, password, role, created_at, updated_at FROM users WHERE username = ?");
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $conn->error
    ]);
    $conn->close();
    exit;
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Username atau password salah'
    ]);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Verifikasi password
if (!password_verify($password, $user['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Username atau password salah'
    ]);
    $conn->close();
    exit;
}

// Hapus password dari data user
unset($user['password']);

// Generate token
$token = bin2hex(random_bytes(32));

// Update last login time (opsional)
$now = date('Y-m-d H:i:s');
$stmt = $conn->prepare("UPDATE users SET updated_at = ? WHERE id = ?");
if ($stmt) {
    $stmt->bind_param("si", $now, $user['id']);
    $stmt->execute();
    $stmt->close();
}

$conn->close();

// Kirim response sukses
echo json_encode([
    'success' => true,
    'message' => 'Login berhasil!',
    'data' => [
        'user' => $user,
        'token' => $token
    ]
]);
exit;
