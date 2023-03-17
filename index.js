const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
require("dotenv").config();

//connect to db
const db=mysql.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
        password: process.env.PW,
        database: "tracker_db",
        port: 3306
    }
);

//check for error
db.connect((err)=>{
    if (err) throw err;
});

//start application & prompt users with questions
function init(){
    inquirer
    .prompt({
        type: "list",
        name: "options",
        message: "something",
        choices: ["View all Departments", "View all Roles", "View all Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an employee role", "Quit"]
    })
    .then((res)=>{
        switch(res.options){
            case 'View all Departments':
                viewDepartments();
                break;
            case 'View all Roles':
                viewRoles();
                break;
            case 'View all Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployee();
                break;                
        }
    })
}

// View all employees
// function viewEmployees() {con
//     db.findAllEmployees()
//       .then(([rows]) => {
//         let employees = rows;
//         console.log("\n");
//         console.table(employees);
//       })
//       .then(() => loadMainPrompts());
//   }
function viewDepartments() {
    db.query(`SELECT * FROM department`, (err,res) =>{
        if (err) throw err
        console.table(res)
        return init()
    })
}

function viewRoles() {
    db.query(`SELECT * FROM role`, (err,res) =>{
        if (err) throw err
        console.table(res)
        return init()
    })
}

function viewEmployees() {
    db.query(`SELECT * FROM employee`, (err,res) =>{
        if (err) throw err
        console.table(res)
        return init()
    })
}

function addDepartment() {
    inquirer.prompt({
        message: "Enter Department Name: ",
        name: "DeptName"
    }).then(res => {
        db.query(`INSERT INTO department(name) VALUES ("${res.DeptName}");`, (err,res) =>{
            if (err) throw err
            console.table(res)
            return init()
    })
    })
}

function Quit() {
    process.exit()
}
  

init()