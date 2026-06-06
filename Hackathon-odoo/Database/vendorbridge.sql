-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vendorbridge
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `details` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,1,'Create Vendor','Vendor Acme Corp (acme@example.com) created successfully','2026-06-06 08:35:17'),(2,1,'Delete Vendor','Vendor ID 1 deleted','2026-06-06 08:54:09'),(3,1,'Create Vendor','Vendor jack (jeelpatel472004@gmail.com) created successfully','2026-06-06 08:54:34'),(4,1,'Create RFQ','RFQ \"Laptop\" (ID: 1) created','2026-06-06 08:56:15'),(5,4,'Submit Quotation','Quotation for RFQ ID 1 submitted by vendor jack (pricing: ₹5000000)','2026-06-06 08:57:31'),(6,1,'Create RFQ','RFQ \"Books\" (ID: 2) created','2026-06-06 09:07:33'),(7,5,'Submit Quotation','Quotation for RFQ ID 2 submitted by vendor magiji (pricing: ₹40000)','2026-06-06 09:08:20'),(8,4,'Submit Quotation','Quotation for RFQ ID 2 submitted by vendor jack (pricing: ₹450000)','2026-06-06 09:08:52'),(9,1,'Quotation Review','Quotation ID 1 was Approved with remarks: \"Approved by manager.\"','2026-06-06 09:09:23'),(10,1,'Quotation Review','Quotation ID 2 was Approved with remarks: \"Approved by manager.\"','2026-06-06 09:09:58'),(11,6,'Create RFQ','RFQ \"Aperiam necessitatib\" (ID: 3) created','2026-06-06 09:19:07'),(12,4,'Submit Quotation','Quotation for RFQ ID 3 submitted by vendor jack (pricing: ₹10000)','2026-06-06 09:24:07'),(13,1,'Quotation Review','Quotation ID 4 was Submitted with remarks: \"Recommended by procurement officer.\"','2026-06-06 09:24:57'),(14,6,'Quotation Review','Quotation ID 4 was Approved with remarks: \"Approved by manager.\"','2026-06-06 09:25:31'),(15,1,'Generate Purchase Order','Purchase Order PO-2026-0001 (ID: 1) generated from Quotation ID 4','2026-06-06 09:37:25'),(16,4,'Update PO Status','Purchase Order ID 1 status updated to Accepted','2026-06-06 09:38:03'),(17,4,'Generate Invoice','Invoice INV-2026-0001 generated for PO PO-2026-0001','2026-06-06 09:38:06'),(18,1,'Create RFQ','RFQ \"Excepteur ipsum bla\" (ID: 4) created','2026-06-06 10:05:53'),(19,1,'Delete RFQ','RFQ ID 1 deleted','2026-06-06 10:17:09'),(20,4,'Submit Quotation','Quotation for RFQ ID 4 submitted by vendor jack (pricing: ₹100)','2026-06-06 11:32:05'),(21,1,'Quotation Review','Quotation ID 5 was Approved with remarks: \"Approved by manager.\"','2026-06-06 11:32:37'),(22,1,'Generate Purchase Order','Purchase Order PO-2026-0002 (ID: 2) generated from Quotation ID 5','2026-06-06 11:32:44'),(23,4,'Update PO Status','Purchase Order ID 2 status updated to Accepted','2026-06-06 11:33:13'),(24,1,'Generate Invoice','Invoice INV-2026-0002 generated for PO PO-2026-0002','2026-06-06 11:33:24'),(25,1,'Create RFQ','RFQ \"Laptops\" (ID: 5) created','2026-06-06 11:59:27'),(26,4,'Submit Quotation','Quotation for RFQ ID 5 submitted by vendor jack (pricing: ₹50000)','2026-06-06 12:00:38'),(27,1,'Quotation Review','Quotation ID 6 was Approved with remarks: \"Approved by manager.\"','2026-06-06 12:01:03'),(28,1,'Generate Purchase Order','Purchase Order PO-2026-0003 (ID: 3) generated from Quotation ID 6','2026-06-06 12:01:36'),(29,4,'Update PO Status','Purchase Order ID 3 status updated to Accepted','2026-06-06 12:02:15'),(30,4,'Generate Invoice','Invoice INV-2026-0003 generated for PO PO-2026-0003','2026-06-06 12:02:18'),(31,1,'Generate Invoice','Invoice INV-2026-0004 generated for PO PO-2026-0003','2026-06-06 12:02:24'),(32,1,'Update Invoice Status','Invoice ID 4 status set to Paid','2026-06-06 12:02:36');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approvals`
--

DROP TABLE IF EXISTS `approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approvals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quotation_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `quotation_id` (`quotation_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `approvals_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `approvals_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (2,2,1,'Approved','Approved by manager.','2026-06-06 09:09:58'),(3,4,1,'Submitted','Recommended by procurement officer.','2026-06-06 09:24:57'),(4,4,6,'Approved','Approved by manager.','2026-06-06 09:25:31'),(5,5,1,'Approved','Approved by manager.','2026-06-06 11:32:37'),(6,6,1,'Approved','Approved by manager.','2026-06-06 12:01:03');
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) NOT NULL,
  `po_id` int DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `gst_amount` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Unpaid',
  `pdf_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `po_id` (`po_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,'INV-2026-0001',1,2000000.00,360000.00,2000000.00,'Unpaid','D:\\jeel study materials\\DEGREE\\SEM 8\\Odoo-Hackathon\\Hackathon-odoo\\invoices\\invoice-INV-2026-0001.pdf','2026-06-06 09:38:05'),(2,'INV-2026-0002',2,71600.00,12888.00,71600.00,'Unpaid','D:\\jeel study materials\\DEGREE\\SEM 8\\Odoo-Hackathon\\Hackathon-odoo\\invoices\\invoice-INV-2026-0002.pdf','2026-06-06 11:33:23'),(3,'INV-2026-0003',3,1000000.00,180000.00,1000000.00,'Unpaid','D:\\jeel study materials\\DEGREE\\SEM 8\\Odoo-Hackathon\\Hackathon-odoo\\invoices\\invoice-INV-2026-0003.pdf','2026-06-06 12:02:17'),(4,'INV-2026-0004',3,1000000.00,180000.00,1000000.00,'Paid','D:\\jeel study materials\\DEGREE\\SEM 8\\Odoo-Hackathon\\Hackathon-odoo\\invoices\\invoice-INV-2026-0004.pdf','2026-06-06 12:02:24');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,4,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Laptop\". Deadline is 30/6/2026, 6:00:00 pm.',0,'2026-06-06 08:56:15'),(2,1,'Quotation Received','Vendor \"jack\" submitted a quote of ₹5000000 for RFQ ID 1',0,'2026-06-06 08:57:31'),(3,5,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Books\". Deadline is 7/6/2026, 2:37:00 pm.',0,'2026-06-06 09:07:33'),(4,4,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Books\". Deadline is 7/6/2026, 2:37:00 pm.',0,'2026-06-06 09:07:33'),(5,1,'Quotation Received','Vendor \"magiji\" submitted a quote of ₹40000 for RFQ ID 2',0,'2026-06-06 09:08:20'),(6,1,'Quotation Received','Vendor \"jack\" submitted a quote of ₹450000 for RFQ ID 2',0,'2026-06-06 09:08:52'),(7,4,'Quotation Approved','Your quotation for RFQ \"Laptop\" has been approved by the manager. Remarks: Approved by manager.',0,'2026-06-06 09:09:23'),(8,5,'Quotation Approved','Your quotation for RFQ \"Books\" has been approved by the manager. Remarks: Approved by manager.',0,'2026-06-06 09:09:58'),(9,5,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Aperiam necessitatib\". Deadline is 10/6/2026, 5:46:00 pm.',0,'2026-06-06 09:19:07'),(10,4,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Aperiam necessitatib\". Deadline is 10/6/2026, 5:46:00 pm.',0,'2026-06-06 09:19:07'),(11,1,'Quotation Received','Vendor \"jack\" submitted a quote of ₹10000 for RFQ ID 3',0,'2026-06-06 09:24:08'),(12,4,'Quotation Submitted','Your quotation for RFQ \"Aperiam necessitatib\" has been submitted by the manager. Remarks: Recommended by procurement officer.',0,'2026-06-06 09:24:57'),(13,4,'Quotation Approved','Your quotation for RFQ \"Aperiam necessitatib\" has been approved by the manager. Remarks: Approved by manager.',0,'2026-06-06 09:25:31'),(14,4,'Purchase Order Received','A new Purchase Order PO-2026-0001 totaling ₹2000000 has been generated and sent to you.',0,'2026-06-06 09:37:25'),(15,1,'PO Status Updated','Purchase Order ID 1 status has been updated to \"Accepted\" by the vendor.',0,'2026-06-06 09:38:03'),(16,NULL,'Invoice Issued','An invoice (INV-2026-0001) has been generated for your Purchase Order PO-2026-0001.',0,'2026-06-06 09:38:06'),(17,5,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Excepteur ipsum bla\". Deadline is 28/3/1976, 8:57:00 pm.',0,'2026-06-06 10:05:53'),(18,4,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Excepteur ipsum bla\". Deadline is 28/3/1976, 8:57:00 pm.',0,'2026-06-06 10:05:53'),(19,1,'Quotation Received','Vendor \"jack\" submitted a quote of ₹100 for RFQ ID 4',0,'2026-06-06 11:32:05'),(20,7,'Quotation Received','Vendor \"jack\" submitted a quote of ₹100 for RFQ ID 4',0,'2026-06-06 11:32:05'),(21,4,'Quotation Approved','Your quotation for RFQ \"Excepteur ipsum bla\" has been approved by the manager. Remarks: Approved by manager.',0,'2026-06-06 11:32:37'),(22,4,'Purchase Order Received','A new Purchase Order PO-2026-0002 totaling ₹71600 has been generated and sent to you.',0,'2026-06-06 11:32:44'),(23,1,'PO Status Updated','Purchase Order ID 2 status has been updated to \"Accepted\" by the vendor.',0,'2026-06-06 11:33:13'),(24,7,'PO Status Updated','Purchase Order ID 2 status has been updated to \"Accepted\" by the vendor.',0,'2026-06-06 11:33:13'),(25,NULL,'Invoice Issued','An invoice (INV-2026-0002) has been generated for your Purchase Order PO-2026-0002.',0,'2026-06-06 11:33:24'),(26,5,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Laptops\". Deadline is 12/6/2026, 5:29:00 pm.',0,'2026-06-06 11:59:27'),(27,4,'New RFQ Invitation','You have been invited to submit a quotation for RFQ: \"Laptops\". Deadline is 12/6/2026, 5:29:00 pm.',0,'2026-06-06 11:59:27'),(28,1,'Quotation Received','Vendor \"jack\" submitted a quote of ₹50000 for RFQ ID 5',0,'2026-06-06 12:00:38'),(29,7,'Quotation Received','Vendor \"jack\" submitted a quote of ₹50000 for RFQ ID 5',0,'2026-06-06 12:00:38'),(30,4,'Quotation Approved','Your quotation for RFQ \"Laptops\" has been approved by the manager. Remarks: Approved by manager.',0,'2026-06-06 12:01:03'),(31,4,'Purchase Order Received','A new Purchase Order PO-2026-0003 totaling ₹1000000 has been generated and sent to you.',0,'2026-06-06 12:01:36'),(32,1,'PO Status Updated','Purchase Order ID 3 status has been updated to \"Accepted\" by the vendor.',0,'2026-06-06 12:02:15'),(33,7,'PO Status Updated','Purchase Order ID 3 status has been updated to \"Accepted\" by the vendor.',0,'2026-06-06 12:02:15'),(34,NULL,'Invoice Issued','An invoice (INV-2026-0003) has been generated for your Purchase Order PO-2026-0003.',0,'2026-06-06 12:02:18'),(35,NULL,'Invoice Issued','An invoice (INV-2026-0004) has been generated for your Purchase Order PO-2026-0003.',0,'2026-06-06 12:02:24');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `po_number` varchar(50) NOT NULL,
  `quotation_id` int DEFAULT NULL,
  `vendor_id` int DEFAULT NULL,
  `rfq_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Sent',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `po_number` (`po_number`),
  KEY `quotation_id` (`quotation_id`),
  KEY `vendor_id` (`vendor_id`),
  KEY `rfq_id` (`rfq_id`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_orders_ibfk_3` FOREIGN KEY (`rfq_id`) REFERENCES `rfqs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES (1,'PO-2026-0001',4,2,3,2000000.00,'Accepted','2026-06-06 09:37:25'),(2,'PO-2026-0002',5,2,4,71600.00,'Accepted','2026-06-06 11:32:44'),(3,'PO-2026-0003',6,2,5,1000000.00,'Accepted','2026-06-06 12:01:36');
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rfq_id` int DEFAULT NULL,
  `vendor_id` int DEFAULT NULL,
  `pricing` decimal(10,2) NOT NULL,
  `delivery_timeline` int NOT NULL,
  `notes` text,
  `status` varchar(50) DEFAULT 'Submitted',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rfq_id` (`rfq_id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`rfq_id`) REFERENCES `rfqs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quotations_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotations`
--

LOCK TABLES `quotations` WRITE;
/*!40000 ALTER TABLE `quotations` DISABLE KEYS */;
INSERT INTO `quotations` VALUES (2,2,3,40000.00,1,'Books will be delivered within one day','Approved','2026-06-06 09:08:20'),(3,2,2,450000.00,2,'qwer','Rejected','2026-06-06 09:08:52'),(4,3,2,10000.00,3,'Modi maiores aliquip','Ordered','2026-06-06 09:24:07'),(5,4,2,100.00,2,'qwert','Ordered','2026-06-06 11:32:05'),(6,5,2,50000.00,6,'Laptops will be deliverd within 6 days','Ordered','2026-06-06 12:00:38');
/*!40000 ALTER TABLE `quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfq_items`
--

DROP TABLE IF EXISTS `rfq_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfq_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rfq_id` int DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `rfq_id` (`rfq_id`),
  CONSTRAINT `rfq_items_ibfk_1` FOREIGN KEY (`rfq_id`) REFERENCES `rfqs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfq_items`
--

LOCK TABLES `rfq_items` WRITE;
/*!40000 ALTER TABLE `rfq_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `rfq_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfq_vendors`
--

DROP TABLE IF EXISTS `rfq_vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfq_vendors` (
  `rfq_id` int NOT NULL,
  `vendor_id` int NOT NULL,
  PRIMARY KEY (`rfq_id`,`vendor_id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `rfq_vendors_ibfk_1` FOREIGN KEY (`rfq_id`) REFERENCES `rfqs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rfq_vendors_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfq_vendors`
--

LOCK TABLES `rfq_vendors` WRITE;
/*!40000 ALTER TABLE `rfq_vendors` DISABLE KEYS */;
INSERT INTO `rfq_vendors` VALUES (2,2),(3,2),(4,2),(5,2),(2,3),(3,3),(4,3),(5,3);
/*!40000 ALTER TABLE `rfq_vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rfqs`
--

DROP TABLE IF EXISTS `rfqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfqs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `quantity` int DEFAULT '1',
  `deadline` datetime NOT NULL,
  `status` varchar(50) DEFAULT 'Open',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `rfqs_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfqs`
--

LOCK TABLES `rfqs` WRITE;
/*!40000 ALTER TABLE `rfqs` DISABLE KEYS */;
INSERT INTO `rfqs` VALUES (2,'Books','asdf',1000,'2026-06-07 14:37:00','Completed',1,'2026-06-06 09:07:33'),(3,'Aperiam necessitatib','Ad vitae eos sunt qu',200,'2026-06-10 17:46:00','Completed',6,'2026-06-06 09:19:07'),(4,'Excepteur ipsum bla','Consectetur cumque q',716,'1976-03-28 20:57:00','Completed',1,'2026-06-06 10:05:53'),(5,'Laptops','Requirement for laptops',20,'2026-06-12 17:29:00','Completed',1,'2026-06-06 11:59:27');
/*!40000 ALTER TABLE `rfqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `otp` varchar(6) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Admin','admin@vendorbridge.com','$2b$10$ABZ0HQr4Qwt3dfD2Or.To.wqXzA7dhYbbgaNL3JppwmZpYc6hQ8K2','admin',1,NULL,NULL),(2,'Test Vendor Co','testvendor@example.com','$2b$10$9mJs8srPsIRgoZkaiikDreWn3.BfjnDQlBUqgbTqbpMiDuqBbXLfm','manager',1,NULL,NULL),(4,'jack','jeelpatel472004@gmail.com','$2b$10$nDBC/ApEyFgnExcKjDZSEuJ17c3tFGi6Ix2BndL6NQCUVr6489oP2','vendor',1,NULL,NULL),(5,'magiji','magiji2680@5nek.com','$2b$10$1Ettee8OHjZiKadz.pJx9.gJjWUriOX.x.hzCGGmvSgLGoXuMDZDi','vendor',1,NULL,NULL),(6,'pimani','pimanis158@5nek.com','$2b$10$Nawblby0Do98TKHaxqy.ZOKXiC82jkVITNxcAUJRvsKQAeualvXr2','manager',1,NULL,NULL),(7,'Mann Patel','fesomat148@5nek.com','$2b$10$Szug/FjCPTpsaqo/BJs6CeEdvjfsZckPaOEsQ.AQgcIQS8/.IXQ9m','procurement',1,NULL,NULL),(8,'Zachery Wheeler','jurylyd@mailinator.com','$2b$10$mSrnYX7wXQxiLLdXJhzmC.cepnGiwclmbAtyL.fGZMtNEQX8vNf3S','manager',0,'440714','2026-06-06 17:03:05');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `gst_number` varchar(50) NOT NULL,
  `contact_person` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT 'Active',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (2,4,'jack','Logistics','29ABCDE1234F1Z5','Jeel Patel','jeelpatel472004@gmail.com','09313626384','Active'),(3,5,'magiji','Office Supplies','PENDING','magiji','magiji2680@5nek.com','PENDING','Active');
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-06 17:45:39
