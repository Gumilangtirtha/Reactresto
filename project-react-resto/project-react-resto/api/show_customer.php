<?php
// Enable CORS to allow requests from your React app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if the request is a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Only GET requests are allowed']);
    exit();
}

// Check if ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
    exit();
}

$id = $_GET['id'];

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "apirestoran";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Prepare and bind the SQL statement to prevent SQL injection
$stmt = $conn->prepare("SELECT * FROM pelanggans WHERE id = ?");
$stmt->bind_param("i", $id);

// Execute the statement
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $customer = $result->fetch_assoc();
    
    // Return success response with the data
    echo json_encode([
        'success' => true, 
        'message' => 'Customer retrieved successfully!',
        'data' => $customer
    ]);
} else {
    // Return error response
    http_response_code(404); // Not Found
    echo json_encode([
        'success' => false, 
        'message' => 'Customer not found with ID: ' . $id
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
