function Whiteboard() {
     
    // Define accepted commands
    this.messageHandlers = {
        initCommands: this.initCommands.bind(this),
        drawBar:this.drawBar.bind(this),
        clear: this.clear.bind(this)
    };

    // Initial state
    this.lastPoint = null;
    this.mouseDown = false;
};

Whiteboard.prototype.connect = function() {
    var url = "ws://" + document.URL.substr(7).split('/')[0];
    
    var wsCtor = window['MozWebSocket'] ? MozWebSocket : WebSocket;
    this.socket = new wsCtor("ws://http://127.0.0.1:8080/", 'whiteboard-example');

    this.socket.onmessage = this.handleWebsocketMessage.bind(this);
    this.socket.onclose = this.handleWebsocketClose.bind(this);

    this.addCanvasEventListeners();
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

Whiteboard.prototype.drawBar = function(data) {
  
};

Whiteboard.prototype.clear = function() {

};

Whiteboard.prototype.handleMouseDown = function(event) {
    this.mouseDown = true;
	this.lastPoint = this.resolveMousePosition(event);
};

Whiteboard.prototype.handleMouseUp = function(event) {
    this.mouseDown = false;
    this.lastPoint = null;
};

Whiteboard.prototype.handleMouseMove = function(event) {
    if (!this.mouseDown) { return; }

    var currentPoint = this.resolveMousePosition(event);

    // Send a draw command to the server.
    // The actual line is drawn when the command
    // is received back from the server.
    this.socket.send(JSON.stringify({
        msg: 'drawLine',
        data: {
            points: [
                this.lastPoint.x,
                this.lastPoint.y,
                currentPoint.x,
                currentPoint.y
            ]
        }
    }));
    
    this.lastPoint = currentPoint;
};

Whiteboard.prototype.initCanvas = function(canvasId) {
    
};


Whiteboard.prototype.addCanvasEventListeners = function() {
     window.document.addEventListener(
        'mousedown', this.handleMouseDown.bind(this), false);
    
    window.document.addEventListener(
        'mouseup', this.handleMouseUp.bind(this), false);
        
     window.document.addEventListener(
        'mousemove', this.handleMouseMove.bind(this), false);
};

Whiteboard.prototype.resolveMousePosition = function(event) {
    var x, y;
	if (event.offsetX) {
		x = event.offsetX;
		y = event.offsetY;
	} else {
		x = event.layerX - this.offsetX;
		y = event.layerY - this.offsetY;
	}
	return { x: x, y: y };
};