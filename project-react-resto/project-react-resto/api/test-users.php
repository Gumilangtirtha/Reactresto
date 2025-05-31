<?php
// Test script to check users API functionality
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

echo "<h1>Users API Test</h1>";

try {
    // Test database connection
    echo "<h2>1. Testing Database Connection</h2>";
    $conn = getConnection();
    echo "<p style='color: green;'>✓ Database connection successful</p>";
    
    // Check if users table exists
    echo "<h2>2. Checking Users Table</h2>";
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->num_rows > 0) {
        echo "<p style='color: green;'>✓ Users table exists</p>";
        
        // Check table structure
        echo "<h3>Table Structure:</h3>";
        $result = $conn->query("DESCRIBE users");
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            foreach ($row as $value) {
                echo "<td>" . htmlspecialchars($value) . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
        
        // Count users
        echo "<h3>User Count:</h3>";
        $result = $conn->query("SELECT COUNT(*) as count FROM users");
        $count = $result->fetch_assoc()['count'];
        echo "<p>Total users: <strong>$count</strong></p>";
        
        // Show sample users
        if ($count > 0) {
            echo "<h3>Sample Users:</h3>";
            $result = $conn->query("SELECT id, name, username, email, role, created_at FROM users LIMIT 5");
            echo "<table border='1' style='border-collapse: collapse;'>";
            echo "<tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Created At</th></tr>";
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row['id']) . "</td>";
                echo "<td>" . htmlspecialchars($row['name']) . "</td>";
                echo "<td>" . htmlspecialchars($row['username']) . "</td>";
                echo "<td>" . htmlspecialchars($row['email']) . "</td>";
                echo "<td>" . htmlspecialchars($row['role']) . "</td>";
                echo "<td>" . htmlspecialchars($row['created_at']) . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p style='color: orange;'>⚠ No users found in database</p>";
        }
        
    } else {
        echo "<p style='color: red;'>✗ Users table does not exist</p>";
        
        // Try to create the table
        echo "<h3>Creating Users Table:</h3>";
        $createTableSQL = "
        CREATE TABLE IF NOT EXISTS `users` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(255) NOT NULL,
            `username` varchar(255) NOT NULL,
            `email` varchar(255) NOT NULL,
            `email_verified_at` timestamp NULL DEFAULT NULL,
            `password` varchar(255) NOT NULL,
            `role` enum('admin','user') NOT NULL DEFAULT 'user',
            `remember_token` varchar(100) DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `users_email_unique` (`email`),
            UNIQUE KEY `users_username_unique` (`username`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        
        if ($conn->query($createTableSQL)) {
            echo "<p style='color: green;'>✓ Users table created successfully</p>";
            
            // Insert default admin user
            $adminPassword = password_hash('password', PASSWORD_DEFAULT);
            $insertAdminSQL = "
            INSERT INTO `users` (`name`, `username`, `email`, `password`, `role`, `created_at`, `updated_at`)
            SELECT 'Admin', 'admin', 'admin@example.com', '$adminPassword', 'admin', NOW(), NOW()
            WHERE NOT EXISTS (SELECT * FROM `users` WHERE `username` = 'admin');
            ";
            
            if ($conn->query($insertAdminSQL)) {
                echo "<p style='color: green;'>✓ Default admin user created (username: admin, password: password)</p>";
            } else {
                echo "<p style='color: red;'>✗ Failed to create admin user: " . $conn->error . "</p>";
            }
        } else {
            echo "<p style='color: red;'>✗ Failed to create users table: " . $conn->error . "</p>";
        }
    }
    
    // Test API endpoint
    echo "<h2>3. Testing API Endpoint</h2>";
    echo "<p><a href='users.php' target='_blank'>Test users.php directly</a></p>";
    echo "<p><a href='http://localhost/project-react-resto/api/users.php' target='_blank'>Test full URL</a></p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "<h2>4. Server Information</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Server: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p>Script Path: " . __FILE__ . "</p>";
?>
