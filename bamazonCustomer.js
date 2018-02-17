const bamazonData = require("./bamazonData");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const Table = require("cli-table2");

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

function getProducts() {
    return new Promise((resolve, reject) => {
        bamazonData.getProducts().then(products => {
            resolve(products);
        }).catch((err) => console.log(chalk.red('An error occurred: Could not retrieve products' + err)));
    });
}

function displayProducts(products) {
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
    console.log(table.toString());
}

function promptUserActions() {
    inquirer.prompt(userActions).then(function (answer) {
        switch (answer.userAction) {
            case "View Products":
                displayProducts();
                break;
            case "Exit":
                console.log("Goodbye");
                break;
        }
    });
}

function displayBanner() {
    clear();
    console.log(chalk.bold.blue('--------------------------------------------------------'));
    console.log(chalk.bold.green('    Welcome to Bamazon - The Command Line Catalog'));
    console.log(chalk.bold.blue('-------------------------------------------------------- \n'));
}


function start() {
    displayBanner();
    getProducts().then(products => displayProducts(products)).then(() => {
        promptUserActions();
    })
}

start();