var canvas,c,io;
var width, height;
var margin_x = 40;
var margin_y = 40;

var entities = [],wires = []; // Possible TODO: make an array for every single type of entity.

function init(){
	canvas = document.getElementById("main-canvas");
	io = document.getElementById("io-panel");

	c = canvas.getContext("2d");

	drawGrid();

	// Initialize io box.
	initIOPanel();
}

function drawGrid(){
	// Initialize gridlines.
	c.beginPath();
	c.strokeStyle = 'rgba(0,0,0,0.25)';

	width = canvas.width;
	height = canvas.height;

	// Vertical lines.
	var times = width/margin_x;
	for(var i=0;i<times;i++){
		c.moveTo(i*margin_x, 0);
		c.lineTo(i*margin_x, height);
	}

	// Horizontal lines.
		times = height/margin_y;
	for(var i=0;i<times;i++){
		c.moveTo(0,i*margin_y);
		c.lineTo(width,i*margin_y);
	}

	c.stroke();
}


function drawEntities(){
	for(var i=0;i<wires.length;i++){
		drawWire( wires[i] );
	}
}