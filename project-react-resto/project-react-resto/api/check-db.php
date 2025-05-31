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
function checkDatabase() {
    try {
        // Koneksi ke database
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
        $result = $conn->query("SHOW CREATE TABLE users");
        $tableStructure = '';
        if ($result && $row = $result->fetch_row()) {
            $tableStructure = $row[1];
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
        
        // Cek apakah ada error di tabel
        $result = $conn->query("CHECK TABLE users");
        $tableStatus = [];
        while ($row = $result->fetch_assoc()) {
            $tableStatus[] = $row;
        }
        
        $conn->close();
        
        return [
            'success' => true,
            'message' => 'Database check successful',
            'data' => [
                'table_exists' => $tableExists,
                'table_structure' => $tableStructure,
                'user_count' => $userCount,
                'users' => $users,
                'table_status' => $tableStatus
            ]
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Database check failed: ' . $e->getMessage()
        ];
    }
}

// Jalankan check
$result = checkDatabase();

// Kirim response
echo json_encode($result, JSON_PRETTY_PRINT);
exit;
