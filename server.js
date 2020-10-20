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
      inquirer.prompt([
          {
              type: "list",
              name: "userChoice",
              message: "What would you like to do?",
              choices: ["View departments", "View roles", "View employees", "Add departments", "Add roles", "Add employees", "Update roles"]
          }
      ]).then(function(answer){
          
        switch(answer.userChoice) {
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
      })
  }

function viewDepartments(){
     connection.query("SELECT * FROM department", function(err, res){
         console.table(res);
     } )
  }
  

function viewRoles() {
    connection.query("SELECT * FROM roles INNER JOIN department ON roles.department_id = department.id", function(err, res) {
        console.table(res);
    })
}
  
function viewEmployees() {
    connection.query("SELECT * FROM  department INNER JOIN roles ON department.id = roles.department_id INNER JOIN employee ON roles.id = employee.role_id", function(err, res){
        console.table(res);
    })
 
}

function addDepartments(){
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What department would you like to add?"
        }
    ]).then(function(answer){
        connection.query("INSERT INTO department SET ?", {title: answer.department})
        console.log("You added a department!")
    } )
}

function addRoles() {
    connection.query("SELECT * FROM department", function(err, res){
        console.log(res.id);
    } )
    
}

function addEmployees() {
    console.log("addEmployees");
    start()
}

function updateRoles() {
    console.log("Update Roles");
    start()
}
