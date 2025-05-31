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

// Fungsi untuk mengirim response
function sendResponse($success, $data = null, $message = '') {
    $response = [
        'success' => $success,
        'message' => $message,
        'data' => $data
    ];

    echo json_encode($response);
    exit;
}

// Fungsi untuk test register
function testRegister() {
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

            // Generate token
            $token = bin2hex(random_bytes(32));

            return [
                'success' => true,
                'message' => 'Test user registered successfully',
                'data' => [
                    'user' => $user,
                    'token' => $token
                ]
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

// Fungsi untuk test login
function testLogin() {
    try {
        // Koneksi ke database
        $conn = getConnection();

        // Ambil user pertama dari database
        $stmt = $conn->prepare("SELECT id, name, username, email, password, role, created_at, updated_at FROM users LIMIT 1");
        if (!$stmt) {
            throw new Exception('Prepare statement failed: ' . $conn->error);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $stmt->close();
            $conn->close();
            return [
                'success' => false,
                'message' => 'No users found in database'
            ];
        }

        $user = $result->fetch_assoc();
        $stmt->close();
        $conn->close();

        // Hapus password dari data user
        $password = $user['password'];
        unset($user['password']);

        // Generate token
        $token = bin2hex(random_bytes(32));

        return [
            'success' => true,
            'message' => 'Test login successful',
            'data' => [
                'user' => $user,
                'token' => $token,
                'raw_password' => 'password123' // Asumsi password default
            ]
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Login failed: ' . $e->getMessage()
        ];
    }
}

// Jalankan test hanya jika diminta
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'register') {
    $result = testRegister();
} elseif ($action === 'login') {
    $result = testLogin();
} else {
    $result = [
        'success' => true,
        'message' => 'Test API is ready. Use ?action=register or ?action=login to run tests.'
    ];
}

// Kirim response
echo json_encode($result, JSON_PRETTY_PRINT);
exit;
