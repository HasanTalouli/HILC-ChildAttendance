// This is the code that generates the xml files

var fs = require('fs');
var builder = require('xmlbuilder');

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

var jsonXml = {
	ATTNDCUPLD: {
		'@xmlns:xsi': '"http://www.w3.org/2001/XMLSchema-instance"',
		PROVIDER: {
			'@ID': '311214083 SLID="4"',
			CHILDATTNDC: {
				CASEID: {'#text': '123456789'},
				INDIVIDUALID: {'#text': '987654321'},
				ATTDATES: {
					'#text': 'more stuff...'
				}
			}
		}
	}
};

var xml = builder.create(jsonXml).end({ pretty: true});

// The final xml file
// var xml = builder.create('ATTNDCUPLD', {'xmlns:xsi': '"http://www.w3.org/2001/XMLSchema-instance"'})
// 	.ele('CHILDATTNDC')
// 		.ele('CASEID', '123456789')
// 		.ele('INDIVIDUALID', '987654321')
// 			.ele('ATTDATES')
// 	.end({pretty: true});
// var xml = builder.create('ATTNDCUPLD xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance').end({pretty: true});

fs.writeFile('newFile.xml', xml, function(err) {
	if (err) {throw err;}
	console.log('File successfuly created!');
})