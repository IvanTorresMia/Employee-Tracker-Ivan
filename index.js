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
  start();
});

// Promisify so that I can use async/await syntax
// connection.query = util.promisify(connection.query);

// This function starts you out asking you what you want to do! :)
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
          "delete employee",
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
        case "delete employee":
          deleteEmployee();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          connection.end();
      }
    });
}


// This function Allows you to view all departments
async function viewDepartments() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// This function allows you to vew all roles.
function viewRoles() {
  connection.query(
    "SELECT roles.id, roles.title, departments.name, roles.salary FROM roles INNER JOIN departments ON roles.department_id = departments.id",
    function (err, res) {
      console.table(res);
      start();
    }
  );
}

// This function allows you to Vew all the employees and their managers.
function viewEmployees() {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM departments INNER JOIN roles ON departments.id = roles.department_id INNER JOIN employees ON roles.id = employees.role_id LEFT JOIN employees manager ON employees.manager_id = manager.id ORDER BY employees.id ASC",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

//This function allows you to view all the departments
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
      start();
    });
}

// This function allows you to add Roles to you company.
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
        console.log("You added a role!")
        start();
      });
  });
}

// This function allows you to add employees to you company.
function addEmployees() {
  connection.query(
    "SELECT * FROM roles",
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
                start();
              }
            );
          });
      });
    }
  );
}

// This function allows you to update the roles of your employees.
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
              employeeArr.push(`${empRes[i].first_name} ${empRes[i].last_name}`);
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
              for (i = 0; i < rolesRes.length; i++) {
                roleArr.push(rolesRes[i].title);
              }
              return roleArr;
            }
          }
      ]).then(function(answer){
          let splitEmployee = answer.employee.split(" ");
          let firstName = splitEmployee[0];
          let lastName = splitEmployee[1];

         let updateRole;
         for (i = 0; i < rolesRes.length; i++) {
           if (rolesRes[i].title === answer.role) {
             updateRole = rolesRes[i].id;
           }
         }
          connection.query("UPDATE employees SET ? WHERE ? AND ?", [
            {
              role_id: updateRole
            },
            {
              first_name: firstName
            },
            {
              last_name: lastName
            }
          ], function(err, res) {
            if (err) throw err;
            console.log("You just updated a role!")
            start();
            return res;
          })   
      })
    });
  });
}

// This function allows you to delete employees.
function deleteEmployee() {
    connection.query("SELECT * FROM employees", function(err, res) {
      if (err) throw err;
      inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: function () {
            const employeeArr = [];
            for (i = 0; i < res.length; i++) {
              employeeArr.push(`${res[i].first_name} ${res[i].last_name}`);
            }
            return employeeArr;
          }
        }
      ]).then(function(answer) {
        let splitEmployee = answer.employee.split(" ");
        let firstName = splitEmployee[0];
        let lastName = splitEmployee[1];

        connection.query("DELETE FROM employees WHERE ? AND ?", [
          {
            first_name: firstName
          },
          {
            last_name: lastName
          }
        ], function(err, res) {
          if (err) throw err;
          console.log("You just deleted a role!")
          start();
          return res;
        })   
      })

    })

}