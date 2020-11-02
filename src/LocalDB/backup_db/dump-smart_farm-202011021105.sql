-- MariaDB dump 10.17  Distrib 10.5.5-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: smart_farm
-- ------------------------------------------------------
-- Server version	10.5.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `control`
--

DROP TABLE IF EXISTS `control`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `control` (
  `id` varchar(100) NOT NULL,
  `type_id` varchar(100) DEFAULT NULL,
  `mac_address` varchar(100) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `value` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `control`
--

LOCK TABLES `control` WRITE;
/*!40000 ALTER TABLE `control` DISABLE KEYS */;
INSERT INTO `control` VALUES ('cI7oo4PmMo1sfuAdV13X','34spr9WWTedwQnS73Vav','DC:4F:22:89:25:F9','2020-09-09 17:00:00','2020-09-09 18:00:00','running','0');
/*!40000 ALTER TABLE `control` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `control_config`
--

DROP TABLE IF EXISTS `control_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `control_config` (
  `id` varchar(100) NOT NULL,
  `control_id` varchar(100) DEFAULT NULL,
  `toggle_interval` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`toggle_interval`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `control_config`
--

LOCK TABLES `control_config` WRITE;
/*!40000 ALTER TABLE `control_config` DISABLE KEYS */;
INSERT INTO `control_config` VALUES ('dK96QYxOgIMrJS5lbrgo','cI7oo4PmMo1sfuAdV13X',NULL);
/*!40000 ALTER TABLE `control_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `control_log`
--

DROP TABLE IF EXISTS `control_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `control_log` (
  `id` varchar(100) NOT NULL,
  `control_id` varchar(100) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `value` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `control_log`
--

LOCK TABLES `control_log` WRITE;
/*!40000 ALTER TABLE `control_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `control_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `control_type`
--

DROP TABLE IF EXISTS `control_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `control_type` (
  `id` varchar(100) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `default_value` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `control_type`
--

LOCK TABLES `control_type` WRITE;
/*!40000 ALTER TABLE `control_type` DISABLE KEYS */;
INSERT INTO `control_type` VALUES ('34spr9WWTedwQnS73Vav','switch','0');
/*!40000 ALTER TABLE `control_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `farm`
--

DROP TABLE IF EXISTS `farm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `farm` (
  `id` varchar(100) NOT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `plant_type` varchar(100) DEFAULT NULL,
  `serial_key` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farm`
--

LOCK TABLES `farm` WRITE;
/*!40000 ALTER TABLE `farm` DISABLE KEYS */;
INSERT INTO `farm` VALUES ('z7DQriHo8n3L4ZGkc3yX','2020-09-13 04:11:11','Hardware farm','fruit&vegateble','123');
/*!40000 ALTER TABLE `farm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `farm_config`
--

DROP TABLE IF EXISTS `farm_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `farm_config` (
  `id` varchar(100) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `farm_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farm_config`
--

LOCK TABLES `farm_config` WRITE;
/*!40000 ALTER TABLE `farm_config` DISABLE KEYS */;
INSERT INTO `farm_config` VALUES ('yQiEkkJolbsL3EicNOUD ','{\r\n   \"description\":\"asdasdasd\",\r\n   \"details\":\"\",\r\n   \"img_url\":\"https://firebasestorage.googleapis.com/v0/b/dev-strawberry-74279.appspot.com/o/6a02d01441468de6c821213835505a74.jpg?alt=media&token=9a2befb8-5029-442f-b93f-10baaae34825\",\r\n   \"name\":\"\",\r\n   \"revision\":1,\r\n   \"status\":\"active\"\r\n}','z7DQriHo8n3L4ZGkc3yX');
/*!40000 ALTER TABLE `farm_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor`
--

DROP TABLE IF EXISTS `sensor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensor` (
  `id` varchar(100) NOT NULL,
  `mac_address` varchar(100) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `type_id` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `value` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor`
--

LOCK TABLES `sensor` WRITE;
/*!40000 ALTER TABLE `sensor` DISABLE KEYS */;
INSERT INTO `sensor` VALUES ('rMaB5XfQAk3AklUctxB5','DC:4F:22:89:26:05','2020-09-09 17:00:00',NULL,'U41eih3VyrdoBdbFNz3o','running','65.30'),('WGKY7qXggBzzTRjAFxjd','DC:4F:22:89:26:05','2020-09-01 04:11:11',NULL,'7Rj8D1TcgiGIafwVQ5mL','running','26.40');
/*!40000 ALTER TABLE `sensor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor_config`
--

DROP TABLE IF EXISTS `sensor_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensor_config` (
  `id` varchar(100) NOT NULL,
  `sensor_id` varchar(100) DEFAULT NULL,
  `log_interval` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor_config`
--

LOCK TABLES `sensor_config` WRITE;
/*!40000 ALTER TABLE `sensor_config` DISABLE KEYS */;
INSERT INTO `sensor_config` VALUES ('fnuxPjBN3zMPurwukf8Y','WGKY7qXggBzzTRjAFxjd',600),('RBL0QmMxNTmechLY5DgD','rMaB5XfQAk3AklUctxB5',600);
/*!40000 ALTER TABLE `sensor_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor_type`
--

DROP TABLE IF EXISTS `sensor_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensor_type` (
  `id` varchar(100) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor_type`
--

LOCK TABLES `sensor_type` WRITE;
/*!40000 ALTER TABLE `sensor_type` DISABLE KEYS */;
INSERT INTO `sensor_type` VALUES ('7Rj8D1TcgiGIafwVQ5mL','air_temp'),('dbUxmFirw9qeuVJKmMYI','light'),('U41eih3VyrdoBdbFNz3o','air_humid');
/*!40000 ALTER TABLE `sensor_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'smart_farm'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-02 11:05:18
