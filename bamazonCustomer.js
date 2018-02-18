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
            "View Products",
            "Add Item to Cart",
            "Checkout",
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
        validate: function(value) {
            return productIds.includes(parseInt(value)) ||  "Please enter a valid item id";
        }
    },
    {
        name: "itemQuantity",
        type: "input",
        message: "Please enter the quantity:",
        validate: function(value) {
            // Check if entry is a number
            return /^\d$/.test(value) || "Please enter a valid item id";
        }
    },
];

function displayProducts() {
    return bamazonData.getProducts().then(products => {
            // Populate product id list for user input validation
            products.forEach((prod) => {
               productIds.push(prod.id);
            });
            let productTable = formatProductTable(products);
            // Display the table
            console.log(productTable.toString());
        }).catch((err) => console.log(chalk.red('An error occurred: Could not retrieve products' + err)));

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
    inquirer.prompt(userActions).then(function (answer) {
        switch (answer.userAction) {
            case "Add Item to Cart":
                promptPurchaseActions();
                break;
            case "Exit":
                console.log("Goodbye");
                break;
        }
    });
}

function promptPurchaseActions() {
    inquirer.prompt(purchaseActions).then(function (answer) {
        console.log('Thanks for the purchase');
    })
}


function displayBanner() {
    clear();
    console.log(chalk.bold.blue('--------------------------------------------------------'));
    console.log(chalk.bold.green('    Welcome to Bamazon - The Command Line Catalog'));
    console.log(chalk.bold.blue('-------------------------------------------------------- \n'));
}


function start() {
    displayBanner();
    displayProducts().then(promptUserActions)
}

start();