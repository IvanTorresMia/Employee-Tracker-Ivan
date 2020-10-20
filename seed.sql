

USE employee_db;


INSERT INTO department (names) 
VALUES 
("Sales"),
("Finance"),
("Engineering"),
("law");



INSERT INTO roles (title, salary, department_id) 
VALUES
("Sales Lead", 80000, 1),
("Sales Associate", 50000, 1),
("Finance Lead", 60000, 2),
("Finance Employee", 40000, 2),
("Engineering Lead", 150000, 3),
("Software Engineer", 100000, 3),
("Law Manager", 200000, 4),
("Attorney", 140000, 4);




INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
("Angel", "Torres", 1, NULL),
("Bob", "Willis", 2, 1),
("Tom", "Fong", 3, NULL),
("Jen", "Hanks", 4, 3),
("Ivan", "Torres", 5, NULL),
("Jerri", "Fong", 6, 5),
("Josh", "Glugatch", 7, NULL),
("Jon", "SanPedro", 8, 7)





