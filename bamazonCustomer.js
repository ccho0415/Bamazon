var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
	host: "localhost",
	user: "nodeuser",
	password: "catbutt1234",
	database: "bamazon_db"
});
var products = ["None", "I'm Done"];
var orders = [];
var prices = [];
var total = 0;
function loadProducts(){
	connection.query("SELECT*FROM products", function(error, results, fields){
		if (error) throw error;
		else if(results){
			results.forEach(function(element){
				products.push(element.product_name);
			});
			askOrder();
		}
	});
}
function Order(order,num){
	this.order=order,
	this.num=num
}
function askOrder(){
  	inquirer.prompt([
		{
			type:"list",
			message: "Welcome to the Cattery! What would you like to order today?",
			choices: products,
			name: "order"
		},
		{
			type: "prompt",
			message: "How many would you like to buy?",
			name: "num",
			default: 0
		}
	]).then(function(user){
		var input = user.order;
		var purchased = user.num;
		if(input !== "None" && input !="I'm Done"){
			connection.query("SELECT*FROM products WHERE product_name LIKE '"+user.order+"'", function(error, results, fields){
				if (error) throw error;
				else if (results){
					console.log(results);
					var currentNum =parseInt(results[0].stock_quantity);
					var currentPrice =parseInt(results[0].price)* parseInt(user.num);
					var productId =parseInt(results[0].id);
					prices.push(currentPrice);
					var newNum = currentNum -1
					if (newNum >0){

					console.log(currentNum);
					console.log(newNum);
					connection.query("UPDATE products SET stock_quantity = '"+ newNum +"' WHERE product_name = '"+user.order+"'", function(error, results, fields){
						if (error) throw error;
						else if(results){
							connection.query("INSERT INTO sales (product_id,quantity_purchased) VALUES ('"+productId+"','"+ purchased +"')");
							console.log("That will be "+ currentPrice+ " dollars" );

						}
					});	
					}else if (newNum <0){
						console.log("-----We ran out!-----");
					}
				}
			});
			var orderData = new Order(user.order, user.num);
			orders.push(orderData);
			askOrder();
		}else if (input == "I'm Done"){
			prices.forEach(function(element){
				var addThis =parseInt(element);
				total = total + addThis;

			});
			console.log("Your total came out to "+ total+ " dollars. Thank you for shopping at the Cattery.");
			process.exit();
		}else if (input =="None"){
			console.log("you suck");
			process.exit();
		}
	});	

}
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
  	loadProducts();
  }
});