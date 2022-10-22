const inquirer = require('inquirer');
const mysql = require('./config/connection');

mysql.promise().query('SELECT * FROM role').then(res=>{console.log(res[0])});
