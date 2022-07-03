
//Funcion para anidar los eventos del teclado al document.
function initKeyBoard (doc){
	doc.onkeydown = handleKeyDown;
    doc.onkeyup = handleKeyUp;   
}

//Arreglo que tendra los valores de las teclas oprimidas.
var keys = [];

/*
	Manejador para activar la tecla que se haya oprimido.
	Esta funcion solo se activa cuando se oprime una tecla, el valor de event.key será
	el string de la tecla.

	Ejemplo: Si presionas A, event.key tendra el valor de 'a'
*/
function handleKeyDown(event) {
	keys[event.key] = true; 	
}

//Evento para poner en false la tecla que hayas presionado.
function handleKeyUp(event) {
	keys[event.key] = false;
}
