var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});

var Product = require('./Product');

var productList = [];
var productIdList = [];

const initialize = function(){
  connection.connect();
  connection.query("SELECT * FROM products",function(err, res) {
    var table = new Table(
      {
        head: ["Item ID", "Product", "Department", "Unit Price", "Stock Qty"],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
      }
    );
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id,res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
      )
      productIdList.push(res[i].item_id.toString());
      var product = new Product(res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);
      productList.push(product);
    }
    console.log(table.toString());
  });
}

const queryAllProduct = function(){
  connection.query("SELECT * FROM products",function(err, res) {
    var table = new Table(
      {
        head: ["Item ID", "Product", "Department", "Unit Price", "Stock Qty"],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
      }
    );
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id,res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
      )
    }
    console.log(table.toString());
    //connection.end();
  });
}

const orderProduct = function(itemId, qty) {
  var index = productIdList.indexOf(itemId);
  if (index !== -1) {
    var newQty = productList[index].order(qty);
    connection.query("UPDATE products SET ? WHERE ?",
    [{stock_quantity : newQty}, {item_id : itemId}],
    function(err, res) {
      if(err) throw err;
      console.log("Order is placed!\n");
      connection.end();
    });  
  } else {
    console.log("product that you want to order doesn't exist.");
  }
}

var beginning = {
  type: 'confirm',
  name: 'start',
  message: 'Welcome to BAMAZON Store. Ready for shopping?',
  default: true
};

var questions = [{
  type: 'list',
  name: 'product',
  message: 'Select a product to buy',
  choices: ['1','2','3','4','5','6','7','8','9','10']
},
{
  type: 'input',
  name: 'qty',
  message: 'How many do you want to buy?',
  validate: function(value) {
    var valid = !isNaN(parseFloat(value));
    return valid || 'Please enter a number';
  },
  filter: Number
}]

var followUp = {
  type: 'confirm',
  name: 'again',
  message: "Don't you want more?",
  default: true
}

var shopping = function(){
  inquirer.prompt(beginning).then(answers => {
    if(answers.start){
      initialize();
      inquirer.prompt(questions).then(answers => {
        orderProduct(answers.product, parseInt(answers.qty));
        inquirer.prompt(followUp).then(answers => {
          if(answers.again){
            shopping();
          } else {
            return console.log("See Ya Soon!");
          }
        });
      });
    } else {
      console.log("See Ya Soon!")
    }
  })
}

shopping();
