DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE roles(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(10, 2),
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  PRIMARY KEY (id)
);

CREATE TABLE employees(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employees(id),
  PRIMARY KEY (id)
);