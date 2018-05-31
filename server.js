var express = require('express');
var app = express();
var path = require('path');

app.set('port', (process.env.PORT || 5000));

// public is directory for all static files
app.use(express.static(__dirname + '/public'));
app.use(express.static("."));


app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname + '/index.html'));
})

// listen on the port specified ('set') earlier in the file
app.listen(app.get('port'));
