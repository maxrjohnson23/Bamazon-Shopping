const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "BAMAZON"
});

function getProducts() {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT item_id as id, product_name as name, department_name as department, price, stock_quantity as stock FROM PRODUCTS", function(err, results) {
            if(err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

function updateProductStock(itemId, newStock) {
    return new Promise(function(resolve, reject) {
        connection.query("UPDATE PRODUCTS set stock_quantity = ? where item_id = ?", [newStock, itemId], (err, results) => {
            if(err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

function getProductStock(itemId) {
    return new Promise(function(resolve, reject) {
        connection.query("SELECT stock_quantity as quantity FROM PRODUCTS where item_id = ?", [itemId], (err, results) => {
            if(err) {
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
    getProductStock: getProductStock,
    updateProductStock: updateProductStock,
    end: end
};
