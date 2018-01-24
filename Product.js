var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});

function updateDB(itemId, qty){
  connection.connect(function(err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);

    connection.query("UPDATE products SET ? WHERE ?",
    [{
      stock_quantity = qty
    }
    ,
    {
      item_id = itemId
    }],
    function(err, res) {
      //console.log(res.affectedRows + " order placed!\n");
      console.log("-----------------------------------");
    });

    connection.end();
  };
}

class Product {
  constructor(itemId, name, department, price, stockQty) {
    this.itemId = itemId;
    this.name = name;
    this.department = department;
    this.price = price;
    this.qty = stockQty;
  }
  order(itemId, orderQty) {
    if(this.qty < orderQty) {
      return console.log("Insufficient quantity!");
    }
    var newQty = this.qty - orderQty;
    updateDB(itemId, newQty);
    showCost(newQty);
  }
  showCost(qty) {
    var cost = this.price * qty;
    console.log("Order Placed! Total Cost: " + cost);
  }
}
