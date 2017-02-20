var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
	host: "localhost",
	user: "nodeuser",
	password: "catbutt1234",
	database: "bamazon_db"
});
var toDo;
var products = [];
var addTo = [];
var departments = [];
var currentInventory;
var selColumn;
var newNum;
var num;
var newProduct;
var newProductDept;
var newProductPrice;
var newProductStock;
function loadProducts(){
	connection.query("SELECT*FROM products", function(error, results, fields){
		if (error) throw error;
		else if(results){
			results.forEach(function(element){
				addTo.push(element.product_name);
			});
		}
	});
}
function loadDepartments(){
	connection.query("SELECT*FROM departments", function(error, results, fields){
		if (error) {
			throw error;
		} else if (results) {
			results.forEach(function(element){
				departments.push(element.department_name);
			});
		}
	});
}
function cont(){
		inquirer.prompt([
			{
				type: "confirm",
				message: "Would you like to do anything else?",
				name: "continue"
			}
			]).then(function(user){
				if (user.continue){
					prompt();
				}else{
					process.exit();
				}
			});
	
}
function prompt(){
inquirer.prompt([
	{
			type:"list",
			message: "Welcome Manager. What would you like to do today?",
			choices: ["View Products for Sale","View Low Inventory", "Add to Inventory", "Add New Product", "I'm Done For Now"],
			name: "task"
	}
]).then(function(user){
	var toDo = user.task;
	if (toDo == "View Products for Sale"){
		connection.query("SELECT*FROM products", function(error, results, fields){
			if (error){
				throw error;
			}else if(results){
				results.forEach(function(element){
					products.push(element.product_name);
				});
			console.log("Here are the products:");
			console.log(products);
			for(i=0; i<products.length; i++){
				products.splice(products[i]);
			}
			}
		});
		cont();
	}else if(toDo =="View Low Inventory"){
		connection.query("SELECT*FROM products WHERE stock_quantity < '50'", function(error, results, fields){
			if (error){
				throw error;
			}else if(results){
				results.forEach(function(element){
					products.push(element.product_name);
				});
			console.log("Here are the products that have a stock of less than 50");
			console.log(products);
			for(i=0; i<products.length; i++){
				products.splice(products[i]);
			}
			}
		});
		cont();
	}else if (toDo == "Add to Inventory"){
		inquirer.prompt([
		{
			type:"list",
			message: "Where do you want to add more stock to?",
			choices: addTo,
			name: "order"
		}
			]).then(function(user){
				var selColumn = user.order;
				connection.query("SELECT * FROM products WHERE product_name = '"+selColumn+"'", function(error, results, fields){
					if (error){
						throw error;
					}else if (results){
						var currentInventory =results[0].stock_quantity;
						console.log(currentInventory);
						inquirer.prompt([
						{
							type: "input",
							message: "How many would you like to add?",
							name: "inventoryAdd"
						}
						]).then(function(user){
							var num = user.inventoryAdd;
							var newNum = parseInt(num) + parseInt(currentInventory);
							if (newNum > currentInventory){
								connection.query("UPDATE products SET stock_quantity = '"+newNum+"' WHERE product_name = '"+selColumn+"'", function(error, results, fields){
									if (error){
									throw error;
									}else if(results){
									console.log("I added "+ num +" number of products to this inventory");
									cont();
									}
								});	
							}else{
								console.log("NOOOPe you didn't add something.")
								cont();
							}
						});
					}
				});
			});

	}else if (toDo == "Add New Product"){
		inquirer.prompt([
			{
				type: "input",
				message: "What would you like to add?",
				name: "productAdd"
			}
			]).then(function(user){
				var newProduct = user.productAdd;
				inquirer.prompt([
				{
					type: "list",
					message:"Which department should I add it to?",
					choices: departments,
					name:"productAddDept"
				}
				]).then(function(user){
					var a = user.productAddDept;
						connection.query("SELECT *FROM departments WHERE department_name = '"+a+"'", function(error,results,fields){
							var newProductDept = results[0].id;
							console.log(newProductDept);
							inquirer.prompt([
							{
								type:"input",
								message:"How much is this product?",
								name: "productAddPrice"
							}
							]).then(function(user){
								var newProductPrice = user.productAddPrice;
								inquirer.prompt([
								{
									type:"input",
									message:"How many of the product would you like to add?",
									name: "productAddStock"
								}
								]).then(function(user){
									var newProductStock = user.productAddStock;
									connection.query("INSERT INTO products(product_name, department_id, price, stock_quantity) VALUES ('"+newProduct+"','"+newProductDept+"','"+newProductPrice+"','"+newProductStock+"');", function(error, results, fields){
										if (error) {
											throw error
										} else if (results) {
											console.log("Sucessfully added!");
											cont();
										}
								});
							});							
						});
				});							
						});

				
			});

	}else{
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
loadProducts();
loadDepartments();
prompt();