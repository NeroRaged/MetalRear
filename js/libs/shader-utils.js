/*
	Plantilla 1.0 de webgl creada por Nero.

	Nos ayuda al manejo del shaderProgram
*/
var shaderProgram;


function initShaders(shader_vs,shader_fs){
	try{
		//Ya obtenidos los valores, obtendremos el shader de cada uno.
		var vertexShader = getShader(shader_vs);
		var fragmentShader = getShader(shader_fs);

		//Iniciamos nuesto shaderProgram
		shaderProgram = gl.createProgram();
		//Añadimos nuestros shaders
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);		
		gl.linkProgram(shaderProgram);
		
		//Verifiacmos que se hayan cargado correctamente.
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert("No se pudo cargar los shaders");
			return false;
		}
		//Si todo salio bien, asignamos nuestro shaderProgram al ambiente de WebGl
		//Si queremos usar otro programa, podemos usar esta linea para cambiar de programa.
		gl.useProgram(shaderProgram);

		/*
			Como ya se cargaron los shaders y necesitamos saber la locacion de cada variable,
			asignamos variables que tendran los indices de cada variable de nuestros shaders.
		*/
		shaderProgram.uNormalMap= 			gl.getUniformLocation(shaderProgram, "uNormalMap");
		shaderProgram.aTangent = 			gl.getAttribLocation(shaderProgram, "aTangent");
		shaderProgram.aBiTangent= 			gl.getAttribLocation(shaderProgram, "aBiTangent");
		
		
		shaderProgram.aVertexPosition =		gl.getAttribLocation(shaderProgram, "aVertexPosition");			
		shaderProgram.pMatrixUniform =		gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = 	gl.getUniformLocation(shaderProgram, "uMVMatrix");
		shaderProgram.aVertexColor = 		gl.getAttribLocation(shaderProgram, "aVertexColor");
		shaderProgram.uTexture = 			gl.getUniformLocation(shaderProgram, "uTexture");
		shaderProgram.aTexcoord = 			gl.getAttribLocation(shaderProgram, "aTexcoord");
		shaderProgram.aVertexNormal= 		gl.getAttribLocation(shaderProgram, "aVertexNormal");
		shaderProgram.uUseLighting = 		gl.getUniformLocation(shaderProgram, "uUseLighting");
		shaderProgram.uAmbientColor = 		gl.getUniformLocation(shaderProgram, "uAmbientColor");
		shaderProgram.uLightingDirection= 	gl.getUniformLocation(shaderProgram, "uLightingDirection");
		shaderProgram.uDirectionalColor= 	gl.getUniformLocation(shaderProgram, "uDirectionalColor");
		shaderProgram.uNMatrix= 			gl.getUniformLocation(shaderProgram, "uNMatrix");


		return true;
	}catch(e){
		alert("Failed load shaders.");
		return false;
	}
}

//Obtenemos nuestro shaders
function getShader(shaderScript) {
	if (!shaderScript) {
	    return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
	    if (k.nodeType == 3) {
	        str += k.textContent;
	    }
	    k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
	    shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
	    shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
	    return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    alert(this.gl.getShaderInfoLog(shader));
	    return null;
	}

	return shader;
}