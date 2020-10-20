var mysql = require("mysql");
var inquirer = require("inquirer");
const consoleTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
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
      }
    });
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    console.table(res);
  });
}

function viewRoles() {
  connection.query(
    "SELECT roles.id, title, names, salary FROM roles INNER JOIN department ON roles.department_id = department.id",
    function (err, res) {
      console.table(res);
    }
  );
}

function viewEmployees() {
  connection.query(
    "SELECT * FROM  department INNER JOIN roles ON department.id = roles.department_id INNER JOIN employee ON roles.id = employee.role_id",
    function (err, res) {
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
      connection.query("INSERT INTO department SET ?", {
        names: answer.department,
      });
      console.log("You added a department!");
    });
}

function addRoles() {
  connection.query("SELECT * FROM department", function (err, res) {
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
            var depArr = [];
            for (i = 0; i < res.length; i++) {
              depArr.push(res[i].names);
            }
            return depArr;
          },
        },
      ])
      .then(function (answer) {
        var newDept;
        for (i = 0; i < res.length; i++) {
          if (res[i].names === answer.department) {
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
    "SELECT * FROM roles JOIN employee ON employee.role_id = roles.id",
    function (err, res) {
      var manager = [];
      for (i = 0; i < res.length; i++) {
        if (res[i].manager_id === null) {
          manager.push(res[i].first_name);
        }
      }

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
              for (i = 0; i < res.length; i++) {
                roleArr.push(res[i].title);
              }
              return roleArr;
            },
          },
          {
            type: "list",
            name: "manager",
            message: "What manager do you want to add to?",
            choices: function () {
              var manager = [];
              for (i = 0; i < res.length; i++) {
                if (res[i].manager_id === null) {
                  manager.push(res[i].first_name);
                }
              }
              return manager;
            }
          },
        ])
        .then(function (answer) {
          var newRole;
          for (i = 0; i < res.length; i++) {
            if (res[i].title === answer.roles) {
              newRole = res[i].id;
            }
          }
          var manId;
          for (i = 0; i < res.length; i++){
              if (res[i].first_name === answer.manager) {
                  manId = res[i].id
              }
          }
          connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: newRole,
            manager_id: manId
          });
        });
    }
  );
}

function updateRoles() {}
