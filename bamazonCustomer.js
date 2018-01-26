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
      productIdList.push(res[i].item_id);
      var product = new Product(res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);
      productList.push(product);
    }
    console.log(table.toString());
  });
  //connection.end();
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
    connection.end();
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
      //connection.end();
    });  
  }
}

initialize();
setTimeout(function(){
  orderProduct(3, 2);
}, 50);
setTimeout(function(){
  queryAllProduct();
}, 50);
