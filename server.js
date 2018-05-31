var express = require('express');
var app = express();
var path = require('path');

const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 5000");
});

// public is directory for all static files
app.use(express.static(__dirname + '/public'));
app.use(express.static("."));


app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname + '/index.html'));
})