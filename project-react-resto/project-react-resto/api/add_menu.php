<?php
require_once 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['menu']) || !isset($data['deskripsi']) || !isset($data['harga']) || !isset($data['kategori_id'])) {
    echo json_encode(['success' => false, 'message' => 'Data menu tidak lengkap']);
    exit;
}

$menu = $data['menu'];
$deskripsi = $data['deskripsi'];
$gambar = isset($data['gambar']) ? $data['gambar'] : null;
$harga = $data['harga'];
$kategori_id = $data['kategori_id'];

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Koneksi database gagal']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO menus (menu, deskripsi, gambar, harga, kategori_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
$stmt->bind_param("sssdi", $menu, $deskripsi, $gambar, $harga, $kategori_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Menu berhasil ditambahkan']);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal menambah menu: ' . $stmt->error]);
}
$stmt->close();
$conn->close();