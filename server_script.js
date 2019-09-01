var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
var fs = require("fs");
var builder = require("xmlbuilder");
// Generates the xml files
var fs = require('fs');
var builder = require('xmlbuilder');
const path = require('path');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static("./static"));

app.listen(8080,function(){
    console.log("Server Started");
});

var config = fs.readFileSync('./config.json');
// var con = mysql.createConnection(JSON.parse(config));
var con = mysql.createPool(JSON.parse(config));

// con.connect(function(err)  {
//     if (err)  {
//         console.log(err);
//         console.log("Error connecting to database"); 
//     }else  {
//         console.log("Database successfully connected"); 
//     }
// });

app.get('/getChildren', function(req,res){
    console.log("Getting chldren");
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
            console.log("added attendance");
            // res.send("Successfully added attendance");
            res.json({'Status': 'success'});
            res.end();
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
            console.log("added child");
            // res.send("Successfully inserted child");
            res.end();
        }
    })
})

app.get('/getXML', function(req, res){
    var jsonXml = {HELLO: 'meh'};

    // This value will be gotten from the user
    var selectedDate = new Date(2019, 8, 29, 1);
    // TODO: replace hardcoded month and year to reflect user input
    var request = "SELECT * FROM CS275Daycare.attendance JOIN children ON attendance.individualID = children.individualID WHERE YEAR(dateOfCare) = 2019 AND MONTH(dateOfCare) = 8;";
    con.query(request, function(err, rows, fields) {
        if (err) {
            console.log("Error getting requested elements: " + err.message);
            // PUT res.send() FOR ERROR!!!
        }
        else {

            // Getting this student's caseID
            var caseID = "";


                // console.log(JSON.stringify(rows));
                console.log("Rows: " + rows);
                // An array of all students (their IDs) that have already been placed in the JSON result
                var insertedStudents = [];


                // Generating a list of all CHILDATTNDC which will each be its own CHILDATTNDC
                var CHILDATTNDC = [];
                for (var i = 0; i < rows.length; i++) {
                    
                    // Already placed this student in the result
                    if (insertedStudents.includes(rows[i].individualID)) {
                        continue;
                    }


                    // Generating a list of all DATE elements
                    var DATE = [];
                    // An array of all data related to the current student
                    var currentStudent = [];
                    for (var j = 0; j < rows.length; j++) {
                        if (rows[j].individualID === rows[i].individualID) {
                            currentStudent.push(rows[j]);
                        }
                    }
                    // Going through each of the current student's CHILDATTNDC to generate DATE
                    for (var j = 0; j < currentStudent.length; j++) {
                        var dateOfCare = currentStudent[j].dateOfCare;
                        DATE.push(
                            {
                                DATEOFCARE: {'#text': (dateOfCare.getMonth() + 1) +
                                "/" + dateOfCare.getDate() +
                                "/" + dateOfCare.getFullYear()},
                                CAREUNIT: {'#text': currentStudent[j].attendance},
                                DAYORSLEEP: {'#text': currentStudent[j].dayOrNight}
                            });
                    }
                    
                    // Maybe move this down, but doesn't really matter
                    insertedStudents.push(rows[i].individualID);
                    
                    caseID = rows[i].caseID;
                    console.log("CASE ID: " + caseID);
                    // Generarting new entry
                    var newEntry = 
                        {
                            CASEID: {'#text': caseID},
                            INDIVIDUALID: {'#text': "'" + rows[i].individualID + "'"},
                            ATTDATES: {DATE}
                        };
                    
                    CHILDATTNDC.push(newEntry);
                }

                jsonXml = {
                    ATTNDCUPLD: {
                        '@xmlns:xsi': '"http://www.w3.org/2001/XMLSchema-instance"',
                        PROVIDER: {
                            '@ID': '311214083 SLID="4"',
                                CHILDATTNDC
                            }
                        }
                    };


                var xml = builder.create(jsonXml).end({ pretty: true});

                fs.writeFile('newFile.xml', xml, function(err) {
                if (err) {
                    throw err;
                    res.send("Error: " + err);
                }
                res.download(`${__dirname}/newFile.xml`);
                console.log('File successfuly created!');
                //res.end();
                });

                

                // var fileName = "newFile.xml";
                // var filePath = path.join('.', fileName);
                // var file = fs.readFile(filePath, 'utf8');
                // console.log(filePath);
                // res.download(filePath, file);
                // res.setHeader('Content-disposition', 'attachment; filename=newFile.xml');
                // res.contentType('Content-Type', 'text/xml');
                // res.download(__dirname + "/newFile.xml", "newFile.xml");
                //res.sendFile(path.join(__dirname, "/newFile.xml"));
                
                // res.write(file, 'utf8');
    }// End of else
    });// End of connect
})
