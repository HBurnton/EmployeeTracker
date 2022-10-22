const { Module } = require('module');
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.MY_SQL_USER,
        password: process.env.MY_SQL_PW,
        database: process.env.MY_DB,
    },
    console.log('Connected to DB')
)

module.exports = connection;