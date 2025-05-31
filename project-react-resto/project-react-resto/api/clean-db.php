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
function getConnection() {
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $db = 'apirestoran';
    
    try {
        $conn = new mysqli($host, $user, $pass, $db);
        
        // Cek koneksi
        if ($conn->connect_error) {
            throw new Exception('Database connection failed: ' . $conn->connect_error);
        }
        
        // Set karakter encoding
        $conn->set_charset("utf8");
        
        return $conn;
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Database connection error: ' . $e->getMessage()
        ];
    }
}

// Fungsi untuk menghapus user test
function cleanTestUsers() {
    try {
        // Koneksi ke database
        $conn = getConnection();
        
        // Hapus user dengan nama yang mengandung "Test User"
        $stmt = $conn->prepare("DELETE FROM users WHERE name LIKE 'Test User%' AND id > 1");
        if (!$stmt) {
            throw new Exception('Prepare statement failed: ' . $conn->error);
        }
        
        $stmt->execute();
        $affectedRows = $stmt->affected_rows;
        $stmt->close();
        
        // Hapus user dengan username yang mengandung "testuser"
        $stmt = $conn->prepare("DELETE FROM users WHERE username LIKE 'testuser%' AND id > 1");
        if (!$stmt) {
            throw new Exception('Prepare statement failed: ' . $conn->error);
        }
        
        $stmt->execute();
        $affectedRows += $stmt->affected_rows;
        $stmt->close();
        
        // Hapus user dengan email yang mengandung "testuser"
        $stmt = $conn->prepare("DELETE FROM users WHERE email LIKE 'testuser%' AND id > 1");
        if (!$stmt) {
            throw new Exception('Prepare statement failed: ' . $conn->error);
        }
        
        $stmt->execute();
        $affectedRows += $stmt->affected_rows;
        $stmt->close();
        
        $conn->close();
        
        return [
            'success' => true,
            'message' => 'Database cleaned successfully',
            'data' => [
                'affected_rows' => $affectedRows
            ]
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Database cleaning failed: ' . $e->getMessage()
        ];
    }
}

// Jalankan pembersihan
$result = cleanTestUsers();

// Kirim response
echo json_encode($result, JSON_PRETTY_PRINT);
exit;
