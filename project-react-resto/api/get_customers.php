<?php
// Enable CORS to allow requests from your React app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

error_log("Starting get_customers.php script"); // Debug log

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    error_log("Handling OPTIONS request"); // Debug log
    exit();
}

// Check if the request is a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']); // Debug log
    echo json_encode(['success' => false, 'message' => 'Only GET requests are allowed']);
    exit();
}

require_once 'config.php';

try {
    error_log("Attempting database connection"); // Debug log
    $conn = getConnection();
    error_log("Database connection successful"); // Debug log
    
    // Get all customers from pelanggans table with proper field ordering
    $sql = "SELECT id, nama, telp, alamat, created_at, updated_at FROM pelanggans ORDER BY id DESC";
    error_log("Executing SQL: " . $sql); // Debug log
    
    $result = $conn->query($sql);
    
    if ($result === false) {
        error_log("SQL Error: " . $conn->error); // Debug log
        throw new Exception("SQL Error: " . $conn->error);
    }
    
    error_log("Query executed successfully"); // Debug log
    
    $customers = [];
    while ($row = $result->fetch_assoc()) {
        // Format dates if needed
        if (isset($row['created_at'])) {
            $row['created_at'] = date('Y-m-d H:i:s', strtotime($row['created_at']));
        }
        if (isset($row['updated_at'])) {
            $row['updated_at'] = date('Y-m-d H:i:s', strtotime($row['updated_at']));
        }
        $customers[] = $row;
    }
    
    error_log("Found " . count($customers) . " customers"); // Debug log
    
    // Return success response with the data
    echo json_encode([
        'success' => true, 
        'message' => 'Customers retrieved successfully!',
        'data' => $customers
    ]);
    error_log("Response sent successfully"); // Debug log
    
} catch (Exception $e) {
    error_log("Error in get_customers.php: " . $e->getMessage()); // Debug log
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
        error_log("Database connection closed"); // Debug log
    }
}
?>
