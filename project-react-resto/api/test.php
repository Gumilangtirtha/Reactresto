<?php
// Mengaktifkan CORS agar API bisa diakses dari domain yang berbeda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Konfigurasi database
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'apirestoran'); // Sesuaikan dengan nama database Anda

// Fungsi untuk koneksi ke database
function testConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Cek koneksi
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'Database connection failed: ' . $conn->connect_error
        ];
    }
    
    // Cek apakah tabel users ada
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    $tableExists = $result->num_rows > 0;
    
    if (!$tableExists) {
        return [
            'success' => false,
            'message' => 'Table users does not exist'
        ];
    }
    
    // Cek struktur tabel users
    $result = $conn->query("DESCRIBE users");
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
    
    // Cek jumlah user
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    $userCount = $result->fetch_assoc()['count'];
    
    // Ambil semua user (tanpa password)
    $users = [];
    $result = $conn->query("SELECT id, name, username, email, role, created_at, updated_at FROM users");
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    $conn->close();
    
    return [
        'success' => true,
        'message' => 'Database connection successful',
        'data' => [
            'table_exists' => $tableExists,
            'columns' => $columns,
            'user_count' => $userCount,
            'users' => $users
        ]
    ];
}

// Jalankan test
$result = testConnection();

// Kirim response
echo json_encode($result);
exit;
