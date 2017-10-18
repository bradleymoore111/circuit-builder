var elements = [
	{
		id: 'wire',
		text: 'Wire',
		img: '',
	},
	{
		id: 'resistor',
		text: 'Resistor',
		img: ''
	},
	{
		id: 'voltSource',
		text: 'Voltage Source',
		img: ''
	},
	{
		id: 'voltMeter',
		text: 'Voltmeter',
		img: ''
	}
];

var wireX = 0;
var wireY = 0;

// Figure out pagination.
function initIOPanel(){
	var s = "<table><thead><tr><th>Item</th><th>Image</th></tr></thead><tbody>";

	for(var i=0;i<elements.length;i++){
		s += "<tr><td><input type='button' onClick='addEntity(\"" + elements[i].id + "\")' value='" + elements[i].text + "'></td><td><img src='" + elements[i].img + "'></td></tr>"; // TODO: size image.
	}

	s += "</tbody></table>";

	io.innerHTML = s;
}

function addEntity( element ){
    if( element != "wire" ){
        // Check for number wires.
        var ok = false;
        for( var i=0;i<entities.length;i++){
            if( entities[i].type == "wire" ){
                ok = true;
                break;
            }
        }

        if( ! ok ){ // How to make readable code.
            return alert( 'You must have a wire to attach an element to.' );
        }
    }

    if( element == "wire" ){
        document.onmousemove = function(event){

            x = eventX( event );
            y = eventY( event );

            // Confirm mouse over is in element, otherwise don't care.
            if( x < 0 || x > width || y < 0 || y > height ){
                return;
            }

            resetCanvas();

            // Find nearest point.
            x += margin_x / 2;
            y += margin_y / 2;
            x = ( x / margin_x | 0 ) * margin_x;
            y = ( y / margin_y | 0 ) * margin_y;

            c.beginPath();
            c.strokeStyle = 'rgba(0,0,0,0.8)';
            c.arc(x,y,3,0,2*Math.PI);
            c.fillStyle = 'rgba(0,0,0,0.8)';
            c.fill();
            c.stroke();
        }

        // Click listeners.
        document.onmousedown = function(event){

            // If x not in range, cancel the item creation.
            
            wireX = ((eventX( event ) + margin_x / 2) / margin_x | 0 ) * margin_x;
            wireY = ((eventY( event ) + margin_y / 2) / margin_y | 0 ) * margin_y;

            // Place dot, and create a line tracker.
            document.onmousemove = function( event ){
                var x = eventX( event );
                var y = eventY( event );

                x += margin_x / 2;
                y += margin_y / 2;
                x = ( x / margin_x | 0 ) * margin_x;
                y = ( y / margin_y | 0 ) * margin_y;

                resetCanvas();

                c.beginPath();

                c.strokeStyle = 'rgba(255,0,0,0.8)';
                c.fillStyle = 'rgba(255,0,0,0.8)';
                c.arc( wireX, wireY, 3, 0, 2*Math.PI );
                c.arc( x, y, 3, 0, 2*Math.PI );
                c.fill();

                c.closePath();
                c.beginPath();

                c.moveTo( wireX, wireY );
                c.lineTo( x, y );

                c.stroke();

                c.closePath();

            }
        };

        document.onmouseup = function( event ){
            var x = eventX( event );
            var y = eventY( event );

            x += margin_x / 2;
            y += margin_y / 2;
            x = ( x / margin_x | 0 ) * margin_x;
            y = ( y / margin_y | 0 ) * margin_y;

            // If x = wirex and y = wirey, then he just did a click. Don't clear.
            if( x == wireX && y == wireY ){
                document.onmousedown = null;
                return;
            }

            document.onmousedown = null;
            document.onmousemove = null;

            wires[wires.length] = {
                a: wireX,
                b: wireY,
                x: x,
                y: y,
                entities: [],
            };

            document.onmouseup = null;

            resetCanvas();
        }
    }

	else if( element == "resistor" ){
        // Make resistor hover normally if within bounds, snap to wires and space properly (ie, order might matter).

        document.onmousemove = function(event){

            x = eventX( event );
            y = eventY( event );

            // Confirm mouse over is in element, otherwise don't care.
            if( x < 0 || x > width || y < 0 || y > height ){
                return;
            }

            // Check for nearby wires.
            // Oh boy.

            // Don't map mouse to nearest grid line.
            // Since max value should be at most the diagonal cross section of the canvas.
            var shortest = m.sqrt( m.pow( width, 2 ) + m.pow( height, 2 ) ) + 1; 
            var loc = -1;

            for(var i=0;i<wires.length;i++){
                var d = distanceToLine( i, x, y );

                if( d < shortest ){
                    shortest = d;
                    loc = i;
                }
            }

            if( shortest > 40 || loc == -1 ){
                return resetCanvas();
            }

            // Imagine adding it temporarily.
            wires[loc].entities[wires[loc].entities.length] = {
                temp:true,
                type:'resistor' // any other info? value maybe?
            }

        
            // Generate the resistor on top of the line.


        }
    }
}