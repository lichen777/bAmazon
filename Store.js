var Product = require('./Product');
var mysql = require('mysql');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bamazon'
  });

class Store{
    constructor(){
      this.productList = [];
      this.productIdList = [];
    }
    initialize(){
      connection.query("SELECT * FROM products",function(err, res) {
        var table = new Table(
          {
            head: ["Item ID", "Product", "Department", "Unit Price", "Stock Qty"],
            chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
          }
        );
        for (var i = 0; i < res.length; i++) {
          table.push(
            [res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
          )
          this.productIdList.push(res[i].item_id);
          var product = new product(res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);
          this.productList.push(product);
        }
        console.log(table.toString());
      });
    }
    queryAllProduct(){
      connection.query("SELECT * FROM products",function(err, res) {
        var table = new Table(
          {
            head: ["Item ID", "Product", "Department", "Unit Price", "Stock Qty"],
            chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
          }
        );
        for (var i = 0; i < res.length; i++) {
          table.push(
            [res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
          )
        }
        console.log(table.toString());
      });
    }
    orderProduct(itemId, qty) {
      var index = this.productIdList.indexOf(itemId);
      if (index !== -1) {
        var newQty = this.productList[index].order(qty);
        connection.connect(function(err) {
            if (err) throw err;
            connection.query("UPDATE products SET ? WHERE ?",
            [{
                stock_quantity : newQty
            }
            ,
            {
                item_id : itemId
            }],
            function(err, res) {
                console.log("order placed!\n");
            });
            connection.end();
        });
      }
    }
}

module.exports = Store;
