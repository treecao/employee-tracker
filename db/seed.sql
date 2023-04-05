-- starter seeds for dept, role, & emp
INSERT INTO department(name)
VALUES ("Engineering"),("Support"),("HR"),("Sales");

INSERT INTO roles(title, salary, department_id)
VALUES ("Engineering Manager", 100000, 1),("Back End Engineer", 100000, 1),("Account Manager", 80000, 4),("Support Agent", 75000, 2),("HR Rep", 80000, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Tree", "Cao", 1, NULL),("Matt","When", 2, 1),("Ro", "Gonzo", 4, 1), ("Rita", "Raja", 3, NULL);