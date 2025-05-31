<?php
// Aktifkan error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Mengaktifkan CORS agar API bisa diakses dari domain yang berbeda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Jika request method adalah OPTIONS, langsung return 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
        sendResponse(false, null, 'Database connection error: ' . $e->getMessage());
        exit;
    }
}

// Fungsi untuk mengirim response
function sendResponse($success, $data = null, $message = '') {
    $response = [
        'success' => $success,
        'message' => $message,
        'data' => $data
    ];
    
    echo json_encode($response);
    exit;
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

// Hanya menerima request POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Method Not Allowed');
    exit;
}

// Ambil data dari request
$data = getRequestData();

// Debug: Log data yang diterima
error_log('Register request data: ' . json_encode($data));

// Validasi data
if (empty($data)) {
    error_log('Empty request data');
    sendResponse(false, null, 'Data tidak ditemukan. Pastikan format JSON valid.');
    exit;
}

if (!isset($data['name']) || !isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    error_log('Register validation failed: Incomplete data');
    sendResponse(false, null, 'Data tidak lengkap. Nama, username, email, dan password diperlukan.');
    exit;
}

// Sanitasi data
$name = htmlspecialchars(trim($data['name']));
$username = htmlspecialchars(trim($data['username']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = $data['password']; // Password akan di-hash
$role = isset($data['role']) ? htmlspecialchars(trim($data['role'])) : 'user';

// Validasi data setelah sanitasi
if (empty($name) || strlen($name) < 3) {
    error_log('Invalid name: ' . $name);
    sendResponse(false, null, 'Nama harus minimal 3 karakter.');
    exit;
}

if (empty($username) || strlen($username) < 3) {
    error_log('Invalid username: ' . $username);
    sendResponse(false, null, 'Username harus minimal 3 karakter.');
    exit;
}

// Validasi email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error_log('Invalid email format: ' . $email);
    sendResponse(false, null, 'Format email tidak valid.');
    exit;
}

// Validasi password
if (strlen($password) < 6) {
    error_log('Password too short: ' . strlen($password) . ' characters');
    sendResponse(false, null, 'Password harus minimal 6 karakter.');
    exit;
}

// Validasi role
if ($role !== 'admin' && $role !== 'user') {
    error_log('Invalid role: ' . $role);
    // Default ke 'user' jika role tidak valid
    $role = 'user';
}

try {
    // Koneksi ke database
    $conn = getConnection();
    
    // Cek apakah username atau email sudah digunakan
    $stmt = $conn->prepare("SELECT id, username, email FROM users WHERE username = ? OR email = ?");
    if (!$stmt) {
        throw new Exception('Prepare statement failed: ' . $conn->error);
    }
    
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $existingUser = $result->fetch_assoc();
        $stmt->close();
        
        if ($existingUser['username'] === $username) {
            error_log('Username already exists: ' . $username);
            sendResponse(false, null, 'Username sudah digunakan.');
        } else {
            error_log('Email already exists: ' . $email);
            sendResponse(false, null, 'Email sudah digunakan.');
        }
        exit;
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Siapkan timestamp
    $now = date('Y-m-d H:i:s');
    
    // Insert user baru
    $stmt = $conn->prepare("INSERT INTO users (name, username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        throw new Exception('Prepare statement failed: ' . $conn->error);
    }
    
    $stmt->bind_param("sssssss", $name, $username, $email, $hashedPassword, $role, $now, $now);
    
    // Debug: Log data yang akan diinsert
    error_log("Inserting user: name=$name, username=$username, email=$email, role=$role, created_at=$now");
    
    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }
    
    $userId = $conn->insert_id;
    error_log("User inserted successfully with ID: $userId");
    $stmt->close();
    
    // Ambil data user yang baru dibuat (tanpa password)
    $stmt = $conn->prepare("SELECT id, name, username, email, role, created_at, updated_at FROM users WHERE id = ?");
    
    if (!$stmt) {
        throw new Exception('Prepare statement failed: ' . $conn->error);
    }
    
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if (!$result) {
        throw new Exception('Get result failed: ' . $stmt->error);
    }
    
    $user = $result->fetch_assoc();
    
    if (!$user) {
        throw new Exception('User not found after insert');
    }
    
    error_log("User data retrieved: " . json_encode($user));
    
    $stmt->close();
    $conn->close();
    
    // Generate token untuk user baru
    $token = bin2hex(random_bytes(32));
    
    // Kirim response sukses
    sendResponse(true, [
        'user' => $user,
        'token' => $token
    ], 'Pendaftaran berhasil!');
    
} catch (Exception $e) {
    error_log('Registration error: ' . $e->getMessage());
    sendResponse(false, null, 'Terjadi kesalahan: ' . $e->getMessage());
    exit;
}
