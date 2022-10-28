//ADD EMPLOYEES - COMPLETED
//REWRITTEN ATTEMPTING PROMISE QUERY 
//(I'm not really sure where to put catches/this is still really nested trying to work it out)
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
