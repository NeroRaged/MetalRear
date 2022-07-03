var Sphere = function (path,radius,shader_vs,shader_fs){

	this.px = 0;
	this.py = 0;
	this.pz = 0;

	this.shaderProgram = this.initShaders(shader_vs,shader_fs);

	this.pathTexture = path;
    addTextureArray(path);
	
	this.isTextureActive= false;
	
	this.initElement(radius);
	this.initTexture(path);
	this.aVar = 0;

	this.isDamage=false;
	
};

Sphere.prototype = {
	initElement:function(radius){
		
		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		
		var Stacks = 64, Slices = 64;
		var phix = Math.PI * 2.0;
		var thetax = Math.PI;


		for(var i = 0; i < Stacks; i++)		{
			
			var y = i/(Stacks-1);
			
			for(var j = 0; j < Slices; j++)			{
			
				var x = j/(Slices-1);

				vertices.push( 
					radius * Math.sin(y*thetax) *  Math.cos(x*phix), 
					radius * Math.cos(y*thetax),
					radius * Math.sin(y*thetax) * Math.sin(x*phix)
					);
				
				///////////////////////
				uvs.push( j / (Slices - 1));
				uvs.push( i / (Stacks - 1));

				var ix = vertices.lenght-3;
				var iy = vertices.lenght-2;
				var iz = vertices.lenght-1;


				var vertexA = [
					radius * Math.sin(y*thetax) *  Math.cos(x*phix), 
					radius * Math.cos(y*thetax),
					radius * Math.sin(y*thetax) * Math.sin(x*phix)
				];
				x = (j+1)/(Slices-1);
				var vertexB = [
					radius * Math.sin(y*thetax) *  Math.cos(x*phix), 
					radius * Math.cos(y*thetax),
					radius * Math.sin(y*thetax) * Math.sin(x*phix)
				];
				x = j/(Slices-1);
				y = (i+1)/(Stacks-1);
				var vertexC = [
					radius * Math.sin(y*thetax) *  Math.cos(x*phix), 
					radius * Math.cos(y*thetax),
					radius * Math.sin(y*thetax) * Math.sin(x*phix)
				];
				


				var normalCoord = this.getNormalCoord(vertexA,vertexB,vertexC);
				normals.push( normalCoord.nx,normalCoord.ny,normalCoord.nz );

									
			}
		}

		// indices

		var index = 0;

		for ( y = 0; y < Stacks-1; y ++ ) {

			for ( x = 0; x < Slices-1; x ++ ) {

				var a = Slices * y + x;
				var b = (Slices * ( y + 1 )) + x;
				var c = (Slices * ( y + 1 )) + ( x + 1 );
				var d = (Slices * y) + ( x + 1 );

				// faces

				indices.push( a, b, d );
				indices.push( b, c, d );							
			}

		}
		
		this.indexBuffer = this.initBuffer(indices,gl.ELEMENT_ARRAY_BUFFER,1);
		this.vPosBuffer = this.initBuffer(vertices,gl.ARRAY_BUFFER,3);
		this.normalBuffer = this.initBuffer( normals,gl.ARRAY_BUFFER,3);
		this.textureCoorBuffer = this.initBuffer( uvs,gl.ARRAY_BUFFER,2);

		this.readyVertex = true;
	},

	setPos:function(x,y,z){
		this.px = x;
		this.py = y;
		this.pz = z;
	},

	draw : function(pMatrix,mvMatrix,light){
		if (this.readyVertex){
			var shaderProgram = this.shaderProgram;
			gl.useProgram(shaderProgram);    			

			gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
				
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vPosBuffer);
			gl.vertexAttribPointer(shaderProgram.aVertexPosition, this.vPosBuffer.itemSize	, gl.FLOAT, false, 0, 0);		
			gl.enableVertexAttribArray(shaderProgram.aVertexPosition);									

			if (this.isTextureActive){
                gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoorBuffer);
                gl.vertexAttribPointer(shaderProgram.aTexcoord, this.textureCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderProgram.aTexcoord);                                

				gl.activeTexture(TexturasDeModelos[this.pathTexture].numTexture);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(shaderProgram.uTexture, TexturasDeModelos[this.pathTexture].num);


                gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
                gl.vertexAttribPointer(shaderProgram.aVertexNormal, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderProgram.aVertexNormal);

            //////////////
                gl.uniform3fv(shaderProgram.uAmbientColor, light.ambientColor);
                
                var adjustedLD = vec3.create();
                vec3.normalize(adjustedLD,light.lightingDirection); 

                gl.uniform3fv(shaderProgram.uLightingDirection, adjustedLD);
                gl.uniform3fv(shaderProgram.uDirectionalColor, light.directionalColor);
                

                var normalMatrix = mat4.create();
            
                mat4.invert(normalMatrix,mvMatrix);
                mat4.transpose(normalMatrix,mvMatrix);
                gl.uniformMatrix4fv(shaderProgram.uNMatrix, false, normalMatrix);
                gl.uniform1i(shaderProgram.uIsDamage,this.isDamage);
                /////////////
            }


			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	
			gl.drawElements(gl.TRIANGLES, 
				this.indexBuffer.numItems,
				gl.UNSIGNED_SHORT,
				0);
	
			gl.disableVertexAttribArray(shaderProgram.aVertexPosition);
			gl.disableVertexAttribArray(shaderProgram.aVertexNormal);
		}
		this.isDamage=false;
	},

	initShaders: function (shader_vs,shader_fs){
        try{

            //Ya obtenidos los valores, obtendremos el shader de cada uno.
            var vertexShader = getShader(shader_vs);
            var fragmentShader = getShader(shader_fs);
    
            //Iniciamos nuesto shaderProgram
            var shaderProgram = gl.createProgram();
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
            shaderProgram.aVertexPosition =     gl.getAttribLocation(shaderProgram, "aVertexPosition");         
            shaderProgram.pMatrixUniform =      gl.getUniformLocation(shaderProgram, "uPMatrix");
            shaderProgram.mvMatrixUniform =     gl.getUniformLocation(shaderProgram, "uMVMatrix");
            shaderProgram.aVertexColor =        gl.getAttribLocation(shaderProgram, "aVertexColor");
            shaderProgram.uTexture =            gl.getUniformLocation(shaderProgram, "uTexture");
            shaderProgram.aTexcoord =           gl.getAttribLocation(shaderProgram, "aTexcoord");
            shaderProgram.aVertexNormal=        gl.getAttribLocation(shaderProgram, "aVertexNormal");
            shaderProgram.uAmbientColor =       gl.getUniformLocation(shaderProgram, "uAmbientColor");
            shaderProgram.uLightingDirection=   gl.getUniformLocation(shaderProgram, "uLightingDirection");
            shaderProgram.uDirectionalColor=    gl.getUniformLocation(shaderProgram, "uDirectionalColor");
            shaderProgram.uNMatrix=             gl.getUniformLocation(shaderProgram, "uNMatrix");
            shaderProgram.uIsDamage=            gl.getUniformLocation(shaderProgram, "uIsDamage");
    
    
            return shaderProgram;
        }catch(e){
            alert("Failed load shaders.");
            return false;
        }
    },

	initTexture: function(path) {
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.isTextureActive = true;
    },
	cleanData : function(){
		var index = 0;
		for (var i = 0; i < this.height * this.width * 4; i+=4) {
			this.data[index++] = this.dataImg[i];	
		}		
	},
	
	initBuffer:function(array,type,dataSize){                
        var buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);      
        //gl.ELEMENT_ARRAY_BUFFER       Indices
        //gl.ARRAY_BUFFER               No indices
        gl.bufferData(type, type == gl.ARRAY_BUFFER ? new Float32Array(array) : new Uint16Array(array), gl.STATIC_DRAW);
        buffer.itemSize = dataSize;
        buffer.numItems = array.length/dataSize; 
        return buffer;       
    },
    getNormalCoord:function(vertex1,vertex2,vertex3){
		
		// Calculamos los dos vectores para esta cara.
		var vector1=[],vector2=[];
		vector1[0] = vertex1[0] - vertex3[0];
		vector1[1] = vertex1[1] - vertex3[1];
		vector1[2] = vertex1[2] - vertex3[2];
		vector2[0] = vertex3[0] - vertex2[0];
		vector2[1] = vertex3[1] - vertex2[1];
		vector2[2] = vertex3[2] - vertex2[2];
		
		// Calculamos el producto cruz de estos dos vectores para obtener
		// el valor aun no normalizado para esta cara

		var x = (vector1[1] * vector2[2]) - (vector1[2] * vector2[1]);
		var y = (vector1[2] * vector2[0]) - (vector1[0] * vector2[2]);
		var z = (vector1[0] * vector2[1]) - (vector1[1] * vector2[0]);

		var length = Math.sqrt((x * x) + (y * y) + (z * z));
		
		var nx = x /length;
		var ny = y /length;
		var nz = z /length;

		return {nx,ny,nz};
	}
    
};

