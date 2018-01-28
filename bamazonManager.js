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

var viewAll = function () {
  productList = []
  productIdList = []
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

var viewLowIntentory = function () {
  pool.query('SELECT * FROM products WHERE `stock_quantity` < ?', [5], function (err, res) {
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

var addIntentory = function () {
  inquirer.prompt(questions).then(answers => {
    var qty = parseInt(answers.qty)
    var itemId = parseInt(answers.product)
    var index = productIdList.indexOf(answers.product)
    if (index !== -1) {
      var newQty = productList[index].refill(qty)
      pool.query('UPDATE products SET ? WHERE ?',
        [{stock_quantity: newQty}, {item_id: itemId}],
        function (err, res) {
          if (err) throw err
          console.log('Inventory is added!\n')
        })
    } else {
      console.log("product that you want to refill doesn't exist.")
    }
    setTimeout(function () {manager();}, 100)
  })
}

var addNewProduct = function () {
  inquirer.prompt(newProduct).then(answers => {
    // console.log(answers)
    pool.query('INSERT INTO products SET ? ',
      {item_id: null, product_name: answers.productName, department_name: answers.department, price: answers.price, stock_quantity: answers.qty},
      function (err, res) {
        if (err) throw err
        console.log('New product is added\n')
      })
    setTimeout(function () { manager(); }, 100)
  })
}

const beginning = {
  type: 'confirm',
  name: 'start',
  message: 'Manager Login.',
  default: true
}

const options = {
  type: 'list',
  name: 'option',
  message: 'What do you want to do next?',
  choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Go Back']
}

const questions = [
  {
    type: 'input',
    name: 'product',
    message: 'Select a product to add inventory (Enter an Item ID)'
  },
  {
    type: 'input',
    name: 'qty',
    message: 'How many do you want to refill?',
    validate: function (value) {
      var valid = !isNaN(parseFloat(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  }
]

const newProduct = [
  {
    type: 'input',
    name: 'productName',
    message: 'Enter product name'
  },
  {
    type: 'list',
    name: 'department',
    message: 'Which Department?',
    choices: ['Electrics', 'Home Improvements', 'Kitchen']
  },
  {
    type: 'input',
    name: 'price',
    message: 'Enter Sale Price',
    validate: function (value) {
      var valid = !isNaN(parseFloat(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  },
  {
    type: 'input',
    name: 'qty',
    message: 'How many do you want to stock?',
    validate: function (value) {
      var valid = !isNaN(parseFloat(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  }
]

var manager = function () {
  inquirer.prompt(beginning).then(answers => {
    if (answers.start) {
      viewAll()
      setTimeout(function () {doYourJob();}, 100)
    } else {
      console.log('See Ya Soon!')
      process.exit()
    }
  })
}

var doYourJob = function () {
  inquirer.prompt(options).then(answers => {
    // console.log(answers.option)
    switch (answers.option) {
      case 'View Low Inventory':
        viewLowIntentory()
        setTimeout(function () {doYourJob();}, 100)
        break
      case 'Add to Inventory':
        addIntentory()
        break
      case 'Add New Product':
        addNewProduct()
        break
      case 'View Products for Sale':
        viewAll()
        setTimeout(function () {doYourJob();}, 100)
        break
      default:
        manager()
        break
    }
  })
}

manager()
