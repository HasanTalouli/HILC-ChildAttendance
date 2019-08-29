// This is the code that generates the xml files

var fs = require('fs');

var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'hilcdaycare.com',
	user: 'HasanTalouli',
	password: 'hasantalouli',
	database: 'CS275Daycare'
});

// Connecting to database
con.connect(function(err) {
	if (err) {
		console.log("Error connecting to database: " + err.message);
	}
	else {
		console.log("Successfully connected to database");
	}
});


fs.writeFile('newFile.xml', 'This is an XML File!!', function(err) {
	if (err) {throw err;}
	console.log('File successfuly created!');
})