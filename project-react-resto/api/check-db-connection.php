<?php
// Aktifkan error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Mengaktifkan CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Fungsi untuk koneksi ke database
function checkDatabaseConnection() {
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $db = 'apirestoran';
    
    try {
        // Coba koneksi ke database
        $conn = new mysqli($host, $user, $pass, $db);
        
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
            $conn->close();
            return [
                'success' => false,
                'message' => 'Table users does not exist'
            ];
        }
        
        // Cek struktur tabel users
        $result = $conn->query("DESCRIBE users");
        $columns = [];
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row;
        }
        
        // Cek jumlah user
        $result = $conn->query("SELECT COUNT(*) as count FROM users");
        $userCount = $result->fetch_assoc()['count'];
        
        // Cek apakah bisa insert data
        $testName = 'Test Connection ' . time();
        $testUsername = 'testconn' . time();
        $testEmail = 'testconn' . time() . '@example.com';
        $testPassword = password_hash('password123', PASSWORD_DEFAULT);
        $testRole = 'user';
        $now = date('Y-m-d H:i:s');
        
        $stmt = $conn->prepare("INSERT INTO users (name, username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            $conn->close();
            return [
                'success' => false,
                'message' => 'Failed to prepare statement: ' . $conn->error
            ];
        }
        
        $stmt->bind_param("sssssss", $testName, $testUsername, $testEmail, $testPassword, $testRole, $now, $now);
        $insertSuccess = $stmt->execute();
        $insertError = $stmt->error;
        $insertId = $conn->insert_id;
        $stmt->close();
        
        // Hapus data test
        if ($insertSuccess) {
            $conn->query("DELETE FROM users WHERE id = $insertId");
        }
        
        $conn->close();
        
        return [
            'success' => true,
            'message' => 'Database connection successful',
            'data' => [
                'table_exists' => $tableExists,
                'columns' => $columns,
                'user_count' => $userCount,
                'insert_test' => [
                    'success' => $insertSuccess,
                    'error' => $insertError,
                    'insert_id' => $insertId
                ]
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
$result = checkDatabaseConnection();

// Kirim response
echo json_encode($result, JSON_PRETTY_PRINT);
exit;
