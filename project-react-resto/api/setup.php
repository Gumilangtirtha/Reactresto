<?php
require_once 'config.php';

// Fungsi untuk membuat tabel users
function createUsersTable() {
    $conn = getConnection();

    // SQL untuk membuat tabel users
    // Hapus tabel jika sudah ada untuk memastikan struktur yang benar
    $conn->query("DROP TABLE IF EXISTS `users`");

    // Buat tabel baru
    $sql = "
    CREATE TABLE IF NOT EXISTS `users` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `name` varchar(255) NOT NULL,
      `username` varchar(255) NOT NULL,
      `email` varchar(255) NOT NULL,
      `email_verified_at` timestamp NULL DEFAULT NULL,
      `password` varchar(255) NOT NULL,
      `role` enum('admin','user') NOT NULL DEFAULT 'user',
      `remember_token` varchar(100) DEFAULT NULL,
      `created_at` timestamp NULL DEFAULT NULL,
      `updated_at` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (`id`),
      UNIQUE KEY `users_email_unique` (`email`),
      UNIQUE KEY `users_username_unique` (`username`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";

    if ($conn->query($sql) === TRUE) {
        echo "Tabel users berhasil dibuat<br>";
    } else {
        echo "Error membuat tabel users: " . $conn->error . "<br>";
    }

    // Cek apakah tabel kosong
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    $row = $result->fetch_assoc();

    if ($row['count'] == 0) {
        // Tambahkan user admin default
        $name = "Admin";
        $username = "admin";
        $email = "admin@example.com";
        $password = password_hash("password", PASSWORD_DEFAULT); // Password default: password
        $role = "admin";
        $now = date('Y-m-d H:i:s');

        $sql = "INSERT INTO users (name, username, email, password, role, created_at, updated_at)
                VALUES ('$name', '$username', '$email', '$password', '$role', '$now', '$now')";

        if ($conn->query($sql) === TRUE) {
            echo "User admin default berhasil ditambahkan<br>";
            echo "Username: admin<br>";
            echo "Password: password<br>";
        } else {
            echo "Error menambahkan user admin: " . $conn->error . "<br>";
        }
    }

    $conn->close();
}

// Jalankan fungsi untuk membuat tabel
createUsersTable();

echo "<p>Setup selesai. <a href='../'>Kembali ke aplikasi</a></p>";
