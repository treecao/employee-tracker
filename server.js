const inquirer = require("inquirer");
const connection = require("./db/connection");
const db = require('./db/connection');

async function app() {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit',
            ],
        },
    ])
    if (answer.choice === 'View all departments') {
        viewDepartments()
    }
    if (answer.choice === 'View all roles') {
        viewRoles()
    }
    if (answer.choice === 'View all employees') {
        viewEmployees()
    }
    if (answer.choice === 'Add a department') {
        addDepartment()
    }
    if (answer.choice === 'Add a role') {
        addRole()
    }
    if (answer.choice === 'Add an employee') {
        addEmployee()
    }
    if (answer.choice === 'Update an employee role') {
        updateRole()
    }

}
// view departments function 
async function viewDepartments() {
    const results = await db.promise().query('SELECT * FROM department;')
    console.table(results[0])
    app()

}
// view roles function 
async function viewRoles() {
    const results = await db.promise().query('SELECT * FROM role;')
    console.table(results[0])
    app()

}
// view employees function 
async function viewEmployees() {
    const results = await db.promise().query('SELECT * FROM employee;')
    console.table(results[0])
    app()

}
// add department function 
async function addDepartment() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What department would you like to add?',
        },
    ])

    const results = await db.promise().query('INSERT INTO department (name) VALUES (?)', answer.addDepartment)
    console.table(results)
    app()

}
// add role function 
async function addRole() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'roles',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to',
            choices: ["Engineering", "Finance", "Legal", "Sales"],
        },
    ])
        .then(function (answer) {
            let departmentId = 0
            if (answer.department === "Engineering") {
                departmentId = 1
            }
            if (answer.department === "Finance") {
                departmentId = 2
            }
            if (answer.department === "Legal") {
                departmentId = 3
            }
            if (answer.department === "Sales") {
                departmentId = 4
            }
            // console.log(answer);
            connection.query("INSERT INTO role SET ?", {
                title: answer.roles,
                salary: answer.salary,
                department_id: departmentId,
            }), function (err) {
                if (err) throw err;
            }
        });

    app()

}
// add employee function 
async function addEmployee() {

    await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the employees role?',
            choices: ["Sales Lead", "Lead Engineer","Software Engineer","Account Manager","Accountant","Legal Team Lead","Lawyer" ],
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employees manager?',
            choices: ["John Doe", "Mike Chan", "Ashley Rodriguez", "Kevin Tupik", "Kunal Singh", "Malia Brown"],
            // choices: ["john doe", 2, 3, 4, 5, 6],
        }

    ]).then(function (answer) {
        let managerId = 0
        let roleId = 0
        if (answer.manager === "john doe") {
            console.log("test")
            managerId = 1
        }
        if (answer.manager === "Mike Chan") {
            managerId = 2
        }
        if (answer.manager === "Ashley Rodriguez") {
            managerId = 3
        }
        if (answer.manager === "Kevin Tupik") {
            managerId = 4
        }
        if (answer.manager === "Kunal Singh") {
            managerId = 5
        }
        if (answer.manager === "Malia Brown") {
            managerId = 6
        }

        if (answer.role === "Sales Lead") {
            console.log("test")
            roleId = 4
        }
        if (answer.role === "Lead Engineer") {
            roleId = 1
        }
        if (answer.role === "Software Engineer") {
            roleId = 1
        }
        if (answer.role === "Account Manager") {
            roleId = 2
        }
        if (answer.role === "Accountant") {
            roleId = 2
        }
        if (answer.role === "Legal Team Lead") {
            roleId = 3
        }
        if (answer.role === "Lawyer") {
            roleId = 3
        }
        // console.log(answer);
        connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: roleId,
            manager_id: managerId,
        }), function (err) {
            if (err) throw err;
        }
    });

    app()

}

//update role function
async function updateRole() {
    const results = await db.promise().query('SELECT * FROM employee;')
    console.table(results[0])
    const emp = results[0]
    let employeeList = []
    emp.forEach(employee => {
        employeeList.push({
            name: employee.first_name + ", " + employee.last_name,
            value: employee.id
        })
    });
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee role do you want to update?',
            choices: employeeList
        }
    ])
    
    const roles = await db.promise().query('SELECT * FROM role;');
    console.table(roles[0]);
    const rol = roles[0]
    const rolesList = rol.map(role => ({
        
            name: role.title + ", " + role.salary,
            value: role.id
        }));

    const employeeId = answer.employeeId;
    // console.log("this is answer.roles", answer);
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to sign the selected employee?',
            choices: rolesList
        },
    ])
    connection.query(`UPDATE employee SET role_id = '${ans.role}' where employee.id = ${employeeId}`);
    // connection.query(`UPDATE employee SET role_id = ? where employee.id = ?`, [answer.role, employeeId]);
    app()

}


app()
