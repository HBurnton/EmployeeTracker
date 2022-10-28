const inquirer = require('inquirer');
const mysql = require('./config/connection');
require('console.table');

//Question Department for Inquirer Static Questions
const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?\n'
    }
]

const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: 'Please enter the employee first name \n'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'Please enter the employee last name. \n'
    }
]

const addRoleQuestions = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?\n'
    },
    {
        type: 'number',
        name: 'salaryAmount',
        message: 'What is the salary of the role?\n'
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

//ADD DEPARTMENT - COMPLETED
const addDepartment = () =>{
    inquirer
        .prompt(addDepartmentQuestions)
        .then(({departmentName})=>{
            mysql.promise().query(`INSERT INTO department(name)
            VALUE ('${departmentName}');`)
            .then(res=>{
                console.log(`Added ${departmentName} to database`);
                printMenu();
            })
        })
}

//VIEW DEPARTMENTS - COMPLETED
const viewDepartment = () =>{
    mysql.promise().query('SELECT * from department;').then(res=>{
        console.table(res[0])
        printMenu()
    });
}

//VIEW ROLES - COMPLETED
const viewRoles = () =>{
    mysql.promise().query(`SELECT role.id, role.title, department.name as department, role.salary 
                FROM role JOIN department ON role.department_id = department.id;`)
    .then(res=>{
        console.table(res[0])
        printMenu()
    });
}

//VIEW EMPLOYEES - COMPLETED
const viewEmployees = () =>{
    mysql.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                          FROM employee
                          LEFT JOIN role ON employee.role_id = role.id 
                          LEFT JOIN department ON role.department_id = department.id 
                          LEFT JOIN employee manager ON employee.manager_id = manager.id`)
    .then(res =>{
        console.table(res[0]);
        printMenu();
    });

}

//ADD EMPLOYEES - COMPLETED
//REWRITTEN ATTEMPTING PROMISE QUERY (I'm not really sure where to put catches/this is still really nested trying to work it out)
const addEmployee = () =>{

    inquirer.prompt(addEmployeeQuestions)
    .then(({firstName, lastName})=>{

        mysql.promise().query(`SELECT role.id, role.title FROM role`)
        .then( (results) =>{
            const employeeRoles = results[0].map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'newEmployeeRole',
                    message: 'Please select a role for this employee',
                    choices: employeeRoles
                }
            ])
            .then((result)=>{
                const employeeRoleId = result.newEmployeeRole;

                mysql.promise().query('SELECT * FROM employee')
                .then(results=>{
                    const managerList = results[0].map(({id, first_name, last_name})=>({name: `${first_name} ${last_name}`, value: id}));
                    inquirer.prompt([
                        {
                            type:'list',
                            name: 'newEmployeeManager',
                            message: 'Please select the new employee\'s manager. \n',
                            choices: managerList
                        }
                    ])
                    .then(result=>{
                        const managerId = result.newEmployeeManager;

                        mysql.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                        VALUES ('${firstName}', '${lastName}', ${employeeRoleId}, ${managerId})`)
                        .then(result =>{
                            console.log(`New Employee: ${firstName} ${lastName} has been added!`);
                            printMenu();
                        });
                    });
                });
            });
        });
    })
    .catch(err =>{
        console.log(err)
    });
};

/*
const addEmployee = () =>{

    inquirer.prompt(addEmployeeQuestions)

    .then(({firstName, lastName})=>{
        
        mysql.query(`SELECT role.id, role.title FROM role`, (err, results) =>{
            if (err){
                console.log(err);
                return;
            }
            const employeeRoles = results.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'newEmployeeRole',
                    message: 'Please select a role for this employee',
                    choices: employeeRoles
                }
            ])
            .then((result)=>{
                const employeeRoleId = result.newEmployeeRole;

                mysql.query('SELECT * FROM employee', (err, results)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    const managerList = results.map(({id, first_name, last_name})=>({name: `${first_name} ${last_name}`, value: id}));
                    inquirer.prompt([
                        {
                            type:'list',
                            name: 'newEmployeeManager',
                            message: 'Please select the new employee\'s manager. \n',
                            choices: managerList
                        }
                    ])
                    .then((result=>{
                        const managerId = result.newEmployeeManager;

                        mysql.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                        VALUES ('${firstName}', '${lastName}', ${employeeRoleId}, ${managerId})`, (err, result) =>{
                            if(err){
                                console.log(err);
                                return;
                            }
                            console.log(`New Employee: ${firstName} ${lastName} has been added!`);
                            printMenu();
                        });
                    }));
                });
            });
        });
    });
};
*/



//addRole - COMPLETED
const addRole= () =>{
    inquirer.prompt(addRoleQuestions)
    .then(({roleName, salaryAmount})=>{
        mysql.query(`SELECT name, id FROM department`, (err, result) =>{
            if(err){
                console.log(err);
                return;
            }
            const currentDepartments = result.map(({name,id})=>({name, value: id}));

            inquirer.prompt([
                {
                type: 'list',
                name: 'department',
                message: 'What department does this role belong to?',
                choices: currentDepartments
                }
            ])
            .then(({department})=>{
                mysql.query(`INSERT INTO role (title, salary, department_id)
                VALUES ('${roleName}', '${salaryAmount}', ${department})`, (err, result)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(`${roleName} has been added to the roles!`);
                    printMenu();
                });
            });
        });
    });
};

//UPDATE EMPLOYEE ROLE - COMPLETED
const updateEmployeeRole = () =>{
    mysql.query(`SELECT * from employee`, (err, result) =>{
        if(err){
            console.log(err);
            return;
        }
        const currentEmployees = result.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: 'Which employee should have their role updated?',
                choices: currentEmployees
            }
        ])
        .then(({selectedEmployee})=>{
            mysql.query(`SELECT * FROM role`, (err, result) =>{
                if (err){
                    console.log(err);
                    return;
                }
                const currentRoles = result.map(({id, title}) => ({ name: title, value: id}));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'selectionRole',
                        message: 'What should this employee\'s role be?',
                        choices: currentRoles,
                    }
                ])
                .then(({selectionRole}) =>{
                    mysql.query(`UPDATE employee
                    SET role_id = ${selectionRole} WHERE id = ${selectedEmployee}`, (err, result)=>{
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log('Employee Role Updated');
                        printMenu();
                    });
                });
            });
        });
    });
};


const menuRouter = (response) =>{
    switch(response.menuChoice){
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRole();
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