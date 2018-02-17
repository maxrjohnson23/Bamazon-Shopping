# DDL for creating the Bamazon database and products table
DROP DATABASE IF EXISTS BAMAZON;

CREATE DATABASE BAMAZON;

USE BAMAZON;

CREATE TABLE PRODUCTS (
  item_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  product_name VARCHAR(300) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT
);