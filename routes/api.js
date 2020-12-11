// Created By:
// Fabricio Zacarias
// fabricio17zg@gmail.com

var express = require("express");
var router = express.Router();
var mysql = require('mysql');
let connectionMySQL;

let connectionMySQLObject = {
  host: '127.0.0.1',
  user: 'root',             // USUARIO MYSQL
  password: 'Nintendo123',             //CONTRASENIA MYSQL
  database: 'mydb'  //BASE DE DATOS
}

function connectDB() {
  connectionMySQL = mysql.createConnection(connectionMySQLObject);
  //console.log(connectionMySQL);
  connectionMySQL.connect((error) => {
    if (error) {
      console.log("ERROR WHILE CREATING THE CONECTION: " + error);
    } else {
      console.log("SUCCESFULLY CONNECTED TO MYSQL SERVER");
    }
  });
}

function closeConnectionDB() {
  connectionMySQL.end((error) => {
    if (error) {
      console.log("ERROR WHILE CLOSING THE CONECTION: " + error);
    } else {
      console.log("SUCCESFULLY CLOSE TO MYSQL SERVER");
    }
  });
}

router.get('/', function (req, res) {
  res.send("Jelou Der")
})

router.get('/all', (req, res, next) => {
  connectDB();
  var query = `SELECT * FROM visitas;`;

  connectionMySQL.query(query, true, (error, results, fields) => {
    if (error) {
      console.log("QUERY ERROR " + error);
      res.send("QUERY ERROR: " + error);
    } else {
      console.log(results);
      res.send(results);
    }
    closeConnectionDB();
  });
});

router.post('/:boolean', (req, res, next) => {
  connectDB();
  var query = `INSERT INTO visitas (boolean) VALUES (${req.params.boolean});`;

  connectionMySQL.query(query, true, (error, results, fields) => {
    if (error) {
      console.log("QUERY ERROR " + error);
      res.send("QUERY ERROR: " + error);
    } else {
      console.log(results);
      res.send(results);
    }
    closeConnectionDB();
  });
});

module.exports = router;