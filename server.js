require('dotenv').config()

const inquirer = require("inquirer")
const connection = require('./db/connection')
const logo = require('asciiart-logo')
const colors = require('colors')

const start = () => {
    const logoText = logo({ name: "Employee Tracker", font: 'Big Money-sw' }).render()
    console.log(logoText.green)
    inquirer.prompt({
    name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role"]
    }).then(response => {
    if (response.action === 'View All Departments'){
        viewAllEmployees()
    } else if (response.action === 'View All Roles') {
        viewAllRoles()
    } else if (response.action === 'View All Employees') {
        viewAllDepartments()
    } else if (response.action === 'Add Department') {
        addEmployee()
    } else if (response.action === 'Add Role') {
        addRole()
    } else if (response.action === 'Add Employee') {
        addDepartment()
    } else if (response.action === 'Update Employee Role') {
        updateEmployee()
    }
    })
}

const viewAllDepartments = () => {
    const sql = `SELECT dept_name FROM departments`

    connection.query(sql, (err, res) => {
        if (err) {
            res.status(500).json({ error: err.message })
        }
        console.table(res)
        end()
    })
}

const viewAllRoles = () => {
    const sql = `SELECT job_title, salary, dept_id FROM roles`

    connection.query(sql, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.table(res)
        end()
    })
}

const viewAllEmployees = () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.job_title, departments.dept_name AS department,roles.salary,CONCAT(manager.first_name, ' ', manager.last_name)
    AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id`

    connection.query(sql, (err, res) => {
        if (err) {
            console.log(err)
        }
        console.table(res)
        end()        
    })
}

const end = () => {
    inquirer.prompt({
        name: 'end',
        type: 'confirm',
        message: 'Do you want to keep making changes or view the employee database?'
    }).then(response => {
        if (response.end === true) {
            start()
        } else {
            console.log('Goodbye')
        }
    })
}


start()