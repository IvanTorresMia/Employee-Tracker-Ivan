

USE employee_db;


INSERT INTO departments (name) 
VALUES 
("Sales"),
("Finance"),
("Engineering"),
("Law");



INSERT INTO roles (title, salary, department_id) 
VALUES
("Sales Manager", 80000, 1),
("Sales Associate", 50000, 1),
("Finance Manager", 60000, 2),
("Finance Employee", 40000, 2),
("Engineering Manager", 150000, 3),
("Software Engineer", 100000, 3),
("Law Manager", 200000, 4),
("Attorney", 140000, 4);




INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES 
("Angel", "Torres", 1, NULL),
("Bob", "Willis", 2, 1),
("Tom", "Fong", 3, NULL),
("Jen", "Hanks", 4, 3),
("Ivan", "Torres", 5, NULL),
("Jerri", "Fong", 6, 5),
("Josh", "Glugatch", 7, NULL),
("Jon", "SanPedro", 8, 7);











