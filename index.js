'use strict';

const mysql = require('mysql');
const inquirer = require('inquirer');

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
    database: 'tracker_db'
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
                promptMessages.addEmployee,
                promptMessages.removeEmployee,
                promptMessages.updateRole,
                promptMessages.updateEmployeeManager,
                promptMessages.viewAllRoles,
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
                    removeEmployee();
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
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        prompt();
    });
}

function viewByDepartment() {
    /*
    const query =
        'SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1';
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.map(row => console.log(row.artist));
        prompt();
    });
    */
}

function viewByManager() {

}
function addEmployee() {


}

function removeEmployee() {
    /*
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is the first name of the employee?'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is the last name of the employee?'
            }
        ])
        .then(answer => {
            const query = 'SELECT id, fist_name, last_name, role_id, manager_id FROM employee WHERE ?';
            connection.query(query, { employee: answer.first_name && answer.last_name }, (err, res) => {
                if (err) throw err;
                printRows(res);
                prompt();
            });
        });
        */

}

function updateRole() {


}

function updateEmployeeManager() {

}

function viewAllRoles() {

}



/*
function songSearch() {
    inquirer
        .prompt({
            name: 'song',
            type: 'input',
            message: 'What song would you like to look for?'
        })
        .then(answer => {
            console.log(answer.song);
            connection.query(
                'SELECT * FROM top5000 WHERE ?',
                { song: answer.song },
                (err, res) => {
                    if (err) throw err;
                    printRow(res[0]);
                    prompt();
                }
            );
        });
}

function songAndAlbumSearch() {
    inquirer
        .prompt({
            name: 'artist',
            type: 'input',
            message: 'What artist would you like to search for?'
        })
        .then(answer => {
            const query = `
        SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist
        FROM top_albums
        INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year = top5000.year)
        WHERE (top_albums.artist = ? AND top5000.artist = ?)
        ORDER BY top_albums.year, top_albums.position`;

            connection.query(query, [answer.artist, answer.artist], (err, res) => {
                if (err) throw err;
                console.log(res.length + ' matches found!');
                printRows(res);
                prompt();
            });
        });
}
*/
/*
function printRows(rows) {
    for (let row of rows) {
        printRow(row);
    }
}

function printRow(row) {
    if (row) {
        let rowAsString = '';
        for (let key in row) {
            rowAsString += getPrintableColumn(row, key);
        }
        console.log(rowAsString);
    }
}

function getPrintableColumn(row, column) {
    return `${column}: ${row[column]} | `;
}
*/