-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 12, 2025 at 12:14 PM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Games Tips and Tricks`
--

-- --------------------------------------------------------

--
-- Table structure for table `Badge`
--

CREATE TABLE `Badge` (
  `badgeID` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Badge`
--

INSERT INTO `Badge` (`badgeID`, `name`, `description`) VALUES
(1, 'Master Strategist', 'Awarded for posting top strategy tips.'),
(2, 'Comment King', 'Given to users with 50+ comments.'),
(3, 'Upvote Legend', 'Earned by getting 100+ upvotes.');

-- --------------------------------------------------------

--
-- Table structure for table `BadgeCriteria`
--

CREATE TABLE `BadgeCriteria` (
  `criteriaID` int NOT NULL,
  `badgeID` int NOT NULL,
  `requirement` varchar(255) NOT NULL,
  `metric` enum('Tips Posted','Upvotes Received','Comments Made') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `BadgeCriteria`
--

INSERT INTO `BadgeCriteria` (`criteriaID`, `badgeID`, `requirement`, `metric`) VALUES
(1, 1, 'Post 10 Strategy Tips', 'Tips Posted'),
(2, 2, 'Make 50 Comments', 'Comments Made'),
(3, 3, 'Receive 100 Upvotes', 'Upvotes Received');

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `categoryID` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`categoryID`, `name`) VALUES
(4, 'Multiplayer'),
(3, 'RPG'),
(2, 'Shooter'),
(1, 'Strategy');

-- --------------------------------------------------------

--
-- Table structure for table `Comments`
--

CREATE TABLE `Comments` (
  `commentID` int NOT NULL,
  `userID` int NOT NULL,
  `tipID` int NOT NULL,
  `likeCounter` int NOT NULL DEFAULT '0',
  `comment` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Comments`
--

INSERT INTO `Comments` (`commentID`, `userID`, `tipID`, `likeCounter`, `comment`, `createdAt`) VALUES
(1, 2, 1, 5, 'Great tip! Helped me a lot.', '2025-03-10 14:32:38'),
(2, 3, 2, 3, 'Nice strategy, I’ll try it.', '2025-03-10 14:32:38'),
(3, 1, 3, 8, 'This was really useful.', '2025-03-10 14:32:38');

-- --------------------------------------------------------

--
-- Table structure for table `Game`
--

CREATE TABLE `Game` (
  `gameID` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `releaseDate` date DEFAULT NULL,
  `developer` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Game`
--

INSERT INTO `Game` (`gameID`, `title`,`description`, `releaseDate`, `developer`) VALUES
(1, 'CyberQuest', 'When one gets trapped in the middle of a high-tech cyberworld, not often do you get the choice to choose how. But, here, you have a choice... and choose right, or it may very well be your last. Puzzles and more await in this strategy game!', '2023-09-15', 'Cyber Studios'),
(2, 'FantasyWars', 'Freely explore the vast fields of Eeve, traverse the lands of Gaia, and find the heart of Tifiti in this open-world RPG. Explore and take on quests, or, win turf-war battles against different classes! Choose YOUR destiny!', '2022-07-10', 'Epic Games'),
(3, 'SpaceInvaders3000', 'A fast-paced action first-person-shooter game, where you take on the role as the last surviving captain of the STELLA in a intergalactic space station infested with hostile aliens, blast your way out and escape before everything crashes straight into the SUN!', '2021-11-20', 'Galactic Devs');

-- --------------------------------------------------------

--
-- Table structure for table `Profile`
--

CREATE TABLE `Profile` (
  `profileID` int NOT NULL,
  `userID` int NOT NULL,
  `progress` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Profile`
--

INSERT INTO `Profile` (`profileID`, `userID`, `progress`) VALUES
(1, 1, 'Level 10 - Expert Gamer'),
(2, 2, 'Level 5 - Intermediate'),
(3, 3, 'Level 15 - Pro Player');

-- --------------------------------------------------------

--
-- Table structure for table `Tip`
--

CREATE TABLE `Tip` (
  `tipID` int NOT NULL,
  `userID` int NOT NULL,
  `gameID` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Tip`
--

INSERT INTO `Tip` (`tipID`, `userID`, `gameID`, `title`, `content`, `createdAt`) VALUES
(1, 1, 1, 'Best Weapons in CyberQuest', 'Here are the top weapons you should use...', '2025-03-10 14:31:51'),
(2, 2, 2, 'Winning in Fantasy Wars', 'Master these strategies to win every battle.', '2025-03-10 14:31:51'),
(3, 3, 3, 'Avoiding Enemies in Space Invaders', 'Learn how to dodge bullets and stay alive longer.', '2025-03-10 14:31:51');

-- --------------------------------------------------------

--
-- Table structure for table `TipCategory`
--

CREATE TABLE `TipCategory` (
  `tipID` int NOT NULL,
  `categoryID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `TipCategory`
--

INSERT INTO `TipCategory` (`tipID`, `categoryID`) VALUES
(1, 1),
(3, 2),
(2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userID` int NOT NULL,
  `username` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_joined` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userID`, `username`, `email`, `password`, `date_joined`) VALUES
(1, 'JohnDoe', 'john@example.com', 'hashedpassword1', '2025-03-10 14:29:21'),
(2, 'JaneSmith', 'jane@example.com', 'hashedpassword2', '2025-03-10 14:29:21'),
(3, 'MikeGamer', 'mike@example.com', 'hashedpassword3', '2025-03-10 14:29:21');

-- --------------------------------------------------------

--
-- Table structure for table `UserBadge`
--

CREATE TABLE `UserBadge` (
  `userID` int NOT NULL,
  `badgeID` int NOT NULL,
  `earned_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `UserBadge`
--

INSERT INTO `UserBadge` (`userID`, `badgeID`, `earned_at`) VALUES
(1, 1, '2025-03-10 14:33:12'),
(2, 2, '2025-03-10 14:33:12'),
(3, 3, '2025-03-10 14:33:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Badge`
--
ALTER TABLE `Badge`
  ADD PRIMARY KEY (`badgeID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `BadgeCriteria`
--
ALTER TABLE `BadgeCriteria`
  ADD PRIMARY KEY (`criteriaID`),
  ADD KEY `badgeID` (`badgeID`);

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`categoryID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Comments`
--
ALTER TABLE `Comments`
  ADD PRIMARY KEY (`commentID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `tipID` (`tipID`);

--
-- Indexes for table `Game`
--
ALTER TABLE `Game`
  ADD PRIMARY KEY (`gameID`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Indexes for table `Profile`
--
ALTER TABLE `Profile`
  ADD PRIMARY KEY (`profileID`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- Indexes for table `Tip`
--
ALTER TABLE `Tip`
  ADD PRIMARY KEY (`tipID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `gameID` (`gameID`);

--
-- Indexes for table `TipCategory`
--
ALTER TABLE `TipCategory`
  ADD PRIMARY KEY (`tipID`,`categoryID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `UserBadge`
--
ALTER TABLE `UserBadge`
  ADD PRIMARY KEY (`userID`,`badgeID`),
  ADD KEY `badgeID` (`badgeID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Badge`
--
ALTER TABLE `Badge`
  MODIFY `badgeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `BadgeCriteria`
--
ALTER TABLE `BadgeCriteria`
  MODIFY `criteriaID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `categoryID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Comments`
--
ALTER TABLE `Comments`
  MODIFY `commentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Game`
--
ALTER TABLE `Game`
  MODIFY `gameID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Profile`
--
ALTER TABLE `Profile`
  MODIFY `profileID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Tip`
--
ALTER TABLE `Tip`
  MODIFY `tipID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `BadgeCriteria`
--
ALTER TABLE `BadgeCriteria`
  ADD CONSTRAINT `badgecriteria_ibfk_1` FOREIGN KEY (`badgeID`) REFERENCES `Badge` (`badgeID`) ON DELETE CASCADE;

--
-- Constraints for table `Comments`
--
ALTER TABLE `Comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`tipID`) REFERENCES `Tip` (`tipID`) ON DELETE CASCADE;

--
-- Constraints for table `Profile`
--
ALTER TABLE `Profile`
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `Tip`
--
ALTER TABLE `Tip`
  ADD CONSTRAINT `tip_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `tip_ibfk_2` FOREIGN KEY (`gameID`) REFERENCES `Game` (`gameID`) ON DELETE CASCADE;

--
-- Constraints for table `TipCategory`
--
ALTER TABLE `TipCategory`
  ADD CONSTRAINT `tipcategory_ibfk_1` FOREIGN KEY (`tipID`) REFERENCES `Tip` (`tipID`) ON DELETE CASCADE,
  ADD CONSTRAINT `tipcategory_ibfk_2` FOREIGN KEY (`categoryID`) REFERENCES `Category` (`categoryID`) ON DELETE CASCADE;

--
-- Constraints for table `UserBadge`
--
ALTER TABLE `UserBadge`
  ADD CONSTRAINT `userbadge_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `userbadge_ibfk_2` FOREIGN KEY (`badgeID`) REFERENCES `Badge` (`badgeID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
