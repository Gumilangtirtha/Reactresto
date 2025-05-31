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

require_once 'config.php';

// Koneksi ke database
$conn = getConnection();

function sendJsonResponse($success, $data = null, $message = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message,
        'code' => $code
    ]);
    exit;
}

// Handler untuk GET request (mendapatkan semua user atau user by ID)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if (isset($_GET['id'])) {
            $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
            if (!$id) {
                sendJsonResponse(false, null, 'Invalid user ID', 400);
            }
            
            $sql = "SELECT id, name, username, email, role, created_at, updated_at FROM users WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                sendJsonResponse(false, null, 'User not found', 404);
            }
            
            $user = $result->fetch_assoc();
            sendJsonResponse(true, $user, 'User retrieved successfully');
        } else {
            // Query untuk mengambil semua users
            $sql = "SELECT id, name, username, email, role, created_at, updated_at FROM users ORDER BY id ASC";
            $result = $conn->query($sql);

            if (!$result) {
                throw new Exception($conn->error);
            }
            
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            
            sendJsonResponse(true, $users, 'Data users berhasil diambil');
        }
    } catch (Exception $e) {
        sendJsonResponse(false, null, 'Failed to fetch users: ' . $e->getMessage(), 500);
    }
}

// Handler untuk POST request (membuat user baru)
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['name']) || !isset($data['password'])) {
        sendJsonResponse(false, null, 'Missing required fields', 400);
    }
    
    try {
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $role = isset($data['role']) ? $data['role'] : 'user';
        
        $sql = "INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss", $data['name'], $data['username'], $data['email'], $hashedPassword, $role);
        
        if ($stmt->execute()) {
            $userId = $stmt->insert_id;
            sendJsonResponse(true, ['id' => $userId], 'User created successfully', 201);
        } else {
            throw new Exception($stmt->error);
        }
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            sendJsonResponse(false, null, 'Username or email already exists', 409);
        } else {
            sendJsonResponse(false, null, 'Failed to create user: ' . $e->getMessage(), 500);
        }
    }
}

// Handler untuk PUT request (update user)
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        sendJsonResponse(false, null, 'User ID is required', 400);
    }
    
    try {
        $updates = [];
        $params = [];
        $types = "";
        
        if (isset($data['name'])) {
            $updates[] = "name = ?";
            $params[] = $data['name'];
            $types .= "s";
        }
        if (isset($data['username'])) {
            $updates[] = "username = ?";
            $params[] = $data['username'];
            $types .= "s";
        }
        if (isset($data['email'])) {
            $updates[] = "email = ?";
            $params[] = $data['email'];
            $types .= "s";
        }
        if (isset($data['role'])) {
            $updates[] = "role = ?";
            $params[] = $data['role'];
            $types .= "s";
        }
        if (isset($data['password'])) {
            $updates[] = "password = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
            $types .= "s";
        }
        
        if (empty($updates)) {
            sendJsonResponse(false, null, 'No fields to update', 400);
        }
        
        $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $params[] = $data['id'];
        $types .= "i";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                sendJsonResponse(true, null, 'User updated successfully');
            } else {
                sendJsonResponse(false, null, 'User not found or no changes made', 404);
            }
        } else {
            throw new Exception($stmt->error);
        }
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            sendJsonResponse(false, null, 'Username or email already exists', 409);
        } else {
            sendJsonResponse(false, null, 'Failed to update user: ' . $e->getMessage(), 500);
        }
    }
}

// Handler untuk DELETE request
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        sendJsonResponse(false, null, 'User ID is required', 400);
    }
    
    try {
        $sql = "DELETE FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $data['id']);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                sendJsonResponse(true, null, 'User deleted successfully');
            } else {
                sendJsonResponse(false, null, 'User not found', 404);
            }
        } else {
            throw new Exception($stmt->error);
        }
    } catch (Exception $e) {
        sendJsonResponse(false, null, 'Failed to delete user: ' . $e->getMessage(), 500);
    }
}

// Handler untuk metode HTTP yang tidak didukung
else {
    sendJsonResponse(false, null, 'Method not allowed', 405);
}
