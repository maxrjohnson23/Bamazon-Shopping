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
        connection.query("SELECT * FROM PRODddUCTS", function(err, results) {
            if(err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = {
    getProducts: getProducts
};
