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

// Fungsi untuk mendapatkan informasi PHP
function getPhpInfo() {
    ob_start();
    phpinfo(INFO_MODULES);
    $phpinfo = ob_get_clean();
    
    // Extract hanya bagian yang penting
    $phpinfo = preg_replace('/<style>.*?<\/style>/s', '', $phpinfo);
    $phpinfo = preg_replace('/<img.*?>/s', '', $phpinfo);
    $phpinfo = strip_tags($phpinfo);
    $phpinfo = preg_replace('/\s+/', ' ', $phpinfo);
    
    return $phpinfo;
}

// Fungsi untuk mendapatkan informasi server
function getServerInfo() {
    $serverInfo = [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
        'request_time' => date('Y-m-d H:i:s', $_SERVER['REQUEST_TIME'] ?? time()),
        'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'Unknown',
        'mysql_version' => getMysqlVersion(),
        'extensions' => get_loaded_extensions(),
        'error_log_path' => ini_get('error_log'),
        'max_execution_time' => ini_get('max_execution_time'),
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size' => ini_get('post_max_size'),
        'memory_limit' => ini_get('memory_limit'),
        'display_errors' => ini_get('display_errors'),
        'log_errors' => ini_get('log_errors')
    ];
    
    return $serverInfo;
}

// Fungsi untuk mendapatkan versi MySQL
function getMysqlVersion() {
    try {
        $conn = new mysqli('localhost', 'root', '', 'apirestoran');
        if ($conn->connect_error) {
            return 'Connection failed: ' . $conn->connect_error;
        }
        $result = $conn->query('SELECT VERSION() as version');
        $version = $result->fetch_assoc()['version'];
        $conn->close();
        return $version;
    } catch (Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
}

// Fungsi untuk memeriksa tabel users
function checkUsersTable() {
    try {
        $conn = new mysqli('localhost', 'root', '', 'apirestoran');
        if ($conn->connect_error) {
            return ['error' => 'Connection failed: ' . $conn->connect_error];
        }
        
        // Cek apakah tabel users ada
        $result = $conn->query("SHOW TABLES LIKE 'users'");
        $tableExists = $result->num_rows > 0;
        
        if (!$tableExists) {
            return ['error' => 'Table users does not exist'];
        }
        
        // Cek struktur tabel users
        $result = $conn->query("DESCRIBE users");
        $columns = [];
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row;
        }
        
        // Cek jumlah user
        $result = $conn->query("SELECT COUNT(*) as count FROM users");
        $userCount = $result->fetch_assoc()['count'];
        
        // Ambil semua user (tanpa password)
        $users = [];
        $result = $conn->query("SELECT id, name, username, email, role, created_at, updated_at FROM users");
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        $conn->close();
        
        return [
            'table_exists' => $tableExists,
            'columns' => $columns,
            'user_count' => $userCount,
            'users' => $users
        ];
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Jalankan fungsi-fungsi
$result = [
    'server_info' => getServerInfo(),
    'users_table' => checkUsersTable()
];

// Kirim response
echo json_encode($result, JSON_PRETTY_PRINT);
exit;
