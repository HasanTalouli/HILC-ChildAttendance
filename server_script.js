var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
var fs = require("fs");
var builder = require("xmlbuilder");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static("./static"));

app.listen(8080,function(){
    console.log("Server Started");
});

var config = fs.readFileSync('./config.json');
var con = mysql.createConnection(JSON.parse(config));

con.connect(function(err)  {
    if (err)  {
        console.log(err);
        console.log("Error connecting to database"); 
    }else  {
        console.log("Database successfully connected"); 
    }
});

app.get('/getChildren', function(req,res){
    con.query(`SELECT name, individualID from children`, function(err, rows, field){
        if (err){
            console.log(err);
            console.log("Error querying from the database");
        }else{
            res.send(rows);
            res.end();
        }
    })
})

app.post('/attendance', function(req,res){
    con.query(`INSERT INTO attendance (individualID, dateOfCare, timeIn, timeOut, attendance, dayOrNight)
    VALUES
    (${con.escape(req.body.individualID)}, ${con.escape(req.body.dateOfCare)}, ${con.escape(req.body.timeIn)}, ${con.escape(req.body.timeOut)}
    , ${con.escape(req.body.attendance)}, ${con.escape(req.body.dayOrNight)})`, function(err,rows, field){
        if (err){
            console.log(err);
            console.log("error inserting into database");
        }else{
            console.log("added attendance")
        }
    })
})

app.post('/insertChild', function(req,res){
    con.query(`INSERT INTO child (individualID, caseID, name)
    VALUES
    (${con.escape(req.body.individualID)}, ${con.escape(req.body.caseID)}, ${con.escape(req.body.name)}`, function(err,rows, field){
        if (err){
            console.log(err);
            console.log("error inserting into database");
        }else{
            console.log("added child")
        }
    })
})

app.get('/getXML', function(req, res){
    //builder.create('ATT')
})

