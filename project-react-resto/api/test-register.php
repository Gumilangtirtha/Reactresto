<?php
// Mengaktifkan CORS agar API bisa diakses dari domain yang berbeda
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Konfigurasi database
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'apirestoran'); // Sesuaikan dengan nama database Anda

// Fungsi untuk koneksi ke database
function getConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        // Cek koneksi
        if ($conn->connect_error) {
            throw new Exception('Database connection failed: ' . $conn->connect_error);
        }
        
        // Set karakter encoding
        $conn->set_charset("utf8");
        
        return $conn;
    } catch (Exception $e) {
        die(json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]));
    }
}

// Fungsi untuk mendaftarkan user test
function registerTestUser() {
    try {
        // Data user test
        $name = "Test User " . time();
        $username = "testuser" . time();
        $email = "testuser" . time() . "@example.com";
        $password = "password123";
        $role = "user";
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Siapkan timestamp
        $now = date('Y-m-d H:i:s');
        
        // Koneksi ke database
        $conn = getConnection();
        
        // Cek apakah username atau email sudah digunakan
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        if (!$stmt) {
            throw new Exception('Prepare statement failed: ' . $conn->error);
        }
        
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $stmt->close();
            $conn->close();
            return [
                'success' => false,
                'message' => 'Username or email already exists'
            ];
        }
        
        // Insert user baru
        $stmt = $conn->prepare("INSERT INTO users (name, username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            throw new Exception('Prepare statement failed: ' . $conn->error);
        }
        
        $stmt->bind_param("sssssss", $name, $username, $email, $hashedPassword, $role, $now, $now);
        
        if ($stmt->execute()) {
            $userId = $conn->insert_id;
            $stmt->close();
            
            // Ambil data user yang baru dibuat (tanpa password)
            $stmt = $conn->prepare("SELECT id, name, username, email, role, created_at, updated_at FROM users WHERE id = ?");
            if (!$stmt) {
                throw new Exception('Prepare statement failed: ' . $conn->error);
            }
            
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            
            $stmt->close();
            $conn->close();
            
            return [
                'success' => true,
                'message' => 'Test user registered successfully',
                'data' => $user
            ];
        } else {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Registration failed: ' . $e->getMessage()
        ];
    }
}

// Jalankan test
$result = registerTestUser();

// Kirim response
echo json_encode($result, JSON_PRETTY_PRINT);
exit;
