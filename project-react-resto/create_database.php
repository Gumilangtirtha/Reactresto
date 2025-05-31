<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully<br>";

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS apirestoran";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Select the database
$conn->select_db("apirestoran");

// Create migrations table
$sql = "CREATE TABLE IF NOT EXISTS migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INT NOT NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table migrations created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

// Create users table
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table users created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

// Create pelanggans (customers) table
$sql = "CREATE TABLE IF NOT EXISTS pelanggans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    telp VARCHAR(15) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table pelanggans created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

// Create menus table
$sql = "CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    gambar VARCHAR(255) NULL,
    harga DECIMAL(10, 2) NOT NULL,
    kategori_id INT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table menus created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

// Show tables
$sql = "SHOW TABLES";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<h3>Tables in apirestoran database:</h3>";
    echo "<ul>";
    while($row = $result->fetch_assoc()) {
        echo "<li>" . $row["Tables_in_apirestoran"] . "</li>";
    }
    echo "</ul>";
} else {
    echo "0 results";
}

$conn->close();
echo "Database setup completed!";
?>
