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
$logFile = __DIR__ . '/echo.log';
$logMessage = date('Y-m-d H:i:s') . " - Method: $requestMethod, URI: $requestUri\n";
$logMessage .= "Headers: " . json_encode($requestHeaders) . "\n";
$logMessage .= "Body: $requestBody\n";
$logMessage .= "-----------------------------------\n";

file_put_contents($logFile, $logMessage, FILE_APPEND);

// Parse JSON input
$data = json_decode($requestBody, true);

// Kirim response sukses
echo json_encode([
    'success' => true,
    'message' => 'Echo successful',
    'data' => [
        'received' => $data,
        'method' => $requestMethod,
        'uri' => $requestUri,
        'headers' => $requestHeaders,
        'server' => $_SERVER
    ]
]);
exit;
