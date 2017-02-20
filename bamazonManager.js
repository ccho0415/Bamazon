var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
	host: "localhost",
	user: "nodeuser",
	password: "catbutt1234",
	database: "bamazon_db"
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});
inquirer.prompt([
	{
			type:"list",
			message: "Welcome Manager. What would you like to do today?",
			choices: ["View Products for Sale","View Low Inventory", "Add to Inventory", "Add New Product"],
			name: "order"
	}
])