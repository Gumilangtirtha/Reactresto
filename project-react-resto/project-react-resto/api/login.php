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
error_log('Login request data: ' . json_encode($data));

// Validasi data
if (empty($data)) {
    error_log('Empty request data');
    sendResponse(false, null, 'Data tidak ditemukan. Pastikan format JSON valid.');
    exit;
}

// Cek apakah login menggunakan username atau email
if (!isset($data['username']) && !isset($data['email'])) {
    error_log('Login validation failed: No username or email provided');
    sendResponse(false, null, 'Username atau email diperlukan.');
    exit;
}

if (!isset($data['password'])) {
    error_log('Login validation failed: No password provided');
    sendResponse(false, null, 'Password diperlukan.');
    exit;
}

try {
    // Koneksi ke database
    $conn = getConnection();
    
    // Siapkan query berdasarkan apakah user login dengan username atau email
    if (isset($data['username'])) {
        $identifier = htmlspecialchars(trim($data['username']));
        $stmt = $conn->prepare("SELECT id, name, username, email, password, role, created_at, updated_at FROM users WHERE username = ?");
        $stmt->bind_param("s", $identifier);
    } else {
        $identifier = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $stmt = $conn->prepare("SELECT id, name, username, email, password, role, created_at, updated_at FROM users WHERE email = ?");
        $stmt->bind_param("s", $identifier);
    }
    
    if (!$stmt) {
        throw new Exception('Prepare statement failed: ' . $conn->error);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        error_log('User not found: ' . $identifier);
        sendResponse(false, null, 'Username atau password salah.');
        exit;
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // Verifikasi password
    if (!password_verify($data['password'], $user['password'])) {
        error_log('Password verification failed for user: ' . $identifier);
        sendResponse(false, null, 'Username atau password salah.');
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
    sendResponse(true, [
        'user' => $user,
        'token' => $token
    ], 'Login berhasil!');
    
} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    sendResponse(false, null, 'Terjadi kesalahan: ' . $e->getMessage());
    exit;
}
