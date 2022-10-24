const inquirer = require('inquirer');
const mysql = require('./config/connection');
require('console.table');

//mysql.promise().query('SELECT * FROM role').then(res=>{console.log(res[0])});

const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?\n\n'
    }
]

const menuQuestions = [
    {
        type:'list',
        name: 'menuChoice',
        message: 'Please select a choice',
        choices: ['View All Employees', 
                  'Add Employee', 
                  'Update Employee Role', 
                  'View All Roles',
                  'Add Role',
                  'View All Departments',
                  'Add Department',
                  'Quit']
    }
]


const addDepartment = () =>{
    inquirer
        .prompt(addDepartmentQuestions)
        .then(({departmentName})=>{
            mysql.promise().query(`INSERT INTO department(name)
            VALUE ('${departmentName}');`).then(res=>{
                console.log('added dept')
                printMenu();
            })
        })
}

const menuRouter = (response) =>{
    switch(response.menuChoice){
        case 'View All Employees':
            break;
        case 'Add Employee':
            console.log('I work');
            break;
        case 'Update Employee Role':
            break;
        case 'View All Roles':
            break;
        case 'Add Role':
            break;
        case 'View All Departments':
            viewDepartment();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Quit':
            console.log('I am Quitting now');
            mysql.end();
            break;
    }
}

//SELECT FROM DEPARTMENTS

const viewDepartment = () =>{
    mysql.promise().query('SELECT * from department;').then(res=>{
        console.table(res[0])
        printMenu()
    });
}

//addDepartment();

const printTitle = () =>{
    //title made using https://www.freeformatter.com/javascript-escape.html and https://www.ascii-art-generator.org/
    console.log(" _____                 _                       \r\n| ____|_ __ ___  _ __ | | ___  _   _  ___  ___ \r\n|  _| | \'_ ` _ \\| \'_ \\| |\/ _ \\| | | |\/ _ \\\/ _ \\\r\n| |___| | | | | | |_) | | (_) | |_| |  __\/  __\/\r\n|_____|_| |_| |_| .__\/|_|\\___\/ \\__, |\\___|\\___|\r\n                |_|            |___\/           \r\n __  __                                   \r\n|  \\\/  | __ _ _ __   __ _  __ _  ___ _ __ \r\n| |\\\/| |\/ _` | \'_ \\ \/ _` |\/ _` |\/ _ \\ \'__|\r\n| |  | | (_| | | | | (_| | (_| |  __\/ |   \r\n|_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   \r\n                          |___\/           \r\n")
}

const printMenu = () =>{
    inquirer
        .prompt(menuQuestions)
        .then((response)=>menuRouter(response))
}

const init = () =>{
    printTitle();
    printMenu();
}

init();