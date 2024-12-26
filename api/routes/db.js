const mysql = require("mysql2");

// .env dosyasindan database verilerini çekebilmek için
const dotenv = require("dotenv");
dotenv.config();

// const port = process.env.PORT;
const dbPool = mysql
    .createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    })
    .promise();

module.exports = dbPool;