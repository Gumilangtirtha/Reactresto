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

// Koneksi ke database
require_once 'config.php';

try {
    // Buat koneksi ke database menggunakan fungsi dari config.php
    $conn = getConnection();
      // Query untuk mengambil semua kategori
    $result = $conn->query("SELECT * FROM kategori ORDER BY nama_kategori ASC");
    
    // Ambil semua data kategori
    $kategori = [];
    while ($row = $result->fetch_assoc()) {
        $kategori[] = $row;
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