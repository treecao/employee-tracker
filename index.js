const mysql = require("mysql2");
const cTable = require('console.table');
const inquirer = require("inquirer");
require("dotenv").config();

//connect to db
const db=mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: process.env.PW,
        database: "tracker_db",
        port: 3306
    },
    console.log('connected to tracker_db database')
);

//check for error
db.connect((err)=>{
    if (err) throw err;
});

//start application & prompt users with questions
function init(){
    inquirer
    .prompt([
        {
            type: "list",
            message: "Please select from the following options",
            name: "initialize",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Done"]
        }
    ]).then(ans => {
        switch (ans.initialize) {
            case "View all departments": viewDepartments();
                break;
            case "View all roles": viewRoles();
                break;
            case "View all employees": viewEmployees();
                break;
            case "Add a department": addDepartment();
                break;
            case "Add a role": addRole();
                break;
            case "Add an employee": addEmployee();
                break;
            case "Update an employee role": updateEmployee();
                break;
            case "Done":
                console.log("Completed!");
                process.exit();
        }
    }).catch(err => console.error(err));
}

init();

// show list of all departments
function viewDepartments() {
    db.query(`SELECT * FROM department`, (err,res) =>{
        if (err) throw err
        console.table(res)
        return init()
    })
};

//show list of all roles
function viewRoles() {
    db.query(`SELECT * FROM roles`, (err,res) =>{
        if (err) throw err
        console.table(res)
        return init()
    })
};

// show list of all employees currently in DBd
function viewEmployees() {
    db.query(`SELECT * FROM employees`, (err,res) =>{
        if (err) throw err
        console.table(res)
        return init()
    })
};

//starts prompts to add new department
function addDepartment() {
    inquirer.prompt({
        type: "input",
        message: "What is the name of the new department?",
        name: "addDept"
    }).then(res => {
        db.query(`INSERT INTO department(name) VALUES ("${res.addDept}");`, (err,res) =>{
            if (err) throw err
            console.table(res)
            return init()
    })
    })
};

// start prompt to add a new role
function addRole() {
    const deptChoices = () => db.promise().query(`SELECT * FROM department`)
        .then((rows)=>{
            let arrNames = rows[0].map(obj => obj.name);
            return arrNames
        })
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of this new role?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "roleSalary"
        },
        {
            type: "list",
            message: "Which department is this role in?",
            name: "addDept",
            choices: deptChoices
        }
    ]).then(ans => {
        db.promise().query(`SELECT id FROM department WHERE name = ?`, ans.addDept)
            .then(answer => {
                let mappedId = answer[0].map(obj => obj.id);
                return mappedId[0]
            })
            .then((mappedId) => {
                db.promise().query(`INSERT INTO roles(title, salary, department_id)
            VALUES(?, ?, ?)`, [ans.roleTitle, ans.roleSalary, mappedId]);
                init()
            })
    })
};



// start prompt to add new employee
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the new employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        }
    ]).then(ans => {
        db.query(`INSERT INTO employees(first_name, last_name)
                VALUES(?, ?)`, [ans.firstName, ans.lastName], (err, results) => {
            if (err) {
                console.log(err)
            } else {
                db.query(`SELECT * FROM employees`, (err, results) => {
                    err ? console.error(err) : console.table(results);
                    init();
                })
            }
        }
        )
    })
};

function updateEmployee() {
    const res = db.query(`SELECT * FROM employees`)
    console.table(res[0])
    const emp = res[0]
    let employeeList = []
    emp.forEach(employees => {
        employeeList.push({
            name: employees.first_name + ", " + employees.last_name,
            value: employees.id
        })
    });
    const answer = inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee role do you want to update?',
            choices: employeeList
        }
    ])
    
    const roles = db.query(`SELECT * FROM roles`);
    console.table(roles[0]);
    const rol = roles[0]
    const rolesList = rol.map(roles => ({
        
            name: roles.title + ", " + roles.salary,
            value: roles.id
        }));

    const employeeId = answer.employeeId;
    const ans = inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Which role would you like to update the employee to?',
            choices: rolesList
        },
    ])
    connection.query(`UPDATE employees SET roles_id = '${ans.roles}' where employees.id = ${employeeId}`);
    init()
};