const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const consoleTable = require("console.table");

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "tdwp2140694",
  database: "employee_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // console.log(rows)
  // run the start function after the connection is made to prompt the user
  start();
});

// Promisify so that I can use async/await syntax
// connection.query = util.promisify(connection.query);

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "userChoice",
        message: "What would you like to do?",
        choices: [
          "View departments",
          "View roles",
          "View employees",
          "Add departments",
          "Add roles",
          "Add employees",
          "Update roles",
          "Exit",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.userChoice) {
        case "View departments":
          viewDepartments();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "Add departments":
          addDepartments();
          break;
        case "Add roles":
          addRoles();
          break;
        case "Add employees":
          addEmployees();
          break;
        case "Update roles":
          updateRoles();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          connection.end();
      }
    });
}

async function viewDepartments() {
  // Async/Await version
  // const res = await connection.query("SELECT * FROM departments");
  // console.table(res);

  connection.query("SELECT * FROM departments", function (err, data) {
    if (err) throw err;
    console.table(res);
  });
}

function viewRoles() {
  connection.query(
    "SELECT roles.id, roles.title, departments.name, roles.salary FROM roles INNER JOIN departments ON roles.department_id = departments.id",
    function (err, res) {
      console.table(res);
    }
  );
}
// Make sure every employee also has the manager at the end.
function viewEmployees() {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM departments INNER JOIN roles ON departments.id = roles.department_id INNER JOIN employees ON roles.id = employees.role_id LEFT JOIN employees manager ON employees.manager_id = manager.id ORDER BY employees.id ASC",
    function (err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}

function addDepartments() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What department would you like to add?",
      },
    ])
    .then(function (answer) {
      connection.query("INSERT INTO departments SET ?", {
        name: answer.department,
      });
      console.log("You added a department!");
    });
}

function addRoles() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "newRole",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "newSalary",
          message: "what is the salary of the role?",
        },
        {
          type: "list",
          name: "department",
          message: "what is the department you want to add into?",
          choices: function () {
            const depArr = [];
            for (i = 0; i < res.length; i++) {
              depArr.push(res[i].name);
            }
            return depArr;
          },
        },
      ])
      .then(function (answer) {
        let newDept;
        for (i = 0; i < res.length; i++) {
          if (res[i].name === answer.department) {
            newDept = res[i].id;
          }
        }
        connection.query("INSERT INTO roles SET ?", {
          title: answer.newRole,
          salary: answer.newSalary,
          department_id: newDept,
        });
      });
  });
}

function addEmployees() {
  connection.query(
    "SELECT * FROM roles",
    // JOIN employees ON employees.role_id = roles.id GROUP BY roles.title",
    function (err, roleRes) {
      connection.query("SELECT * FROM employees", function (err, empRes) {
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "What is the employee's first Name?",
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name?",
            },
            {
              type: "list",
              name: "roles",
              message: "What role would you like to add them to?",
              choices: function () {
                var roleArr = [];
                for (i = 0; i < roleRes.length; i++) {
                  roleArr.push(roleRes[i].title);
                }
                return roleArr;
              },
            },
            {
              type: "list",
              name: "manager",
              message: "What manager do you want to add to?",
              choices: function () {
                const manager = [];
                for (i = 0; i < empRes.length; i++) {
                  if (empRes[i].manager_id === null) {
                    manager.push(empRes[i].first_name);
                  }
                }
                manager.push("None");
                return manager;
              },
            },
          ])
          .then(function (answer) {
            let newRole;
            for (i = 0; i < roleRes.length; i++) {
              if (roleRes[i].title === answer.roles) {
                newRole = roleRes[i].id;
              }
            }
            let manId;
            for (i = 0; i < empRes.length; i++) {
              if (empRes[i].first_name === answer.manager) {
                manId = empRes[i].id;
              }
            }
            connection.query(
              "INSERT INTO employees SET ?",
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: newRole,
                manager_id: manId,
              },
              function (err) {
                if (err) throw err;
                console.log("Successfully added an employee!");
              }
            );
          });
      });
    }
  );
}

function updateRoles() {
  connection.query("SELECT * FROM employees", function (err, empRes) {
    if (err) throw err;
    connection.query("SELECT * FROM roles", function (err, rolesRes) {
      if (err) throw err;
      inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: function () {
            const employeeArr = [];
            for (i = 0; i < empRes.length; i++) {
              employee.push(`${empRes[i].first_name} ${empRes[i].last_name}`);
            }
            return employeeArr;
          }
          },
          {
            type: "list",
            name: "role",
            message: "what is their new role?",
            choices: function () {
              const roleArr = [];
              for (i = 0; i < empRes.length; i++) {
                roleArr.push(roleRes[i].title);
              }
              return roleArr;
            }
          }
      ]).then(function(answer){

      })
    });
  });
}
