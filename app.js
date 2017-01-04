var express = require('express');
var http = require('http');
var webSocketConnect = require('./websocket.js');
var WebSocketServer = require('websocket').server;


var data = require('./data');

var server = http.createServer(function(request, response) {
    //console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8002, function() {
    console.log((new Date()) + ' Web Socket ready on 8002');
});

var app = express();
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname);
app.set('view engine', 'html');

app.get('/', function(req, res) {
    res.render('index', { layout: false });
});
/*
CONFIG
----------
data.area => plots area chart data
data.bar => plots area chart data
data.force => plots area chart data (need to fix)
*/
app.get('/data', function(req, res) {
    res.send(data.bar);
});
app.listen(8081);

var wsServer = new WebSocketServer({
    httpServer: server,
    fragmentOutgoingMessages: false
});

wsServer.on('request',webSocketConnect);

console.log("Whiteboard test app ready on port 8081");
