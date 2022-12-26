const mysql = require("mysql");

const connectionPool = mysql.createPool({
  connectionLimit: 10,
  server: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "mydatabase",
});

module.exports = connectionPool;
