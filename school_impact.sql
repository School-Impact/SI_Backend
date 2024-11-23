-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
<<<<<<< HEAD
-- Generation Time: Nov 23, 2024 at 01:44 PM
=======
-- Generation Time: Nov 22, 2024 at 11:15 PM
>>>>>>> c27a5f2a1ef4c2d25ac2be32c40cb798110a65af
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_impact`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_verification_tokens`
--

CREATE TABLE `email_verification_tokens` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `expired_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

<<<<<<< HEAD
-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 2,
  `expired_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
=======
--
-- Dumping data for table `email_verification_tokens`
--

INSERT INTO `email_verification_tokens` (`id`, `email`, `token`, `status`, `expired_at`, `created_at`) VALUES
(31, 'khazaro1523@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtoYXphcm8xNTIzQGdtYWlsLmNvbSIsImlhdCI6MTczMjMxMjc3NCwiZXhwIjoxNzMyMzEzMDc0fQ.Y7tkMrm4FjMJn1Va3Gwzqsd5nJNwvp2KaGRwFsf65Z0', 0, '2024-11-22 22:03:52', '2024-11-22 21:59:34');
>>>>>>> c27a5f2a1ef4c2d25ac2be32c40cb798110a65af

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `education` varchar(100) NOT NULL,
  `phone_number` int(15) NOT NULL,
  `password` varchar(255) NOT NULL,
<<<<<<< HEAD
  `verified_at` timestamp NULL DEFAULT NULL,
  `provider_id` int(11) DEFAULT NULL,
  `provider_token` text DEFAULT NULL,
  `remember_token` text DEFAULT NULL,
=======
  `verified_at` timestamp NOT NULL DEFAULT current_timestamp(),
>>>>>>> c27a5f2a1ef4c2d25ac2be32c40cb798110a65af
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
<<<<<<< HEAD
=======
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `education`, `phone_number`, `password`, `verified_at`, `created_at`) VALUES
(13, 'Nurfadila', 'khazaro1523@gmail.com', 'SMP 3 Padalarang', 8123456, '$2b$10$HfmlSiqhWy0cB3Pz0fWUNeYEYgCew2vm30rPEFWWAL049Bz1atucG', '2024-11-22 21:59:46', '2024-11-22 22:04:37');

--
>>>>>>> c27a5f2a1ef4c2d25ac2be32c40cb798110a65af
-- Indexes for dumped tables
--

--
-- Indexes for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD PRIMARY KEY (`id`);

--
<<<<<<< HEAD
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`);

--
=======
>>>>>>> c27a5f2a1ef4c2d25ac2be32c40cb798110a65af
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
<<<<<<< HEAD
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
=======
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
>>>>>>> c27a5f2a1ef4c2d25ac2be32c40cb798110a65af

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
<<<<<<< HEAD
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
=======
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
>>>>>>> c27a5f2a1ef4c2d25ac2be32c40cb798110a65af
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
