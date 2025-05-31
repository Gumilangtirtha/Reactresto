<?php
// Mengaktifkan CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Ambil kode error dari query string
$code = isset($_GET['code']) ? intval($_GET['code']) : 500;

// Pesan error berdasarkan kode
$messages = [
    400 => 'Bad Request',
    401 => 'Unauthorized',
    403 => 'Forbidden',
    404 => 'Not Found',
    405 => 'Method Not Allowed',
    500 => 'Internal Server Error'
];

// Default message jika kode tidak dikenali
$message = isset($messages[$code]) ? $messages[$code] : 'Unknown Error';

// Set HTTP response code
http_response_code($code);

// Kirim response JSON
echo json_encode([
    'success' => false,
    'code' => $code,
    'message' => $message
]);
exit;
