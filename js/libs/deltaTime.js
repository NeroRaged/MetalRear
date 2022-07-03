/*
	Plantilla 1.0 de webgl creada por Nero.

	Nos ayuda a obtener los datos relacionados al tiempo.
*/

//Variable que tendra la diferencia de tiempo expresada en milisegundos.
var deltaTime = 0;
//Variable que tendra el ultimo tiempo transcurrido.
var lastUpdate = 0;
//Variable que nos ayudará a determinar si ha pasado un segundo o no.
var totalTime = 0;

var halfSecond = 0;

var torRearSecond = 0;

var rearDesc = 0;

var rearCannon = 0;

var finalDes =0;


//Funcion que nos actualiza el deltaTime.
//Recide como parametro el tiempo actual.
function updateDeltaTime(time){
	//Lo convertimos a milisegundos.
	time *=.001;
	//Obtenemos la diferencia de tiempo.
	deltaTime = time - lastUpdate;
	//Actualizamos el ultimo tiempo transcurrido.
	lastUpdate = time;
	//Sumamos totalTime el valor de deltaTime, cuando sea mayor a uno, significa que ya paso un segundo.
	totalTime+=deltaTime;
	halfSecond+=deltaTime;
	torRearSecond+=deltaTime;
	rearDesc+=deltaTime;
	rearCannon+=deltaTime;
	finalDes+=deltaTime;
	//En caso de querer usar deltaTime, retorna su valor.
	return deltaTime;
}

function getDeltaTime(){
	return deltaTime;
}

//Verifica si ha pasado un segundo.
function isOneSecondPass(){	
	if (totalTime>1){
		//Restamos 1 para no borrar los milisegundos sobrantes.
		totalTime-=1;
		return true;	
	}
	return false;
}

function isHalfSecondPass(){	
	if (halfSecond>.05){
		halfSecond=0;
		return true;	
	}
	return false;
}

function isTorRearSecondPass(){	
	if (torRearSecond>.05){
		torRearSecond=0;
		return true;	
	}
	return false;
}

function isRearDescPass(){	
	if (rearDesc>5){
		rearDesc=0;
		return true;	
	}
	return false;
}

function isRearCannonPass(){	
	if (rearCannon>.75){
		rearCannon=0;
		return true;	
	}
	return false;
}

function finalDesPass(){	
	if (finalDes>5){
		finalDes=0;
		return true;	
	}
	return false;
}

//Obtenemos los frames por segundo.
function getFPS(){
	/*
		1/deltaTime		Dividimos 1 entre el deltaTime transcurrido para ver cuantas veces cabe deltaTime en un segundo.
		
		Math.round(resultado * 100) / 100;	Redondeamos el resultado a dos decimas.
	*/
	return Math.round(1/deltaTime * 100) / 100;
}
