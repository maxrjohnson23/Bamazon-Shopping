const bamazonData = require("./bamazonData");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const Table = require("cli-table2");

// Store product ids for user input validation
let productIds = [];

// Prompt template for manager actions
const managerActions = [
    {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products",
            "View Low Inventory",
            "Add Inventory",
            "Add Product",
            new inquirer.Separator(),
            "Exit"
        ]
    }
];

// Prompt template for purchasing an item
const inventoryActions = [
    {
        name: "itemId",
        type: "input",
        message: "Please enter the item id:",
        validate: (value) => {
            // Check if valid product id
            return productIds.includes(parseInt(value)) || "Please enter a valid item id";
        }
    },
    {
        name: "itemQuantity",
        type: "input",
        message: "Please enter the quantity to be added:",
        validate: (value) => {
            // Check if entry is a number
            return /^\d+$/.test(value) || "Please enter a number";
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
            displayProductTable(products);
            resolve();
        }).catch((err) => {
            reject(`An error occurred: Could not retrieve products. \nError Details: ${err}`);
        });
    });
}

function displayLowInventory() {
    return new Promise((resolve, reject) => {
        const inventoryThreshold = 5;
        bamazonData.getLowInventoryProducts(inventoryThreshold).then(products => {
            displayProductTable(products);
            resolve();
        }).catch((err) => {
            reject(`An error occurred: Could not retrieve low inventory. \nError Details: ${err}`);
        });
    })
}

function displayProductTable(products) {
    // Format product output in a table using cli-table2
    let table = new Table({
        head: ["Item ID", "Description", "Price", "Stock"],
        style: {
            head: ["blue"]
        }
    });

    // Add product results to the table with price formatting
    products.forEach(prod => {
        table.push([prod.id, prod.name, `$${prod.price.toFixed(2)}`, prod.stock])
    });

    console.log(table.toString());
}

function promptManagerActions() {
    return inquirer.prompt(managerActions).then(answer => {
            switch (answer.action) {
                case "View Products":
                    // return inquirer.prompt(purchaseActions)
                    //     .then(order => placeOrder(order));
                    return displayProducts().then(promptManagerActions);
                // "View Products",
                //     "View Low Inventory",
                //     "Add Inventory",
                //     "Add Product"
                case "View Low Inventory" :
                    return displayLowInventory().then(promptManagerActions);
                case "Add Inventory" :
                    return inquirer.prompt(inventoryActions)
                        .then(updates => updateInventory(updates))
                        .then(promptManagerActions);
                case "Exit":
                    return Promise.resolve("Goodbye!");
            }
        }
    );
}

function updateInventory(updates) {

    return new Promise((resolve, reject) => {
        bamazonData.getProductStock(updates.itemId).then(result => {
            let availableStock = result[0].quantity;

            let newStock = availableStock + +updates.itemQuantity;
            // Update stock with the new quantity
            bamazonData.updateProductStock(updates.itemId, newStock);
            console.log(chalk.green("Inventory updated"));
            resolve();
        }).catch(err => reject(err));
    });
}


function displayBanner() {
    clear();
    console.log(chalk.bold.blue('-------------------------------------------------------------'));
    console.log(chalk.bold.green('       Welcome to Bamazon - Administration Options'));
    console.log(chalk.bold.blue('------------------------------------------------------------- \n'));
}


function start() {
    displayBanner();

    // Display available actions
    promptManagerActions()
        .then((message) => {
            console.log(chalk.green(message));
            console.log(chalk.yellow("Exiting..."));
            bamazonData.end();
        }).catch((err) => {
        console.log(chalk.red(err));
        console.log(chalk.yellow("Exiting..."));
        bamazonData.end();
    });
}

start();