const mysql = require("mysql2/promise");
require("dotenv").config({ path: "backend/.env" });

const test = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });
    console.log("Connection to MySQL successful!");
    
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    if (rows.length === 0) {
      console.log(`Database ${process.env.DB_NAME} does not exist. Creating...`);
      await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log("Database created.");
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists.`);
    }
    await connection.end();
  } catch (error) {
    console.error("Connection failed:", error);
  }
};

test();
