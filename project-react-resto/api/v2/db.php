<?php
// Aktifkan error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
        return null;
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

// Fungsi untuk mengaktifkan CORS
function enableCORS() {
    // Mengaktifkan CORS - Sangat permisif
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
    header("Content-Type: application/json; charset=UTF-8");
    
    // Jika request method adalah OPTIONS, langsung return 200 OK
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Fungsi untuk mendapatkan data dari request
function getRequestData() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Jika JSON tidak valid, coba ambil dari $_POST
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        $data = $_POST;
    }
    
    return $data;
}

// Fungsi untuk log request
function logRequest($filename = 'api_log.txt') {
    $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'Unknown';
    $requestUri = $_SERVER['REQUEST_URI'] ?? 'Unknown';
    $requestHeaders = getallheaders();
    $requestBody = file_get_contents('php://input');
    
    // Simpan log ke file
    $logFile = __DIR__ . '/' . $filename;
    $logMessage = date('Y-m-d H:i:s') . " - Method: $requestMethod, URI: $requestUri\n";
    $logMessage .= "Headers: " . json_encode($requestHeaders) . "\n";
    $logMessage .= "Body: $requestBody\n";
    $logMessage .= "-----------------------------------\n";
    
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}
