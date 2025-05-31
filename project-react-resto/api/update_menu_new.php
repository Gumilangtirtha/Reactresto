<?php
require_once 'config.php';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Koneksi gagal: " . $conn->connect_error);
    }

    // Get menu ID and validate it
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    if ($id <= 0) {
        throw new Exception('ID menu tidak valid');
    }

    // Validate required fields
    $required_fields = ['menu', 'harga', 'id_kategori', 'deskripsi'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Field $field harus diisi");
        }
    }

    // Get current menu data
    $stmt = $conn->prepare("SELECT gambar FROM menus WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Menu tidak ditemukan');
    }
    
    $current_menu = $result->fetch_assoc();
    $stmt->close();

    // Handle image upload if exists
    $gambar = $current_menu['gambar']; // Keep existing image name by default

    if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
        // Validate file type
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file_type = $_FILES['gambar']['type'];
        
        if (!in_array($file_type, $allowed_types)) {
            throw new Exception('Tipe file tidak diizinkan. Gunakan JPG, PNG, atau GIF');
        }

        // Validate file size (max 2MB)
        if ($_FILES['gambar']['size'] > 2 * 1024 * 1024) {
            throw new Exception('Ukuran file terlalu besar. Maksimal 2MB');
        }

        // Generate unique filename
        $extension = pathinfo($_FILES['gambar']['name'], PATHINFO_EXTENSION);
        $new_filename = uniqid() . '.' . $extension;
        $upload_path = '../uploads/' . $new_filename;

        // Move uploaded file
        if (move_uploaded_file($_FILES['gambar']['tmp_name'], $upload_path)) {
            // Delete old image if exists
            if ($current_menu['gambar'] && file_exists('../uploads/' . $current_menu['gambar'])) {
                unlink('../uploads/' . $current_menu['gambar']);
            }
            $gambar = $new_filename;
        } else {
            throw new Exception('Gagal mengunggah file');
        }
    }

    // Update menu data
    $stmt = $conn->prepare("
        UPDATE menus 
        SET menu = ?, 
            harga = ?, 
            id_kategori = ?, 
            deskripsi = ?, 
            gambar = ?,
            updated_at = NOW()
        WHERE id = ?
    ");

    $menu = $_POST['menu'];
    $harga = floatval($_POST['harga']);
    $id_kategori = intval($_POST['id_kategori']);
    $deskripsi = $_POST['deskripsi'];

    $stmt->bind_param(
        "sdissi",
        $menu,
        $harga,
        $id_kategori,
        $deskripsi,
        $gambar,
        $id
    );

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Menu berhasil diperbarui',
            'data' => [
                'id' => $id,
                'menu' => $menu,
                'harga' => $harga,
                'id_kategori' => $id_kategori,
                'deskripsi' => $deskripsi,
                'gambar' => $gambar,
                'gambar_url' => 'http://' . $_SERVER['HTTP_HOST'] . '/project-react-resto/uploads/' . $gambar
            ]
        ]);
    } else {
        throw new Exception('Gagal memperbarui data menu');
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
