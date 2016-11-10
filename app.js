var express = require('express');
var data = require('./data.js');
//var vega =require('vega');
var WebSocketServer = require('websocket').server;

var app = express();
  app.use(express.static(__dirname + "/public"));
 app.set('views', __dirname);
    app.set('view engine', 'html');

app.get('/', function(req, res) {
    res.render('index', { layout: false });
});
app.get('/data', function(req, res) {
    res.send(data);
});
app.listen(8080);

var wsServer = new WebSocketServer({
    httpServer: app,
    fragmentOutgoingMessages: false
});

var connections = [];
var canvasCommands = [];

wsServer.on('request', function(request) {
    var connection = request.accept('whiteboard-example', request.origin);
    connections.push(connection);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);
    
    // Send all the existing canvas commands to the new client
    connection.sendUTF(JSON.stringify({
        msg: "initCommands",
        data: canvasCommands
    }));
    
    // Handle closed connections
    connection.on('close', function() {
        console.log(connection.remoteAddress + " disconnected");
        
        var index = connections.indexOf(connection);
        if (index !== -1) {
            // remove the connection from the pool
            connections.splice(index, 1);
        }
    });
    
    // Handle incoming messages
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                var command = JSON.parse(message.utf8Data);

                if (command.msg === 'clear') {
                    canvasCommands = [];
                }
                else {
                    canvasCommands.push(command);
                }

                // rebroadcast command to all clients
                connections.forEach(function(destination) {
                    destination.sendUTF(message.utf8Data);
                });
            }
            catch(e) {
                // do nothing if there's an error.
            }
        }
    });
});

console.log("Whiteboard test app ready");
