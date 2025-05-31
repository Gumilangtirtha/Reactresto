<?php
// Mengaktifkan CORS agar API bisa diakses dari domain yang berbeda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Jika request method adalah OPTIONS, langsung return 200 OK
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Fungsi untuk mendapatkan semua informasi request
function getRequestInfo() {
    // Ambil raw input
    $rawInput = file_get_contents("php://input");
    
    // Decode JSON jika ada
    $jsonData = json_decode($rawInput, true);
    
    // Ambil semua header
    $headers = [];
    foreach (getallheaders() as $name => $value) {
        $headers[$name] = $value;
    }
    
    // Ambil semua server variables
    $serverVars = [];
    foreach ($_SERVER as $key => $value) {
        if (!is_array($value) && !is_object($value)) {
            $serverVars[$key] = $value;
        }
    }
    
    // Buat response
    $response = [
        'success' => true,
        'message' => 'Request info',
        'data' => [
            'method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
            'uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
            'query_string' => $_SERVER['QUERY_STRING'] ?? '',
            'raw_input' => $rawInput,
            'json_data' => $jsonData,
            'post_data' => $_POST,
            'get_data' => $_GET,
            'headers' => $headers,
            'server_vars' => $serverVars
        ]
    ];
    
    // Log request info
    error_log('Request info: ' . json_encode($response));
    
    return $response;
}

// Jalankan fungsi
$result = getRequestInfo();

// Kirim response
echo json_encode($result, JSON_PRETTY_PRINT);
exit;
