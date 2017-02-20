var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
	host: "localhost",
	user: "nodeuser",
	password: "catbutt1234",
	database: "bamazon_db"
});
var orders = [];
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});
connection.query('SELECT * FROM products', function (error, results, fields) {
  if (error) throw error;
  else if(results){
  	console.log(results);
  	inquirer.prompt([
		{
			type:"checkbox",
			message: "Welcome to the Cattery! What would you like to order today?",
			choices: ["Meow Mix","Blue Buffalo Cat", "Hill's Science", "Fancy Feast", "Purina", "Bengal", "Tabby", "Scottish Fold", "Scratcher Toy", "Feather Wand", "Interactive Pet Paly Toy", "Cat Dancer", "Catit Senses 2.0 Digger for Cats"],
			name: "order"
		}
	]).then(function(user){
		var input = user.order
		input.forEach(function(element){
			inquirer.prompt([
				{
					type: "prompt",
					message: "How many of"+element+"would you like to buy?",
					name: "num"
				}
			]).then(function(user){
				console.log(user.num);

		});		
		});
		});
  }
});