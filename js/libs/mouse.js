/*
	Libreria del mouse
	Version 0.1 por Nero	

	Se encarga del manejo de los valores del raton.
*/
var height, width;
var doc,cnvs;
var newX = 0;
var newY = 0;
var lastMouseX = 0;
var lastMouseY = 0;
var deltaX = 0;	
var deltaY = 0;
var mouseLeft = false,mouseRigt = false, mouseOut = false;

//Iniciamos nuestro componentes.
function initMouse(canvas,docP){
	if (canvas==undefined || docP==undefined)
		return;
	doc = docP;
	cnvs = canvas;
	canvas.onmousedown = handleMouseDown;
    doc.onmouseup = handleMouseDown;
    canvas.onmousemove = mouseMove;
    canvas.ondblclick = dbClick;

    height = canvas.height;
    width = canvas.width;

    //Le damos un valor inicial para que al momento de usarlo no tenga un valor muy alto.
	newX = width/2;
	newY = height/2;
}

function dbClick(event) {
	return;
}



/*
	Evento que se encarga de procesar los botones del raton oprimidos.

	1.- Click izquierdo
	2.-	Click derecho
	4.-	Boton del medio
*/
function handleMouseDown(event) {	
	var btn = event.buttons;
	
	mouseLeft = btn&1 == 1;	
	mouseRigt = btn&2 == 2;						
}

/*
	Evento que se activa cuando levantas un boton del raton.
	En este caso, solo desactivaremos el raton cuando el usuario le haya dado click
*/
function handleMouseUp(event) {
	console.log(event.buttons);
	switch(event.buttons){
		case 1:{
			mouseLeft = false;					
		}break;
		case 2:{
			if (mouseOut){
				mouseOut = false;
			}else{
				mouseRigt = false;		
			}
		}break;
	}	
}

function mouseMove(e){
	if(e.offsetX) {
        newX = e.offsetX;
        newY = e.offsetY;
    }
    else if(e.layerX) {
        newX = e.layerX;
        newY = e.layerY;
    }     
}

function getDeltaMouse(){
	deltaX = newX - lastMouseX;	
	deltaY = newY - lastMouseY;
	lastMouseX = newX
	lastMouseY = newY;
	return{
		deltaX,deltaY
	};
}

function getInfoMouse(){
	var dx = newX-(width / 2);	
	var dy = newY-(height / 2);
	dx/=(width/8);
	dy/=-(height/8);
	
	
	if (dy>0){
		dy*=dy;
		dy*=-1;
		dy = dy < -10 ? -15 : dy;
	}else {
		dy*=dy;
		dy = dy > 10 ? 15 : dy;
	}
	
	if (dx<0){
		dx*=dx;		
		dx*=-1;
		dx = dx < -10 ? -15 : dx;
	}else {
		dx*=dx;		
		dx = dx > 10 ? 15 : dx;
	}


	
	if (mouseLeft){		
		doc.body.style.cursor = 'crosshair';
	}
	else{
		doc.body.style.cursor = 'default';
	}

	return{
		dx,dy,mouseLeft,mouseRigt
	};
}
