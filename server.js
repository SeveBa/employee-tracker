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
    if (response.action === 'View All Employees'){
        viewAllEmployees()
    } else if (response.action === 'View All Roles') {
        viewAllRoles()
    } else if (response.action === 'View All Departments') {
        viewAllDepartments()
    } else if (response.action === 'Add Employee') {
        addEmployee()
    } else if (response.action === 'Add Role') {
        addRole()
    } else if (response.action === 'Add Department') {
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

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'dept',
            type: 'input',
            message: 'What department would you like to add?'
        }
    ]).then(response => {
        const sql = `INSERT INTO departments SET ?`
        
        connection.query(sql, {dept_name: response.dept})
        end()
    })
}

const addRole = () => {
    inquirer.prompt([
        {
            name: 'role',
            type: 'input',
            message: 'What role would you like to add?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for this role?'
        },
        {
            name: 'deptId',
            type: 'input',
            message: 'What is the department ID for this role?'
        }
    ]).then(response => {
        const sql = `INSERT INTO roles SET ?`
        
        connection.query(sql, {job_title: response.role, salary: response.salary, dept_id: response.deptId})
        end()        
    })
}

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is their first name?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is their last name'
        },
        {
            name: 'role',
            type: 'list',
            message: 'What is their role id?',
            choices: [
                '1. Director',
                '2. Manager',
                '3. Associate',
                '4. Assistant',
            ]
        },
        {
            name: 'manager',
            type: 'input',
            message: 'What is their manager id?'
        }
    ]).then(response => {
        const sql = `INSERT INTO employees SET ?`
        connection.query(sql, {first_name: response.firstName, last_name: response.lastName, role_id: response.role[0], manager_id: response.manager})
        end()        
    })
}

const updateEmployee = () => {

    const sql = `SELECT id, first_name, last_name, role_id FROM employees`

    connection.query(sql, (err, res) => {
        if (err) {
            console.log(err)
        }
          inquirer.prompt({
              name: "promotion",
              type: "rawlist",
              choices: function(value) {
                let promoteArr = [];
                for (let i = 0; i < res.length; i++) {
                  promoteArr.push(res[i].first_name + ' ' + res[i].last_name)
                }
                return promoteArr
              },
              message: 'Which employee would you like to change?'
            })
            .then(response => {
              for (let i = 0; i < res.length; i++) {
                if (res[i].first_name + " " + res[i].last_name === response.promotion) {
                  let employeeChoice = res[i];
                  inquirer.prompt({
                      name: "updatedRole",
                      type: "input",
                      message: "What is the role id of the new position you are assigning this person?"
                    })
                    .then(response => {
                      const sql = `UPDATE employees SET ? WHERE ?`
                      connection.query(sql, [{ role_id: response.updatedRole }, { id: employeeChoice.id }])
                      end()
                    })
                }
              }
            })
        }
    )
}

const end = () => {
    inquirer.prompt({
        name: 'end',
        type: 'confirm',
        message: 'Do you want to make changes or view the employee database?'
    }).then(response => {
        if (response.end === true) {
            start()
        } else {
            console.log('Goodbye')
        }
    })
}


start()