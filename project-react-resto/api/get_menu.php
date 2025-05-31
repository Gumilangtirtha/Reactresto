<?php
require_once 'config.php';
header('Content-Type: application/json');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Koneksi database gagal']);
    exit;
}

$sql = "SELECT * FROM menus";
$result = $conn->query($sql);
$menus = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $menus[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $menus]);
} else {
    echo json_encode(['success' => true, 'data' => []]);
}
$conn->close();