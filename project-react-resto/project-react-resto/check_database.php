<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "apirestoran";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h1>Database Structure for 'apirestoran'</h1>";

// Get all tables
$sql = "SHOW TABLES";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<h2>Tables:</h2>";
    echo "<ul>";
    
    // Store table names
    $tables = array();
    
    while($row = $result->fetch_assoc()) {
        $tableName = $row["Tables_in_" . $dbname];
        $tables[] = $tableName;
        echo "<li><strong>" . $tableName . "</strong></li>";
    }
    echo "</ul>";
    
    // Show structure for each table
    echo "<h2>Table Structures:</h2>";
    
    foreach ($tables as $table) {
        echo "<h3>Structure for table '$table':</h3>";
        
        $sql = "DESCRIBE $table";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            echo "<table border='1' cellpadding='5' cellspacing='0'>";
            echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
            
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["Field"] . "</td>";
                echo "<td>" . $row["Type"] . "</td>";
                echo "<td>" . $row["Null"] . "</td>";
                echo "<td>" . $row["Key"] . "</td>";
                echo "<td>" . ($row["Default"] === NULL ? "NULL" : $row["Default"]) . "</td>";
                echo "<td>" . $row["Extra"] . "</td>";
                echo "</tr>";
            }
            
            echo "</table>";
        } else {
            echo "No columns found for table '$table'";
        }
    }
} else {
    echo "No tables found in database";
}

$conn->close();
?>
