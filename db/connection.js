
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.password,
  database: "employeesDB"
});

module.exports = connection;
