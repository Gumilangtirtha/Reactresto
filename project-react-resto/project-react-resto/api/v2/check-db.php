<?php
// Include file koneksi database
require_once 'db.php';

// Aktifkan CORS
enableCORS();

// Cek koneksi database
$conn = getConnection();
if (!$conn) {
    sendResponse(false, null, 'Koneksi database gagal');
}

try {
    // Cek apakah tabel users ada
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    $tableExists = $result->num_rows > 0;
    
    if (!$tableExists) {
        // Buat tabel users jika belum ada
        $sql = "CREATE TABLE users (
            id INT(11) NOT NULL AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            email_verified_at TIMESTAMP NULL DEFAULT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
            remember_token VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY username (username),
            UNIQUE KEY email (email)
        )";
        
        if (!$conn->query($sql)) {
            throw new Exception('Failed to create users table: ' . $conn->error);
        }
        
        // Buat user admin default
        $name = 'Admin';
        $username = 'admin';
        $email = 'admin@example.com';
        $password = password_hash('admin123', PASSWORD_DEFAULT);
        $role = 'admin';
        $now = date('Y-m-d H:i:s');
        
        $stmt = $conn->prepare("INSERT INTO users (name, username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            throw new Exception('Prepare statement failed: ' . $conn->error);
        }
        
        $stmt->bind_param("sssssss", $name, $username, $email, $password, $role, $now, $now);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to create admin user: ' . $stmt->error);
        }
        
        $stmt->close();
    }
    
    // Cek jumlah user
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    $userCount = $result->fetch_assoc()['count'];
    
    // Ambil semua user (tanpa password)
    $result = $conn->query("SELECT id, name, username, email, role, created_at, updated_at FROM users");
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    $conn->close();
    
    // Kirim response sukses
    sendResponse(true, [
        'table_exists' => $tableExists,
        'user_count' => $userCount,
        'users' => $users
    ], 'Database check successful');
    
} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }
    sendResponse(false, null, 'Database check failed: ' . $e->getMessage());
}
