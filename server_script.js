var express = require('express');
var app = express();
app.use(express.static("./static"));
app.listen(8080,function(){
    console.log("starting server...");
});

app.get("/hello", function(req,res) {
    console.log("GET /hello");
    res.status(200).json({ response: "Hello world!"  });
});