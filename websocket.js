var connections = [];
var canvasCommands = [];

module.exports=function(request){
    var connection = request.accept('whiteboard-example', request.origin);
    connections.push(connection);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);
    
    // Handle closed connections
    connection.on('close', function() {
        console.log(connection.remoteAddress + " disconnected");
        
        var index = connections.indexOf(connection);
        if (index !== -1) {
            // remove the connection from the pool
            connections.splice(index, 1);
        }
    });
    
    setInterval(function(){
         connections.forEach(function(destination) {
                    destination.sendUTF(JSON.stringify({
                        y:Math.ceil(Math.random()*1000),
                        x:Math.ceil(Math.random()*20)
                    }));
        });
    },500);

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
               
            }
            catch(e) {
                // do nothing if there's an error.
            }
        }
    });
}