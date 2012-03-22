"use strict";

var sqlite3 = require('sqlite3').verbose();
var db;


function start() {
    createDb();
}

function createDb(){
    console.log("In createDb");
    db = new sqlite3.Database('temp.sqlite3', createTable);
}

function createTable(){
    console.log("Creating new Table");
    // run: Runs the SQL query with the specified parameters and calls the callback afterwards. It does not retrieve any result data. The function returns the Database object for which it was called to allow for function chaining.
    db.run("CREATE TABLE cars (Id integer, Name text)", insertRows); 
}

function insertRows(){
  console.log("Creating Rows");
  
  // prepare: Prepares the SQL statement -> used to reduce duplication of code! See simple-chaining.js 
  // Optionally binds the specified parameters and calls the callback when done.
 
 var stmt = db.prepare( "INSERT INTO cars VALUES (?,?)" ); 
 // (?,?) -> means we can insert two parameters
 stmt.run(1000, "Jack");  
 
}

function closeDb(){
    console.log("closeDb");
    db.close();
}

start();
