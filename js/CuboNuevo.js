/*
	Plantilla 1.0 de webgl creada por Nero.

	Modelo de la clase cuboNuevo
*/
var cuboNuevo = function (){
	
	//Declaramos nuestor vertices.
	var vertices = [
    	// Front face
      	-3.0, -3.0,  3.0,
       	3.0, -3.0,  3.0,
       	3.0,  3.0,  3.0,
      	-3.0,  3.0,  3.0,

      	// Back face
      	-3.0, -3.0, -3.0,
      	-3.0,  3.0, -3.0,
       	3.0,  3.0, -3.0,
       	3.0, -3.0, -3.0,

      	// Top face
      	-3.0,  3.0, -3.0,
      	-3.0,  3.0,  3.0,
       	3.0,  3.0,  3.0,
       	3.0,  3.0, -3.0,

      	// Bottom face
      	-3.0, -3.0, -3.0,
       	3.0, -3.0, -3.0,
       	3.0, -3.0,  3.0,
      	-3.0, -3.0,  3.0,

      	// Right face
       	3.0, -3.0, -3.0,
       	3.0,  3.0, -3.0,
       	3.0,  3.0,  3.0,
       	3.0, -3.0,  3.0,

      	// Left face
      	-3.0, -3.0, -3.0,
      	-3.0, -3.0,  3.0,
      	-3.0,  3.0,  3.0,
      	-3.0,  3.0, -3.0
    ];

	//Declaramos nuestros indices.
	//En este caso usamos mas debido a que ahora usamos los colores.
	var indices = [ 
		0,  1,  2,      0,  2,  3,    // front
    	4,  5,  6,      4,  6,  7,    // back
    	8,  9,  10,     8,  10, 11,   // top
    	12, 13, 14,     12, 14, 15,   // bottom
    	16, 17, 18,     16, 18, 19,   // right
    	20, 21, 22,     20, 22, 23,   // left
	];

	//Declaramos nuestros colores.
	var colores = [];

	for (var i = 0;i<24;i++){
		colores[(i*4)+0]=1;
		colores[(i*4)+1]=1;
		colores[(i*4)+2]=1;
		colores[(i*4)+3]=1.0;				
	}

	//Iniciamos nuestro buffer de posicion.
	this.vPosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vPosBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vPosBuffer.itemSize = 3;
	this.vPosBuffer.numItems = vertices.length / 3;

	//Iniciamos nuestro buffer de colores.
	this.updateBufferColor(colores);

	// Se crea el buffer de indices
	this.indexBuffer = gl.createBuffer();
	//Solo trabaja con indices
	//-->gl.ELEMENT_ARRAY_BUFFER<--
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	this.indexBuffer.itemSize = 1;
	this.indexBuffer.numItems = indices.length;

	this.isTextureActive = false;
	this.texture;
	this.isTextureNormalActive = false;
	this.textureNormal;

	this.initTexture("me.jpg");

	this.initNormalBuffers();

	this.initTextureNormal("meNormal.jpg");

	this.tangent = [];
	this.biTangent = [];
	this.initTangentBinormal(indices,vertices);

	//this.initNormalTexture("me.jpg");
	//this.initNormalTextureBuffers();


	this.posx=0;
	this.posy=0;
	this.posz=-7;
	this.scalex=1;
	this.scaley=1;
	this.scalez=1;
	this.rotx=0;
	this.roty=0;
	this.rotz=0;

	//Variable de direccion de nuestro cubo
	this.dirx = 1;

	
};

cuboNuevo.prototype = {
	drawPoly: function(pMatrix,lightingDirection){
		return;

		gl.useProgram(shaderProgram);
    
		// Se crean nuestras matrices
		var mvMatrix = mat4.create();

		// Se limpia la matriz de transformaciones
		mat4.identity(mvMatrix);
			
		// Se aplica translacion sobre la matriz de transformaciones
		mat4.translate(mvMatrix, mvMatrix, [this.posx, this.posy, this.posz]);
		mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotx); /* en radianes */
		mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * this.roty ); /* en 	radianes */
		mat4.rotateZ(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotz); /* en radianes */
		mat4.scale(mvMatrix, mvMatrix, [this.scalex, this.scaley, this.scalez]);
		
		//Asignamos al shader nuestros valores de las matrices
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		
		// Se "activa" el buffer de color		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vColorBuffer);	
		gl.vertexAttribPointer(shaderProgram.aVertexColor, this.vColorBuffer.itemSize	, gl.FLOAT, false, 0, 0);		
		gl.enableVertexAttribArray(shaderProgram.aVertexColor);
		
		// Se "activa" el buffer de vertices
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vPosBuffer);
		gl.vertexAttribPointer(shaderProgram.aVertexPosition, this.vPosBuffer.itemSize	, gl.FLOAT, false, 0, 0);		
		gl.enableVertexAttribArray(shaderProgram.aVertexPosition);									
											
		if (this.isTextureActive){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    		gl.vertexAttribPointer(shaderProgram.aTexcoord, this.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(shaderProgram.aTexcoord);								

			gl.activeTexture(gl.TEXTURE30);
    		gl.bindTexture(gl.TEXTURE_2D, this.texture);
    		gl.uniform1i(shaderProgram.uTexture, 30);


    		gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
	    	gl.vertexAttribPointer(shaderProgram.aVertexNormal, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	    	gl.enableVertexAttribArray(shaderProgram.aVertexNormal);

	    	//////////////
	    	var lighting = true;
    		gl.uniform1i(shaderProgram.uUseLighting, lighting);
    		if (lighting) {
      			gl.uniform3f(shaderProgram.uAmbientColor, .5, .5, .5);
      			
      			var adjustedLD = vec3.create();
      			vec3.normalize(adjustedLD,lightingDirection);      			
      			gl.uniform3fv(shaderProgram.uLightingDirection, adjustedLD);
      			gl.uniform3f(shaderProgram.uDirectionalColor, 1, 1, 1);
    		}

		    var normalMatrix = mat4.create();
    		
    		mat4.invert(normalMatrix,mvMatrix);
    		mat4.transpose(normalMatrix,mvMatrix);
    		gl.uniformMatrix4fv(shaderProgram.uNMatrix, false, normalMatrix);
	    	/////////////
		}


		if (false){//this.isTextureNormalActive){
			gl.activeTexture(gl.TEXTURE29);
    		gl.bindTexture(gl.TEXTURE_2D, this.textureNormal);
    		gl.uniform1i(shaderProgram.uNormalMap, 29);

    		gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
	    	gl.vertexAttribPointer(shaderProgram.aTangent, this.tangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
	    	gl.enableVertexAttribArray(shaderProgram.aTangent);
	    
	    	gl.bindBuffer(gl.ARRAY_BUFFER, this.biTangentBuffer);
	    	gl.vertexAttribPointer(shaderProgram.aBiTangent, this.biTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
	    	gl.enableVertexAttribArray(shaderProgram.aBiTangent);
	    		
		}
		
		// Se "activa" el buffer de indices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	
		// Se "dibuja" en base a los indices.
		gl.drawElements(gl.TRIANGLES, 
			this.indexBuffer.numItems,
			gl.UNSIGNED_SHORT,
			0);
				
	
		// Se "desactiva" el "envio" de las variables atributo como arreglo 
		gl.disableVertexAttribArray(shaderProgram.aTexcoord);
		gl.disableVertexAttribArray(shaderProgram.aVertexPosition);
		gl.disableVertexAttribArray(shaderProgram.aVertexColor);
		gl.disableVertexAttribArray(shaderProgram.aVertexNormal);				
		//gl.disableVertexAttribArray(shaderProgram.aTangent);
		//gl.disableVertexAttribArray(shaderProgram.aBiTangent);
		
	},
	
	setPos: function(x, y, z){
		this.posx=x;
		this.posy=y;
		this.posz=z;
	},
	setRot: function(x, y, z){
		this.rotx=x;
		this.roty=y;
		this.rotz=z;
	},
	setScale: function(x, y, z){
		this.scalex=x;
		this.scaley=y;
		this.scalez=z;
	},
	getPos: function(){
		var x = this.posx;
		var y = this.posy;
		var z = this.posz;
		return{x,y,z};
	},
	getRot: function(){		
		var x = this.rotx;
		var y = this.roty;
		var z = this.rotz;
		return{x,y,z};
	},
	getScale: function(){		
		var x = this.scalex;
		var y = this.scaley;
		var z = this.scalez;
		return{x,y,z};
	},
	rotateInY:function(dt){
		this.roty+=20*dt;
		//Como son grados, solo reinicio el valor de nuestra variable.
		if (this.roty>=360){
			this.roty=0;
		}				
		this.rotx+=20*dt;
		if (this.rotx>=360){
			this.rotx=0;
		}	
	},
	rotateInX:function(dt){
		this.rotx+=20*dt;
		if (this.rotx>=360){
			this.rotx=0;
		}	

	},			
	moveX:function(dt){
		this.posx+=300*dt;	
	},
	moveAlone:function(dt){

		//Si el cubo llega a un valor mayor a 2, negara la direccion, por la cuel estamos moviendo el cubo.		
		if (this.posx>2){
			this.dirx=-1;			
		}
		//Caso contrario a que si el cubo llega a -2, daremos el valor de direccion positivo.
		else if (this.posx<-2){
			this.dirx=1;
		}
		//Por que 2? Por que es el valor que asigne al cubo y este llega a la "orilla" de nuestra pantalla.

		this.posx+=3*this.dirx*dt;				
		this.posz+=3*this.dirx*dt;			
	},
	
	//Actualizamos nuestro buffer de colores
	updateBufferColor:function(colores){
		this.vColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colores), gl.STATIC_DRAW);
		this.vColorBuffer.itemSize = 4;
		this.vColorBuffer.numItems = colores.length / 4;
	},
	updateColor:function(r,g,b){
		var colores = [];

		for (var i = 0;i<24;i++){
			colores.push(r,g,b,1.0);				
		}

		this.updateBufferColor(colores);
	},
	initTexture: function(path) {
		this.initTextureBuffers();
    	this.texture = gl.createTexture();
    	this.texture.image = new Image();

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
    	
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(255,255,255));
   

    	this.texture.image.onload = () => {
      		this.handleLoadedTexture(this.texture)
    	};

    	this.texture.image.src = path;
	},
	handleLoadedTexture:function(texture) {
    	gl.bindTexture(gl.TEXTURE_2D, texture);
    	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	gl.bindTexture(gl.TEXTURE_2D, null);
    	this.isTextureActive = true;
  	},
  	initTextureBuffers:function(){
  		
  		this.cubeVertexTextureCoordBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);	    
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getTextureCoords()), gl.STATIC_DRAW);
    	this.cubeVertexTextureCoordBuffer.itemSize = 2;
    	this.cubeVertexTextureCoordBuffer.numItems = 24;
  	},
  	
  	initNormalBuffers:function(){
  		this.cubeVertexNormalBuffer = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    	var vertexNormals = [
      		// Front face
       		0.0,  0.0,  1.0,
       		0.0,  0.0,  1.0,
       		0.0,  0.0,  1.0,
       		0.0,  0.0,  1.0,

		      // Back face
       		0.0,  0.0, -1.0,
       		0.0,  0.0, -1.0,
       		0.0,  0.0, -1.0,
       		0.0,  0.0, -1.0,

      		// Top face
       		0.0,  1.0,  0.0,
       		0.0,  1.0,  0.0,
       		0.0,  1.0,  0.0,
       		0.0,  1.0,  0.0,

      		// Bottom face
       		0.0, -1.0,  0.0,
       		0.0, -1.0,  0.0,
       		0.0, -1.0,  0.0,
       		0.0, -1.0,  0.0,

      		// Right face
       		1.0,  0.0,  0.0,
       		1.0,  0.0,  0.0,
       		1.0,  0.0,  0.0,
       		1.0,  0.0,  0.0,

      		// Left face
      		-1.0,  0.0,  0.0,
     		-1.0,  0.0,  0.0,
      		-1.0,  0.0,  0.0,
      		-1.0,  0.0,  0.0
    	];
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    	this.cubeVertexNormalBuffer.itemSize = 3;
    	this.cubeVertexNormalBuffer.numItems = 24;
  	},

  	initTextureNormal: function(path) {
		this.textureNormal = gl.createTexture();
    	this.textureNormal.image = new Image();

		gl.bindTexture(gl.TEXTURE_2D, this.textureNormal);
    	
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(255,255,255));
   

    	this.textureNormal.image.onload = () => {
      		this.handleLoadedTextureNormal(this.textureNormal)
    	};

    	this.textureNormal.image.src = path;
	},
	handleLoadedTextureNormal:function(textureNormal) {
    	gl.bindTexture(gl.TEXTURE_2D, textureNormal);
    	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureNormal.image);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    	gl.bindTexture(gl.TEXTURE_2D, null);
    	this.isTextureNormalActive = true;
  	},
  	

  	initTangentBinormal:function(indices,vertices){
  		
  		for (var i = 0; i < indices.length * 3; i++) {
  				this.tangent[i] = 0;
  				this.biTangent[i] = 0;
  			}	
  		
  		var textureCoords = this.getTextureCoords();

  		for(var i = 0; i < indices.length; ++i)
		{
			var i0 = indices[i*3+0];
			var i1 = indices[i*3+1];
			var i2 = indices[i*3+2];

			var vertexI0 = {
				pos : {
					x: vertices[i0*3+0],
					y: vertices[i0*3+1],
					z: vertices[i0*3+2]
				},
				tex : {
					x: textureCoords[i0*2+0],
					y: textureCoords[i0*2+1],					
				},
			};

			var vertexI1 = {
				pos : {
					x: vertices[i1*3+0],
					y: vertices[i1*3+1],
					z: vertices[i1*3+2]
				},
				tex : {
					x: textureCoords[i1*2+0],
					y: textureCoords[i1*2+1],					
				},
			};

			var vertexI2 = {
				pos : {
					x: vertices[i2*3+0],
					y: vertices[i2*3+1],
					z: vertices[i2*3+2]
				},
				tex : {
					x: textureCoords[i2*2+0],
					y: textureCoords[i2*2+1],					
				},
			};		
			
			this.CalculateTangentBinormal(vertexI0, vertexI1, vertexI2, i0);
			this.CalculateTangentBinormal(vertexI0, vertexI1, vertexI2, i1);
			this.CalculateTangentBinormal(vertexI0, vertexI1, vertexI2, i2);
		}


		this.tangentBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent), gl.STATIC_DRAW);
		this.tangentBuffer.itemSize = 3;
		this.tangentBuffer.numItems = this.tangent.length / 3;

		this.biTangentBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.biTangentBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.biTangent), gl.STATIC_DRAW);
		this.biTangentBuffer.itemSize = 3;
		this.biTangentBuffer.numItems = this.biTangent.length / 3;
  	},
  	CalculateTangentBinormal: function(vertex1, vertex2, vertex3, index)
	{


		var vector1 = [], vector2 = [];
		var tuVector = [], tvVector= [];
		var den;
		var length;
	
		// Calculate the two vectors for this face.
		vector1[0] = vertex2.pos.x - vertex1.pos.x;
		vector1[1] = vertex2.pos.y - vertex1.pos.y;
		vector1[2] = vertex2.pos.z - vertex1.pos.z;

		vector2[0] = vertex3.pos.x - vertex1.pos.x;
		vector2[1] = vertex3.pos.y - vertex1.pos.y;
		vector2[2] = vertex3.pos.z - vertex1.pos.z;

		// Calculate the tu and tv texture space vectors.
		tuVector[0] = vertex2.tex.x - vertex1.tex.x;
		tvVector[0] = vertex2.tex.y - vertex1.tex.y;

		tuVector[1] = vertex3.tex.x - vertex1.tex.x;
		tvVector[1] = vertex3.tex.y - vertex1.tex.y;

		// Calculate the denominator of the tangent/binormal equation.
		den = 1.0 / (tuVector[0] * tvVector[1] - tuVector[1] * tvVector[0]);

		// Calculate the cross products and multiply by the coefficient to get the tangent and binormal.
		this.tangent[index*3+0] = (tvVector[1] * vector1[0] - tvVector[0] * vector2[0]) * den;
		this.tangent[index*3+1] = (tvVector[1] * vector1[1] - tvVector[0] * vector2[1]) * den;
		this.tangent[index*3+2] = (tvVector[1] * vector1[2] - tvVector[0] * vector2[2]) * den;

		this.biTangent[index*3+0] = (tuVector[0] * vector2[0] - tuVector[1] * vector1[0]) * den;
		this.biTangent[index*3+1] = (tuVector[0] * vector2[1] - tuVector[1] * vector1[1]) * den;
		this.biTangent[index*3+2] = (tuVector[0] * vector2[2] - tuVector[1] * vector1[2]) * den;

		// Calculate the length of this normal.
		length = Math.sqrt((this.tangent[index*3+0] * this.tangent[index*3+0]) + (this.tangent[index*3+1] * this.tangent[index*3+1]) + (this.tangent[index*3+2] * this.tangent[index*3+2]));

		// Normalize the normal and then store it
		this.tangent[index*3+0] = this.tangent[index*3+0] / length;
		this.tangent[index*3+1] = this.tangent[index*3+1] / length;
		this.tangent[index*3+2] = this.tangent[index*3+2] / length;

		// Calculate the length of this normal.
		length = Math.sqrt((this.biTangent[index*3+0] * this.biTangent[index*3+0]) + (this.biTangent[index*3+1] * this.biTangent[index*3+1]) + (this.biTangent[index*3+2] * this.biTangent[index*3+2]));

		// Normalize the normal and then store it
		this.biTangent[index*3+0] = this.biTangent[index*3+0] / length;
		this.biTangent[index*3+1] = this.biTangent[index*3+1] / length;
		this.biTangent[index*3+2] = this.biTangent[index*3+2] / length;
	},

  	getTextureCoords:function(){
  		return [
      		// Front face
      		0.0, 0.0,
      		1.0, 0.0,
      		1.0, 1.0,
      		0.0, 1.0,

      		// backk face
      		1.0, 0.0,
      		1.0, 1.0,
      		0.0, 1.0,
      		0.0, 0.0,

      		// Top face
      		0.0, 1.0,
      		0.0, 0.0,
      		1.0, 0.0,
      		1.0, 1.0,

			// Bottom face
      		1.0, 1.0,
      		0.0, 1.0,
      		0.0, 0.0,
      		1.0, 0.0,

      		// Right face
      		1.0, 0.0,
      		1.0, 1.0,
      		0.0, 1.0,
      		0.0, 0.0,

      		// Left face
      		0.0, 0.0,
      		1.0, 0.0,
      		1.0, 1.0,
      		0.0, 1.0
    		];
  	}

};
