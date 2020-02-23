



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


    const answer = await inquirer.prompt([
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

    ]);
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

    prompt();
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

async function show() {
    const show1 = await `SELECT role.id, role.title FROM role ORDER BY role.id;`;
    connection.query(show1, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
    });
    const show = await `SELECT employee.id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    connection.query(show, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);

    });
}

module.exports = viewAllEmployees(), viewByDepartment(), viewByManager(), addEmployee(), removeEmployee(), viewAllRoles(), updateEmployeeManager(), updateRole();
