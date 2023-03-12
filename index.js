const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

//connect to db
const db=mysql.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "tracker_db",
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
        choices: ["Add a Department", "Add a Role", "Add an Employee"]
    })
    .then((res)=>{
        switch(res.options){
            case 'Add a Department':
                addDepartment();
                break;
        }
    })
}

// View all employees
function viewEmployees() {con
    db.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  }
  