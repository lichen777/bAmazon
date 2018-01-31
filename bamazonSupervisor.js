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

var viewDepartmentSale = function () {
  pool.query('SELECT department_id, departments.department_name, over_head_costs, SUM(product_sale) AS sum, SUM(product_sale) - over_head_costs AS total_profit FROM departments INNER JOIN products ON products.department_name = departments.department_name GROUP BY departments.department_name', function (err, res) {
    var table = new Table(
      {
        head: ['Department ID', 'Department Name', 'over head costs', 'product sales', 'Total Profit'],
        chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
      }
    )
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].department_id, res[i].department_name, parseInt(res[i].over_head_costs), parseInt(res[i].sum), parseInt(res[i].total_profit)]
      )
    }
    console.log('\n' + table.toString())
  })
}

var addNewDepartment = function () {
  inquirer.prompt(newDepartment).then(answers => {
    pool.query('INSERT INTO departments SET ? ',
      {department_id: null, department_name: answers.departmentName, over_head_costs: answers.cost},
      function (err, res) {
        if (err) throw err
        console.log('New department is added\n')
      }
    )
  })
  setTimeout(function () { supervisor(); }, 100)
}

const newDepartment = [
  {
    type: 'input',
    name: 'departmentName',
    message: 'Enter Department name'
  },
  {
    type: 'input',
    name: 'cost',
    message: 'Enter OverHead Cost',
    validate: function (value) {
      var valid = !isNaN(parseFloat(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  }
]

const login = [
  {
    type: 'input',
    name: 'username',
    message: 'Manager Login. Enter your username'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter your password',
    mask: '*'
  }
]

const options = {
  type: 'list',
  name: 'option',
  message: 'What do you want to do next?',
  choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
}

var supervisor = function () {
  inquirer.prompt(login).then(answers => {
    if (answers.username === 'admin' && answers.password === 'admin') {
      jobs()
    } else {
      console.log('Login failed!')
      process.exit()
    }
  })
}

var jobs = function () {
  inquirer.prompt(options).then(answers => {
    switch (answers.option) {
      case 'View Product Sales by Department':
        viewDepartmentSale()
        setTimeout(function () {jobs();}, 100)
        break
      case 'Create New Department':
        addNewDepartment()
        break
      default:
        console.log('Logged off')
        process.exit()
        break
    }
  })
}

supervisor()
