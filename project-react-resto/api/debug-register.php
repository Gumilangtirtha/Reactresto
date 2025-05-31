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
$logFile = __DIR__ . '/register_debug.log';
$logMessage = date('Y-m-d H:i:s') . " - Method: $requestMethod, URI: $requestUri\n";
$logMessage .= "Headers: " . json_encode($requestHeaders) . "\n";
$logMessage .= "Body: $requestBody\n";
$logMessage .= "-----------------------------------\n";

file_put_contents($logFile, $logMessage, FILE_APPEND);

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

// Buat response
$response = [
    'success' => true,
    'message' => 'Debug info received',
    'data' => [
        'method' => $requestMethod,
        'uri' => $requestUri,
        'headers' => $requestHeaders,
        'body_raw' => $requestBody,
        'body_parsed' => $data,
        'post_data' => $_POST,
        'get_data' => $_GET,
        'server' => $_SERVER
    ]
];

// Kirim response
echo json_encode($response, JSON_PRETTY_PRINT);
exit;
