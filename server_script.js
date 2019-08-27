var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
var fs = require("fs");


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static("."));

app.listen(8080,function(){
    console.log("Server Started");
});

var con = mysql.createConnection({
    host:  "hilcdaycare.com",
    user:  "root",
    password: pw,
    database: "school"
});

con.connect(function(err)  {
    if (err)  {
        console.log(err);
        console.log("Error connecting to database"); 
    }else  {
        console.log("Database successfully connected"); 
    }
});
