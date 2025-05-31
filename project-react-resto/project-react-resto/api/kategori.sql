-- SQL untuk membuat tabel kategori
CREATE TABLE IF NOT EXISTS `kategori` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(100) NOT NULL,
  `keterangan` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tambahkan beberapa data awal jika tabel kosong
INSERT INTO `kategori` (`nama_kategori`, `keterangan`) 
SELECT 'Makanan Utama', 'Kategori untuk makanan utama/main course' 
WHERE NOT EXISTS (SELECT 1 FROM `kategori` WHERE `nama_kategori` = 'Makanan Utama');

INSERT INTO `kategori` (`nama_kategori`, `keterangan`) 
SELECT 'Minuman', 'Kategori untuk berbagai jenis minuman' 
WHERE NOT EXISTS (SELECT 1 FROM `kategori` WHERE `nama_kategori` = 'Minuman');

INSERT INTO `kategori` (`nama_kategori`, `keterangan`) 
SELECT 'Dessert', 'Kategori untuk makanan penutup/pencuci mulut' 
WHERE NOT EXISTS (SELECT 1 FROM `kategori` WHERE `nama_kategori` = 'Dessert');

INSERT INTO `kategori` (`nama_kategori`, `keterangan`) 
SELECT 'Appetizer', 'Kategori untuk makanan pembuka' 
WHERE NOT EXISTS (SELECT 1 FROM `kategori` WHERE `nama_kategori` = 'Appetizer');