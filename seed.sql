# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.35)
# Database: bamazon
# Generation Time: 2018-02-08 00:37:30 +0000
# ************************************************************


# Dump of table departments
# ------------------------------------------------------------

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;

INSERT INTO `departments` (`department_id`, `department_name`, `over_head_costs`)
VALUES
	(1,'Electrics',500),
	(2,'Home Improvements',2000),
	(3,'Kitchen',1500),
	(4,'Clothing',200),
	(5,'Sports',1000);

/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table products
# ------------------------------------------------------------

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`, `product_sale`)
VALUES
	(1,'GoPro','Electrics',399,19,0),
	(2,'DJI Drone','Electrics',828,22,0),
	(3,'Echo','Electrics',49.99,144,799.84),
	(4,'Kindle','Electrics',119.99,86,4559.62),
	(5,'Screwdriver','Home Improvements',10.99,248,21.98),
	(6,'Water Filter','Home Improvements',47.84,356,0),
	(7,'Fire Alert','Home Improvements',28.88,415,28.88),
	(8,'Chef Knife','Kitchen',9.99,89,339.66),
	(9,'Non-Stick Pan','Kitchen',19.99,440,219.89),
	(10,'Blender','Kitchen',97.02,4,0),
	(11,'IPAD','Electrics',399.99,3,1199.97),
	(12,'Jacket','Clothing',49.99,124,0),
	(13,'Jeans','Clothing',36.99,14,332.91),
	(14,'Blazer','Clothing',199.99,23,0),
	(15,'Hoodie','Clothing',35.99,13,0),
	(16,'Basketball','Sports',119.99,12,0);

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
