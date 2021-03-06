# Bamazon-Shopping
## A data-driven, Amazon-inspired shopping application

### Prerequisites
1. Node.js - Bamazon requires Node to be installed

2. To install node visit [Node.js Website](https://nodejs.org/en/ "Node.js")and install node for your operating system.


### Installation
1. Clone the Git repository

   ```
   $ git clone <repo>
   ```
2. Navigate to the directory and install the dependencies 
   ```
   $ npm install
   ```
   
### Application Design
<p align="center">
   <img src="samples/app_arch.jpg?raw=true" alt="Application Design" width="400px" align="center" />
</p>


### Database Setup
1. Install [MySQL](https://dev.mysql.com/downloads/installer/ "MySQL")for your operating system.
2. Run the [bamazon_DDL.sql](sql/bamazon_DDL.sql) script from MySQL Workbench (or similar tool) to create the database schema
3. Run the [seed.sql](sql/bamazon_DDL.sql) script to add some sample products to the database

### Customer Actions
1. Navigate to the repository folder and run bamazonCustomer.js to start

   ```
   $ node bamazonCustomer.js
   ```

2. Follow the on-screen prompts to place an order

   <img src="samples/customer_order.gif?raw=true" alt="Customer Order" width="400px" />
   
### Manager Actions
1. Run bamazonManager.js to start the admin application

   ```
   $ node bamazonManager.js
   ```

2. Follow the on-screen prompts to view/update inventory and add new products

   **Update Inventory**
   
   <img src="samples/manager_inventory.gif?raw=true" alt="Manager Inventory" width="400px" />

   
   **Add Product**
   
   <img src="samples/manager_addproduct.gif?raw=true" alt="Manager Add Product" width="400px" />
