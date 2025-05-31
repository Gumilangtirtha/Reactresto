<?php
require_once 'config.php';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Get menu ID from URL parameter
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode([
        'success' => false,
        'message' => 'ID menu tidak valid'
    ]);
    exit;
}

try {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Koneksi gagal: " . $conn->connect_error);
    }

    // Prepare SQL query with join to get category name
    $sql = "SELECT m.*, k.nama as kategori_nama 
            FROM menus m 
            LEFT JOIN kategori k ON m.id_kategori = k.id 
            WHERE m.id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $menu = $result->fetch_assoc();
        
        // Add full URL to image if exists
        if ($menu['gambar']) {
            $menu['gambar_url'] = 'http://' . $_SERVER['HTTP_HOST'] . '/project-react-resto/uploads/' . $menu['gambar'];
        }

        echo json_encode([
            'success' => true,
            'data' => $menu
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Menu tidak ditemukan'
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
