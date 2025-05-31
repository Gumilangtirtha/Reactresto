<?php
// Mengaktifkan CORS agar API bisa diakses dari domain yang berbeda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Jika request method adalah OPTIONS, langsung return 200 OK
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cek apakah request method adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);
    exit;
}

// Ambil raw input
$rawInput = file_get_contents("php://input");

// Decode JSON
$jsonData = json_decode($rawInput, true);

// Ambil data dari $_POST jika tidak ada JSON
$postData = $_POST;

// Response
$response = [
    'success' => true,
    'message' => 'Test POST request successful',
    'data' => [
        'raw_input' => $rawInput,
        'json_data' => $jsonData,
        'post_data' => $postData,
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Not set',
        'http_accept' => $_SERVER['HTTP_ACCEPT'] ?? 'Not set'
    ]
];

// Kirim response
echo json_encode($response);
exit;
