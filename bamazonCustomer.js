const bamazonData = require("./bamazonData");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const Table = require("cli-table2");

// Store product ids for user input validation
let productIds = [];

// Prompt template for
const userActions = [
    {
        name: "userAction",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Place an Order",
            new inquirer.Separator(),
            "Exit"
        ]
    }
];

// Prompt template for purchasing an item
const purchaseActions = [
    {
        name: "itemId",
        type: "input",
        message: "Please enter the item id:",
        validate: (value) => {
            return productIds.includes(parseInt(value)) || "Please enter a valid item id";
        }
    },
    {
        name: "itemQuantity",
        type: "input",
        message: "Please enter the quantity:",
        validate: (value) => {
            // Check if entry is a number
            return /^\d$/.test(value) || "Please enter a valid item id";
        }
    },
];

function displayProducts() {
    return new Promise((resolve, reject) => {
        bamazonData.getProducts().then(products => {
            // Populate product id list for user input validation
            products.forEach((prod) => {
                productIds.push(prod.id);
            });
            let productTable = formatProductTable(products);
            // Display the table
            console.log(productTable.toString());
            resolve();

        }).catch((err) => {
            console.log(chalk.red('An error occurred: Could not retrieve products' + err));
            reject(err);
        });
    });
}

function formatProductTable(products) {
    // Format product output in a table using cli-table2
    let table = new Table({
        head: ["Item ID", "Description", "Price"],
        style: {
            head: ["blue"]
        },
        colWidths: [10, 50, 10]
    });

    // Add product results to the table with price formatting
    products.forEach(prod => {
        table.push([prod.id, prod.name, `$${prod.price.toFixed(2)}`])
    });

    return table;
}

function promptUserActions() {
    inquirer.prompt(userActions).then(answer => {
            switch (answer.userAction) {
                case "Place an Order":
                    promptPurchaseActions().then(promptUserActions);
                    break;
                case "Exit":
                    console.log("Goodbye");
                    // close DB connection
                    bamazonData.end();
                    break;
            }
        }
    );
}

function promptPurchaseActions() {
    return inquirer.prompt(purchaseActions).then(order => placeOrder(order));
}

function placeOrder(order) {
    bamazonData.getProductStock(order.itemId).then(result => {
        let availableStock = result[0].quantity;
        // Check if there is enough stock
        if (availableStock < order.itemQuantity) {
            return Promise.reject(Error("Stock unavailable"));
        }
        return availableStock;
    }).then(availableStock => {
        let newStock = availableStock - order.itemQuantity;
        // Update stock to reflect the order
        bamazonData.updateProductStock(order.itemId, newStock);
    }).catch((err) => console.log(chalk.red(`Could not place the order ${err}`)));
}


function displayBanner() {
    clear();
    console.log(chalk.bold.blue('-------------------------------------------------------------'));
    console.log(chalk.bold.green('       Welcome to Bamazon - The Command Line Catalog'));
    console.log(chalk.bold.blue('------------------------------------------------------------- \n'));
}


function start() {
    displayBanner();
    displayProducts().then(promptUserActions);
}

start();