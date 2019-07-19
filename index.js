const http = require('http');
var express = require('express');
var app = express();
var path = require('path');

// Create server object
app.use(express.static(__dirname));

app.listen(5000, () => { console.log("Server running") });



