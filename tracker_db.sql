DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department(
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

SELECT * FROM department;

CREATE TABLE role(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(50) UNIQUE NOT NULL,
	salary DECIMAL UNSIGNED NOT NULL,
	department_id INT UNSIGNED NOT NULL,
	INDEX dep_ind(department_id),
	CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

    SELECT * FROM role;

CREATE TABLE employee(
	id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY(id),
    INDEX role_ind(role_id),
	CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE CASCADE,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
    
);

SELECT * FROM employee;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
FROM employee
INNER JOIN role ON (role.id = employee.role_id)
INNER JOIN department ON (department.id = role.department_id)
ORDER BY employee.id;
