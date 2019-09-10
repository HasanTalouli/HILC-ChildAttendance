// This is the code that generates the xml files
var fs = require('fs');
var builder = require('xmlbuilder');

var mysql = require('mysql');
var config = fs.readFileSync('./config.json');

var con = mysql.createConnection(JSON.parse(config));

// Connecting to database
con.connect(function(err) {
	if (err) {
		console.log("Error connecting to database: " + err.message);
	}
	else {
		console.log("Successfully connected to database");
	}
});


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
					if (err) {throw err;}
					console.log('File successfuly created!');
				});
}// End of else
});// End of connect