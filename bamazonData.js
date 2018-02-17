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

module.exports = {
    getProducts: getProducts
};
