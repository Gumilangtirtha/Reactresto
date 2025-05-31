<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$user = 'root';
$pass = '';

try {
    // Try to connect without selecting a database first
    $conn = new mysqli($host, $user, $pass);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    echo "Connected to MySQL server successfully\n";
    
    // Check if database exists
    $result = $conn->query("SHOW DATABASES LIKE 'apirestoran'");
    if ($result->num_rows > 0) {
        echo "Database 'apirestoran' exists\n";
        
        // Select the database
        $conn->select_db('apirestoran');
        
        // Check if table exists
        $result = $conn->query("SHOW TABLES LIKE 'pelanggans'");
        if ($result->num_rows > 0) {
            echo "Table 'pelanggans' exists\n";
            
            // Count rows in table
            $result = $conn->query("SELECT COUNT(*) as count FROM pelanggans");
            $row = $result->fetch_assoc();
            echo "Number of rows in pelanggans table: " . $row['count'] . "\n";
            
            // Show table structure
            $result = $conn->query("DESCRIBE pelanggans");
            echo "\nTable structure:\n";
            while ($row = $result->fetch_assoc()) {
                echo $row['Field'] . " - " . $row['Type'] . "\n";
            }
        } else {
            echo "Table 'pelanggans' does not exist\n";
        }
    } else {
        echo "Database 'apirestoran' does not exist\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
