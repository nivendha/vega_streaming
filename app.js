var express = require('express');
var http = require('http');
var webSocketConnect = require('./websocket.js');
var WebSocketServer = require('websocket').server;


var ws = require("nodejs-websocket")
var data = require('./data');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

var app = express();
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname);
app.set('view engine', 'html');

app.get('/', function(req, res) {
    res.render('index', { layout: false });
});
app.get('/data', function(req, res) {
    res.send(data.bar);
});
app.listen(8081);

var wsServer = new WebSocketServer({
    httpServer: server,
    fragmentOutgoingMessages: false
});

wsServer.on('request',webSocketConnect);

console.log("Whiteboard test app ready");
