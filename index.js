'use strict';

const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');



const promptMessages = {
    viewAllEmployees: "View All Employees",
    viewByDepartment: "View All Employees By Department",
    viewByManager: "View All Employees By Manager",
    addEmployee: "Add An Employee",
    removeEmployee: "Remove An Employee",
    updateRole: "Update Employee Role",
    updateEmployeeManager: "Update Employee Manager",
    viewAllRoles: "View All Roles",
    exit: "Exit"
};

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'chargers619',
    database: 'employees'
});

connection.connect(err => {
    if (err) throw err;
    prompt();
});

function prompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                promptMessages.viewAllEmployees,
                promptMessages.viewByDepartment,
                promptMessages.viewByManager,
                promptMessages.viewAllRoles,
                promptMessages.addEmployee,
                promptMessages.removeEmployee,
                promptMessages.updateRole,
                promptMessages.updateEmployeeManager,
                promptMessages.exit
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.action) {
                case promptMessages.viewAllEmployees:
                    viewAllEmployees();
                    break;

                case promptMessages.viewByDepartment:
                    viewByDepartment();
                    break;

                case promptMessages.viewByManager:
                    viewByManager();
                    break;

                case promptMessages.addEmployee:
                    addEmployee();
                    break;

                case promptMessages.removeEmployee:

                    remove();
                    break;

                case promptMessages.updateRole:
                    updateRole();
                    break;

                case promptMessages.updateEmployeeManager:
                    updateEmployeeManager();
                    break;

                case promptMessages.viewAllRoles:
                    viewAllRoles();
                    break;

                case promptMessages.exit:
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (employee.first_name, ' ', employee.last_name) AS manager FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

function viewByDepartment() {
    const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY DEPARTMENT');
        console.log('\n');
        console.table(res);
        prompt();
    });
}


function viewByManager() {
    const query = `SELECT employee.id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY MANAGER');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

function viewAllRoles() {
    const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY ROLE');
        console.log('\n');
        console.table(res);
        prompt();
    });

}

async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            const choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            const { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const row of res) {
                    row.fullName = `${row.first_name} ${row.last_name}`;
                    if (row.fullName === manager) {
                        managerId = row.id;
                        managerName = row.fullName;
                        continue;
                    }
                }
            }
            console.log('Employee has been added. Please view all employee to verify...');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: managerId
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });

}
function remove() {
    const promptQ = {
        yes: "yes",
        no: "no I don't"
    };
    console.log("In order to delete an employee, the employee ID must be entered. View all employees to get" +
        "the employee ID..");
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "Do you have the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (answer.action === "yes") removeEmployee();
        else viewAllEmployees();



    });
};

function roles() {
    const query = `SELECT role.id, role.title FROM role ORDER BY role.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        prompt();
    });
}
async function removeEmployee() {

    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the employee ID you want to remove:  "
        }
    ]);

    connection.query('DELETE FROM employee WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
        }
    )
    console.log('Employee has been removed on the system!');
    prompt();

};






function updateEmployeeManager() {

}




function updateRole() {

}



function prompt_Q() {
    inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        },
        {
            name: "role",
            type: "input",
            message: "What is the role of the employee? : "

        },
        {
            name: "manager",
            type: "input",
            message: "Please refer to the chart above. What is manager ID number?: "
        }

    ]).then(answer => {
        connection.query('INSERT INTO employee SET ?',
            {
                first_name: answer.first,
                last_name: answer.last,
                role_id: answer.role,
                manager_id: answer.manager
            },
            (err) => {
                if (err) throw err;
                console.log(`Employee inserted!\n`);
                // Call updateProduct AFTER the INSERT completes

            }
        )
    });

    prompt();
}

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
}