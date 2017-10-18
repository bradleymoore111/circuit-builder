var canvas,c,io;
var width, height;
var margin_x = 40;
var margin_y = 40;

var wires = []; // Possible TODO: make an array for every single type of entity.

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

		// draw entities on the wire.
		var length = wires[i].entities.length;

		// TODO: if length is greater than the number of elements that could fit on it (kinda long math to do).
		for(var j=0;j<length;j++){
			var ent = wires[i].entities[j];

			// figure out position.
			var vector = m.VtoMA( wires[i].x - wires[i].a, wires[i].y - wires[i].b );

			vector.mag = vector.mag * (j + 1) / ( length + 1 );
			var angle = vector.angle;

			var vector = m.VtoXY( vector.mag, vector.angle ); // new x y location from (a,b) of the line.

			var x = vector.x + wires[i].a;
			var y = vector.y + wires[i].b;

			c.translate( x, y );
			c.rotate( angle * m.pi / 180 );

			c.beginPath();
			c.rect( -10, -10, 20, 20 );
			c.fill();

			c.rotate( -angle * m.pi / 100 );
			c.setTransform(1, 0, 0, 1, 0, 0);

			// console.log( 'drawing ' + (vector.x + wires[i].a) + ',' + (vector.y + wires[i].b) );
			// drawCircle( vector.x + wires[i].a, vector.y + wires[i].b, 5, 'rgb(0,0,255)' );

			// check temporary at the end.
			if( ent.temp ){
				wires[i].entities.splice( j, 1 );
			}
		}
	}
}