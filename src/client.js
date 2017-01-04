function Whiteboard() {
     
    // Define accepted commands
    this.messageHandlers = {
        initCommands: this.initCommands.bind(this),
        clear: this.clear.bind(this)
    };

    // Initial state
    this.lastPoint = null;
    this.mouseDown = false;
};
Whiteboard.prototype.setMouseHandler= function(fn){
this.messageHandlers['mouse']=fn.bind(this);
}
Whiteboard.prototype.connect = function() {
    var url = "ws://" + document.URL.substr(7).split('/')[0];
    
    var wsCtor = window['MozWebSocket'] ? MozWebSocket : WebSocket;
    this.socket = new wsCtor("ws://127.0.0.1:8002/", 'whiteboard-example');

    this.socket.onmessage = this.handleWebsocketMessage.bind(this);
    this.socket.onclose = this.handleWebsocketClose.bind(this);
};

Whiteboard.prototype.handleWebsocketMessage = function(message) {
    try {
        var command = JSON.parse(message.data);
    }
    catch(e) { /* do nothing */ }
    
    if (command) {
        this.dispatchCommand(command);
    }
};

Whiteboard.prototype.handleWebsocketClose = function() {
    alert("WebSocket Connection Closed.");
};

Whiteboard.prototype.dispatchCommand = function(command) {
    // Do we have a handler function for this command?
    var handler = this.messageHandlers[command.msg];
    if (typeof(handler) === 'function') {
        // If so, call it and pass the parameter data
        handler.call(this, command.data);
    }
};

Whiteboard.prototype.initCommands = function(commandList) {
    /* Upon connection, the contents of the whiteboard
       are drawn by replaying all commands since the
       last time it was cleared */
    commandList.forEach(function(command) {
        this.dispatchCommand(command);
    }.bind(this));
};

Whiteboard.prototype.sendClear = function() {
    this.socket.send(JSON.stringify({ msg: 'clear' }));
};

Whiteboard.prototype.clear = function() {

};