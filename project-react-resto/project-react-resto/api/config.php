<?php
// Mengaktifkan CORS agar API bisa diakses dari domain yang berbeda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Jika request method adalah OPTIONS, langsung return 200 OK
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Konfigurasi database
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'apirestoran'); // Sesuaikan dengan nama database Anda

// Fungsi untuk koneksi ke database
function getConnection() {
    try {
        // Create connection
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

        // Check connection
        if ($conn->connect_error) {
            error_log('Connection failed: ' . $conn->connect_error);
            throw new Exception('Database connection failed: ' . $conn->connect_error);
        }

        // Set charset to ensure proper handling of special characters
        $conn->set_charset("utf8mb4");

        error_log('Database connection successful');
        return $conn;
    } catch (Exception $e) {
        error_log('Exception during connection: ' . $e->getMessage());
        throw $e;
    }
}

// Fungsi untuk mengambil data dari request
function getRequestData() {
    // Debug: Log raw input
    $rawInput = file_get_contents("php://input");
    error_log('Raw input: ' . $rawInput);

    // Untuk request POST, PUT, DELETE
    $data = json_decode($rawInput, true);

    // Debug: Log decoded JSON
    error_log('Decoded JSON: ' . ($data ? json_encode($data) : 'null'));

    // Jika tidak ada data dari body, cek dari $_POST atau $_GET
    if (!$data) {
        // Debug: Log $_POST dan $_GET
        error_log('$_POST: ' . json_encode($_POST));
        error_log('$_GET: ' . json_encode($_GET));

        $data = isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET' ? $_GET : $_POST;
    }

    return $data;
}

// Fungsi untuk response JSON
function sendResponse($status, $data = null, $message = '') {
    http_response_code($status);

    $response = [
        'success' => $status >= 200 && $status < 300,
        'message' => $message
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    // Debug: Log response
    error_log('API Response: ' . json_encode($response));

    // Ensure proper JSON headers
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($response);
    exit;
}
