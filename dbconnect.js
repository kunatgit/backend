const mysql = require("mysql");
const config = require("./config");

const connectionPool = mysql.createPool({
  connectionLimit: 10,
  server: config.serverDB,
  port: config.portDB,
  user: config.userDB,
  password: config.passwordDB,
  database: config.databaseDB,
});

module.exports = connectionPool;
