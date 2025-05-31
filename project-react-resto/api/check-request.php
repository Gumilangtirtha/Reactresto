<?php
// Aktifkan error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Mengaktifkan CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Jika request method adalah OPTIONS, langsung return 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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

// Fungsi untuk mendapatkan semua header
function getAllHeaders() {
    $headers = [];
    foreach (getallheaders() as $name => $value) {
        $headers[$name] = $value;
    }
    return $headers;
}

// Fungsi untuk mendapatkan semua server variables
function getServerVars() {
    $serverVars = [];
    foreach ($_SERVER as $key => $value) {
        if (!is_array($value) && !is_object($value)) {
            $serverVars[$key] = $value;
        }
    }
    return $serverVars;
}

// Ambil data dari request
$data = getRequestData();

// Buat response
$response = [
    'success' => true,
    'message' => 'Request info',
    'data' => [
        'method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
        'uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
        'query_string' => $_SERVER['QUERY_STRING'] ?? '',
        'raw_input' => file_get_contents('php://input'),
        'post_data' => $_POST,
        'get_data' => $_GET,
        'headers' => getAllHeaders(),
        'server_vars' => getServerVars(),
        'parsed_data' => $data
    ]
];

// Kirim response
echo json_encode($response, JSON_PRETTY_PRINT);
exit;
