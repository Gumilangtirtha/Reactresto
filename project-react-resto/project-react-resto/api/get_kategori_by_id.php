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

// Pastikan metode request adalah GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Metode tidak diizinkan. Gunakan GET.'
    ]);
    exit;
}

// Validasi parameter ID
if (!isset($_GET['id']) || empty($_GET['id'])) {
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
    
    // Ambil ID kategori dari parameter URL
    $id = $_GET['id'];
    
    // Query untuk mengambil kategori berdasarkan ID
    $stmt = $conn->prepare("SELECT * FROM kategori WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    // Ambil data kategori
    $kategori = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Periksa apakah kategori ditemukan
    if (!$kategori) {
        http_response_code(404); // Not Found
        echo json_encode([
            'success' => false,
            'message' => 'Kategori dengan ID tersebut tidak ditemukan'
        ]);
        exit;
    }
    
    // Kembalikan response sukses dengan data kategori
    echo json_encode([
        'success' => true,
        'data' => $kategori,
        'message' => 'Data kategori berhasil diambil'
    ]);
    
} catch (PDOException $e) {
    // Kembalikan response error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengambil data kategori: ' . $e->getMessage()
    ]);
}