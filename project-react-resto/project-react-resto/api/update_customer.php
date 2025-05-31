<?php
// Enable CORS to allow requests from your React app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if the request is a PUT request
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Only PUT requests are allowed']);
    exit();
}

// Get the JSON data from the request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Check if the required fields are present
if (!isset($data['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
    exit();
}

$required_fields = ['nama', 'telepon', 'alamat'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => "Field $field is required"]);
        exit();
    }
}

// Database connection parameters
require_once 'config.php';

try {
    $conn = getConnection();
    
    // No need to check for email uniqueness anymore since we removed the email field
    
    // Prepare and bind the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("UPDATE pelanggans SET nama = ?, telp = ?, alamat = ? WHERE id = ?");
    $stmt->bind_param("sssi", 
        $data['nama'],
        $data['telepon'], // Frontend sends as telepon
        $data['alamat'],
        $data['id']
    );
    
    // Execute the statement
    if ($stmt->execute()) {
        // Check if any rows were affected
        if ($stmt->affected_rows > 0) {
            // Get the updated customer data
            $stmt = $conn->prepare("SELECT * FROM pelanggans WHERE id = ?");
            $stmt->bind_param("i", $data['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $customer_data = $result->fetch_assoc();
            
            // Return success response with the updated data
            echo json_encode([
                'success' => true, 
                'message' => 'Customer updated successfully!',
                'data' => $customer_data
            ]);
        } else {
            // No rows were updated, customer might not exist
            http_response_code(404); // Not Found
            echo json_encode(['success' => false, 'message' => 'Customer not found']);
        }
    } else {
        throw new Exception($stmt->error);
    }
    
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Failed to update customer: ' . $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>
