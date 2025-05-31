<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'apirestoran';

try {
    // Try to connect to MySQL
    $conn = new mysqli($host, $user, $pass);
    
    if ($conn->connect_error) {
        die("MySQL Connection failed: " . $conn->connect_error);
    }
    echo "Connected to MySQL successfully\n";
    
    // Create database if not exists
    if (!$conn->query("CREATE DATABASE IF NOT EXISTS $dbname")) {
        die("Error creating database: " . $conn->error);
    }
    echo "Database 'apirestoran' exists or was created\n";
    
    // Select the database
    $conn->select_db($dbname);
    
    // Create pelanggans table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS pelanggans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        alamat TEXT NOT NULL,
        telp VARCHAR(15) NOT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    if (!$conn->query($sql)) {
        die("Error creating table: " . $conn->error);
    }
    echo "Table 'pelanggans' exists or was created\n";
    
    // Check if there's any data in the pelanggans table
    $result = $conn->query("SELECT COUNT(*) as count FROM pelanggans");
    if ($result) {
        $count = $result->fetch_assoc()['count'];
        echo "Number of records in pelanggans table: $count\n";
        
        // Insert sample data if table is empty
        if ($count == 0) {
            $sql = "INSERT INTO pelanggans (nama, alamat, telp) VALUES 
                ('John Doe', 'Jl. Contoh No. 1', '081234567890'),
                ('Jane Smith', 'Jl. Sample No. 2', '089876543210')";
            if ($conn->query($sql)) {
                echo "Sample data inserted successfully\n";
            } else {
                echo "Error inserting sample data: " . $conn->error . "\n";
            }
        }
    }
    
    // Show the table structure
    $result = $conn->query("DESCRIBE pelanggans");
    echo "\nTable structure:\n";
    while ($row = $result->fetch_assoc()) {
        echo "{$row['Field']} - {$row['Type']}" . ($row['Null'] === 'NO' ? ' NOT NULL' : '') . 
             (isset($row['Default']) ? " DEFAULT '{$row['Default']}'" : '') . "\n";
    }
    
    // Show some sample data
    $result = $conn->query("SELECT * FROM pelanggans");
    echo "\nCurrent data in pelanggans table:\n";
    while ($row = $result->fetch_assoc()) {
        echo "ID: {$row['id']}, Name: {$row['nama']}, Phone: {$row['telp']}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
    
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
