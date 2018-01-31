var mysql = require('mysql')
var Table = require('cli-table')
var inquirer = require('inquirer')

var pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'bamazon'
})

var Product = require('./Product')

var productList = []
var productIdList = []

var initialize = function () {
  pool.query('SELECT * FROM products', function (err, res) {
    var table = new Table(
      {
        head: ['Item ID', 'Product', 'Department', 'Unit Price', 'Stock Qty'],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
      }
    )
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity]
      )
      productIdList.push(res[i].item_id.toString())
      var product = new Product(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity)
      productList.push(product)
    }
    console.log('\n' + table.toString())
  })
}

var queryAllProduct = function () {
  pool.query('SELECT * FROM products', function (err, res) {
    var table = new Table(
      {
        head: ['Item ID', 'Product', 'Department', 'Unit Price', 'Stock Qty'],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
      }
    )
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity]
      )
    }
    console.log('\n' + table.toString())
  })
}

var orderProduct = function (itemId, qty) {
  var index = productIdList.indexOf(itemId)
  if (index !== -1) {
    var newQty = productList[index].order(qty)
    var rev = qty * productList[index].price
    pool.query('UPDATE products SET ?, `product_sale` = `product_sale` + ? WHERE ?',
      [{stock_quantity: newQty}, rev, {item_id: itemId}],
      function (err, res) {
        if (err) throw err
        console.log('Order is placed!\n')
      })
  } else {
    console.log("product that you want to order doesn't exist.")
  }
}

const beginning = {
  type: 'input',
  name: 'username',
  message: 'Enter your name to start shopping.(Enter "exit" to leave)',
  default: 'Guest'
}

const questions = [
  {
    type: 'input',
    name: 'product',
    message: 'Select a product to buy (Enter an Item ID)'
  },
  {
    type: 'input',
    name: 'qty',
    message: 'How many do you want to buy?',
    validate: function (value) {
      var valid = !isNaN(parseFloat(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  }
]

const followUpQuestion = {
  type: 'confirm',
  name: 'again',
  message: "Don't you want more?",
  default: true
}

var followUp = function () {
  inquirer.prompt(followUpQuestion).then(answers => {
    if (answers.again) {
      queryAllProduct()
      setTimeout(function () {shoppingCart();}, 100)
    } else {
      console.log('See Ya Soon!')
      process.exit()
    }
  })
}

var shoppingCart = function () {
  inquirer.prompt(questions).then(answers => {
    orderProduct(answers.product, parseInt(answers.qty))
    setTimeout(function () {followUp();}, 100)
  })
}

var userLogin = function () {
  inquirer.prompt(beginning).then(answers => {
    if (answers.username !== 'exit') {
      initialize()
      setTimeout(function () {shoppingCart();}, 100)
    } else {
      console.log('See Ya Soon!')
    }
  })
}

userLogin()
