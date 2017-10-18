function clear(){
	c.clearRect(0,0,width,height);
}

function resetCanvas(){
	clear();drawGrid();drawEntities();
}

function drawWire( ent ){
	c.beginPath();
	c.moveTo( ent.a, ent.b );
	c.lineTo( ent.x, ent.y );
	c.strokeStyle = 'rgb(0,0,0)';
	c.stroke();
}

// Returns x value of the mouse with respect to the canvas.
function eventX( event ){
	var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // IE.
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
    }

    var rekt = canvas.getBoundingClientRect();

    x = event.pageX - rekt.left;

    return event.pageX - rekt.left; 
}

// Returns y value of the mouse with respect to the canvas.
function eventY( event ){
	var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // IE.
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    // Use event.pageX / event.pageY here

    var rekt = canvas.getBoundingClientRect();
    return event.pageY - rekt.top;
}

// Man vector math is fun.
function distanceToLine( i, x, y ){
	function pd(a,b,c,d){return pointDistance(a,b,c,d);}

	var w = wires[i];

	var x1 = w.a, y1 = w.b, x2 = w.x, y2 = w.y;

	d1 = pd(x1, y1, x, y);
	d2 = pd(x2, y2, x, y);


	// If either of the internal if's fire, then it's closer to the points at the end of the line.
	if( d1 < d2 ){
		if( (x-x1) * (x2 - x1) + (y - y1) * (y2 - y1) < 0 ){
			return d1;
		}
	}else{
		if( (x-x2) * (x1 - x2) + (y - y2) * (y1 - y2) < 0 ){
			return d2;
		}
	}

	d = pd( x1, y1, x2, y2 );

	return m.abs( (y2 - y1)*x - (x2 - x1)*y + x2*y1 - y2*x1 ) / d;

	// Is within the perpendicular range.
}

function pointDistance( x1, y1, x2, y2 ){
	return m.sqrt( m.pow(x2 - x1, 2) + m.pow(y2-y1, 2) );
}