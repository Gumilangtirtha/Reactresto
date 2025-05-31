<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Get and decode JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['nama', 'telp', 'alamat'];
foreach ($required_fields as $field) {
    // Handle the special case for telp/telepon
    $value = $field === 'telp' && isset($data['telepon']) ? $data['telepon'] : $data[$field];
    
    if (!isset($value) || empty(trim($value))) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Field " . ($field === 'telp' ? 'telepon' : $field) . " is required"
        ]);
        exit;
    }
}

try {
    $conn = getConnection();
    
    // No need to check for email uniqueness anymore since we removed the email field
    
    // Insert new customer
    // Prepare values for binding
    $nama = $data['nama'];
    $telp = isset($data['telp']) ? $data['telp'] : $data['telepon'];
    $alamat = $data['alamat'];
    
    $stmt = $conn->prepare("INSERT INTO pelanggans (nama, telp, alamat) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nama, $telp, $alamat
    );
    
    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        
        // Get the inserted customer data
        $stmt = $conn->prepare("SELECT * FROM pelanggans WHERE id = ?");
        $stmt->bind_param("i", $newId);
        $stmt->execute();
        $result = $stmt->get_result();
        $customer_data = $result->fetch_assoc();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Customer added successfully',
            'data' => $customer_data
        ]);
    } else {
        throw new Exception($stmt->error);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to add customer: ' . $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>
