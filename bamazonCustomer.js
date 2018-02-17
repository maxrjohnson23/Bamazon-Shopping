const bamazonData = require("./bamazonData");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");

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

async function viewProducts() {
    try {
        let products = await bamazonData.getProducts();
        products.forEach(prod => console.log(prod.product_name));
    } catch (err) {
        console.log(chalk.red('An error occurred.  Products could not be retrieved'));
    }
}

async function promptUserActions() {
    let answer = await inquirer.prompt(userActions);
    switch (answer.userAction) {
        case "View Products":
             await viewProducts();
            break;
        case "Exit":
            console.log("Goodbye");
            break;

    }
}

function displayBanner() {

    clear();
    console.log(chalk.bold.blue('--------------------------------------------------------'));
    console.log(chalk.bold.green('    Welcome to Bamazon - Your Command Line Catalog'));
    console.log(chalk.bold.blue('-------------------------------------------------------- \n'));
}

displayBanner();
promptUserActions();
