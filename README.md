# Employee-Tracker-Ivan

## Table of Contents
* [Description](#Description)
* [Technologies](#Technologies)
* [Features](#Features)
* [Usage](#Usage)
* [Installation](#Installation)
* [Author](#Author)
* [Credits](#Credits)
* [License](#License)

## Description 
Hi! Welcome to my Employee Tracker App! Here You will find a way to keep track of your entire companies, employees, and managers for each department. In this app you are also able to add, delete, or update employess as well as wiew all the employees you currently have in your company. Navigate to the usage section where I have a video that explains how to use the app!


## Technologies
* [JavaScript](https://www.w3schools.com/js/)
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [MySql](https://nodejs.dev/learn/the-nodejs-fs-module)
* [Node.js](https://nodejs.org/en/)



## Features
![Employee-Tracker-gif](./assets/Employee-Tracker3.gif)

* Some of the coolest function I have in here will be presented but I wanted to show you this one because it took me a while to get it and it worked after some loss of hair. This Function add employees by nesting three connection.query's the first two are made so I can access items from the employee table and the roles table. The thrid connection is to be able to INSERT into employees. 
```
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
  ```


* This function took me a while as well bacically after a ton of googling and thank God for my tutor and w3 schools I was able to join three table and LEFT JOIN to diplay the managers to the right of the tables. 

```
function viewEmployees() {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM departments INNER JOIN roles ON departments.id = roles.department_id INNER JOIN employees ON roles.id = employees.role_id LEFT JOIN employees manager ON employees.manager_id = manager.id ORDER BY employees.id ASC",
    function (err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}
```



## Usage
[Usage-Video](https://drive.google.com/file/d/1LGy1IfXMMrCYD3GC1WQpJG-t-X_o8UCy/view)


## Installation
In order to run this app you have to install inquirer using 
```
mpi install inquirer
```
Then You intall MySql

```
npm install mysql
```

then to install console.tables in orders for your table to look pretty
```
npm install console.table
```
Now that you have everything installed you want to run 
```
node index.js
```

## Author
Ivan Torres
* [GitHub-Repo](https://github.com/IvanTorresMia/READme-project-Ivan)
* [linkedIn](www.linkedin.com/in/ivan-torres-0828931b2)

## Credits
* Credits for this homework assignment go out to Jerome, Manuel, Kerwin, Roger, and all of my classmates who helped me in study sessions. As well as my tutor who helped me a ton with understanding this homework assignment. 
* [StackOverFlow](https://stackoverflow.com/)




## License]
[MIT](https://choosealicense.com/licenses/mit/#) license 