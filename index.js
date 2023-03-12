//prompt users with questions

// View all employees
function viewEmployees() {
    db.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  }
  