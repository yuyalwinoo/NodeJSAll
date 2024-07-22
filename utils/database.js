// //mysql2 start
// const mysql = require("mysql2");



// const pool = mysql.createPool({
//     host : "localhost",
//     database : "blog",
//     user : "root",
//     password : ""
// })

// module.exports = pool.promise();
// //mysql2 end

// ---------------------------
// Sequelize start

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('blog', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
  });
  
module.exports = sequelize;

// Sequelize end