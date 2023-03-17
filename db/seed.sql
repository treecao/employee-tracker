-- starter seeds for dept, role, & emp
INSERT INTO department(name)
VALUES ("Engineering"),("Support");

INSERT INTO role (job_title, salary, department_id)
VALUES ("Manager", 100000, 1),("Back End Engineer", 100000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tree", "Cao", 1, NULL),("Umatr","Tome", 2, 1);