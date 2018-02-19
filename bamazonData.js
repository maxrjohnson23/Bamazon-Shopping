const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "BAMAZON"
});

function getProducts() {
    return new Promise((resolve, reject) => {
        let sql = "SELECT item_id as id, product_name as name, department_name as department, price, stock_quantity as stock FROM PRODUCTS";
        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function addProduct(product) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT into PRODUCTS SET  ?";
        let productDetails = {
            product_name: product.itemName,
            department_name: product.deptName,
            price: product.itemPrice,
            stock_quantity: product.itemQuantity
        };
        connection.query(sql, productDetails, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function updateProductStock(itemId, newStock) {
    return new Promise((resolve, reject) => {
        let sql = "UPDATE PRODUCTS set stock_quantity = ? where item_id = ?";
        connection.query(sql, [newStock, itemId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

function getProductStock(itemId) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT stock_quantity as quantity FROM PRODUCTS where item_id = ?";
        connection.query(sql, [itemId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

function getLowInventoryProducts(threshold) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT item_id as id, product_name as name, department_name as department, price, stock_quantity as stock FROM PRODUCTS where stock_quantity < ?';
        connection.query(sql, [threshold], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

function end() {
    // end DB connection on application exit
    connection.end();
}

module.exports = {
    getProducts: getProducts,
    addProduct: addProduct,
    getProductStock: getProductStock,
    updateProductStock: updateProductStock,
    getLowInventoryProducts, getLowInventoryProducts,
    end: end
};
