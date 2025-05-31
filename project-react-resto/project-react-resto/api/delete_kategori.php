<?php
// Header untuk CORS dan JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Jika request adalah OPTIONS, hentikan di sini (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Pastikan metode request adalah DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Metode tidak diizinkan. Gunakan DELETE.'
    ]);
    exit;
}

// Ambil data dari request body
$data = json_decode(file_get_contents("php://input"), true);

// Validasi data
if (!isset($data['id']) || empty($data['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => 'ID kategori tidak boleh kosong'
    ]);
    exit;
}

// Koneksi ke database
require_once 'config.php';

try {
    // Buat koneksi ke database
    $conn = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Siapkan ID kategori yang akan dihapus
    $id = $data['id'];
    
    // Query untuk menghapus kategori
    $stmt = $conn->prepare("DELETE FROM kategori WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    // Periksa apakah ada baris yang terpengaruh
    if ($stmt->rowCount() === 0) {
        http_response_code(404); // Not Found
        echo json_encode([
            'success' => false,
            'message' => 'Kategori dengan ID tersebut tidak ditemukan'
        ]);
        exit;
    }
    
    // Kembalikan response sukses
    echo json_encode([
        'success' => true,
        'message' => 'Kategori berhasil dihapus'
    ]);
    
} catch (PDOException $e) {
    // Kembalikan response error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menghapus kategori: ' . $e->getMessage()
    ]);
}