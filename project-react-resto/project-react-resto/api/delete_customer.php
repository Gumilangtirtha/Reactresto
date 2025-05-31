<?php
// Enable CORS to allow requests from your React app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if the request is a DELETE request
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get and decode JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
    exit();
}

try {
    // Database connection
    require_once 'config.php';
    $conn = getConnection();
    
    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    // Check if the customer exists first
    $check_stmt = $conn->prepare("SELECT id FROM pelanggans WHERE id = ?");
    if (!$check_stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }
    
    $check_stmt->bind_param("i", $data['id']);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Pelanggan tidak ditemukan']);
        exit();
    }
    $check_stmt->close();
    
    // Delete customer
    $stmt = $conn->prepare("DELETE FROM pelanggans WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Prepare delete statement failed: " . $conn->error);
    }
    
    $stmt->bind_param("i", $data['id']);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Pelanggan berhasil dihapus']);
        } else {
            throw new Exception("Delete operation failed: No rows affected");
        }
    } else {
        throw new Exception("Execute delete failed: " . $stmt->error);
    }
    
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Failed to delete customer: ' . $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>
