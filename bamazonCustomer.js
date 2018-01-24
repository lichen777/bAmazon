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
