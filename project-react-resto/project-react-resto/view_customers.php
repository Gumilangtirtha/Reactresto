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

// Get all customers
$sql = "SELECT * FROM pelanggans ORDER BY id DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restaurant Customers</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="mb-4">Restaurant Customers Database</h1>
        
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h2 class="mb-0">Customer List</h2>
            </div>
            <div class="card-body">
                <?php if ($result->num_rows > 0): ?>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while($row = $result->fetch_assoc()): ?>
                                <tr>
                                    <td><?php echo $row["id"]; ?></td>
                                    <td><?php echo $row["nama"]; ?></td>
                                    <td><?php echo $row["alamat"]; ?></td>
                                    <td><?php echo $row["telp"]; ?></td>
                                    <td><?php echo $row["created_at"]; ?></td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <div class="alert alert-info">
                        No customers found in the database.
                    </div>
                <?php endif; ?>
                
                <div class="mt-3">
                    <a href="http://localhost:5173/" class="btn btn-primary">Go to Customer Form</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

<?php
// Close connection
$conn->close();
?>
