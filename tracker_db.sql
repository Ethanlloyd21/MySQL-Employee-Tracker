DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department(
  id INT UNSIGNED PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);



CREATE TABLE role(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(50) UNIQUE NOT NULL,
	salary DECIMAL UNSIGNED NOT NULL,
	department_id INT UNSIGNED NOT NULL,
	INDEX dep_ind(department_id),
	CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

   

CREATE TABLE employee(
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INTEGER NOT NULL,
    INDEX role_ind (role_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INTEGER,
    INDEX man_ind(manager_id),
	CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

use tracker_db;
INSERT INTO department
    (id, name)
VALUES
    (101, 'Sales'),
    (202, 'Engineering'),
    (303, 'Finance'),
    (404, 'Legal');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 101),
    ('Salesperson', 80000, 101),
    ('Lead Engineer', 150000, 202),
    ('Software Engineer', 120000, 202),
    ('Account Manager', 160000, 303),
    ('Accountant', 125000, 303),
    ('Legal Team Lead', 250000, 404),
    ('Lawyer', 190000, 404);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7);


SELECT * FROM employee;