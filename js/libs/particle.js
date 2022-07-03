var Particle = function (path,frames,shader_vs,shader_fs){

	this.shaderProgram = this.initShaders(shader_vs,shader_fs);

	this.pathTexture = path;
    addTextureArray(path);
	
	this.isTextureActive= false;
	
	this.initElement();
	this.initTexture(path);
	this.aVar = 0;

	this.px = 0;
	this.py = 0;
	this.pz = 0;

	this.play=false;
	this.uAlpha=0.0;
	this.frames = frames;
	
};

Particle.prototype = {
	initElement:function(){
		
		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		vertices.push(-5,5,0);
		vertices.push(5,5,0);
		vertices.push(-5,-5,0);
		vertices.push(5,-5,0);
		
		uvs.push( 0, 1 );
		uvs.push( 1, 1);
		uvs.push( 0, 0 );
		uvs.push( 1, 0 );

		var lenght = Math.sqrt(Math.pow(vertices[0], 2) + Math.pow(vertices[1], 2) + Math.pow(vertices[2], 2));
		lenght=-lenght;
		normals.push(
			vertices[0] / lenght, 
			vertices[1] / lenght, 
			vertices[2] / lenght
			);

		lenght = Math.sqrt(Math.pow(vertices[3], 2) + Math.pow(vertices[4], 2) + Math.pow(vertices[5], 2));
		lenght=-lenght;
		normals.push(
			vertices[3] / lenght, 
			vertices[4] / lenght, 
			vertices[5] / lenght
			);		

		lenght = Math.sqrt(Math.pow(vertices[6], 2) + Math.pow(vertices[7], 2) + Math.pow(vertices[8], 2));
		lenght=-lenght;
		normals.push(
			vertices[6] / lenght, 
			vertices[7] / lenght, 
			vertices[8] / lenght
			);		

		lenght = Math.sqrt(Math.pow(vertices[9], 2) + Math.pow(vertices[10], 2) + Math.pow(vertices[11], 2));
		lenght=-lenght;
		normals.push(
			vertices[9] / lenght, 
			vertices[10] / lenght, 
			vertices[11] / lenght
			);											


		indices.push( 0, 1, 3 );
		indices.push( 0, 2, 3 );		
				
		this.indexBuffer = this.initBuffer(indices,gl.ELEMENT_ARRAY_BUFFER,1);
		this.vPosBuffer = this.initBuffer(vertices,gl.ARRAY_BUFFER,3);
		this.normalBuffer = this.initBuffer( normals,gl.ARRAY_BUFFER,3);
		this.textureCoorBuffer = this.initBuffer( uvs,gl.ARRAY_BUFFER,2);

		this.readyVertex = true;
	},

	draw : function(camara,mvMatrix,light,size){
		
		var pos = [];
		mat4.getTranslation(pos,mvMatrix);
		var tx;
		if (size == undefined){
			tx = -camara.getPos().x - pos[0];
		}else{
			tx = camara.getPos().x - pos[0];
		}
		
		var ty = camara.getPos().y - pos[1];
		var tz = camara.getPos().z - pos[2];		

		var td = Math.sqrt((tx*tx)+(tz*tz));
		
		var phi = (Math.atan(ty / td) * 180 / Math.PI);
		var theta = (Math.atan(tx / tz) * 180 / Math.PI);
		
		if (tz < 0)
			theta = 180 + theta;
		else if (tz > 0 && tx < 0)
			theta = 360 + theta;

		if (td < 0)
			phi = 180 + phi;
		else if (td > 0 && ty < 0)
			phi = 360 + phi;		

 		if (this.readyVertex){	
			var shaderProgram = this.shaderProgram;
			gl.useProgram(shaderProgram);
			gl.enable(gl.BLEND);
			//gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
			gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
		
			mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * theta ); /* en   radianes */         
			mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * (-phi) ); /* en   radianes */ 
			
			if (size==undefined)
				mat4.scale(mvMatrix, mvMatrix, [1.3,1.3,1.3] ); /* en   radianes */ 			        				
			else
				mat4.scale(mvMatrix, mvMatrix, [size,size,size] ); 
				
			gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camara.pMatrix);
				
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

		        
		        gl.uniform1f(shaderProgram.uIndex, 0);
		        gl.uniform1f(shaderProgram.uAlpha, Math.floor(this.uAlpha));
		        gl.uniform1f(shaderProgram.uFrames, this.frames);

		        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
					gl.drawElements(gl.TRIANGLES, 
						this.indexBuffer.numItems,
						gl.UNSIGNED_SHORT,
						0);
				}		     				
			gl.disableVertexAttribArray(shaderProgram.aVertexPosition);
			gl.disableVertexAttribArray(shaderProgram.aVertexNormal);				
		}

		if (this.uAlpha<12)
			this.uAlpha+=getDeltaTime()*20;
		else
			this.uAlpha-=10.0;
	},

	drawOne : function(camara,light){				

 		if (this.play && this.readyVertex ){	
			var shaderProgram = this.shaderProgram;
			gl.useProgram(shaderProgram);
			gl.enable(gl.BLEND);
			//gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
			gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

			var mvMatrix = mat4.create();
			mat4.copy(mvMatrix,this.mvMatrix);		

			var pos = [];
			mat4.getTranslation(pos,mvMatrix);
			var tx = camara.getPos().x - pos[0];
			var ty = camara.getPos().y - pos[1];
			var tz = camara.getPos().z - pos[2];		
	
			var td = Math.sqrt((tx*tx)+(tz*tz));
			
			var phi = (Math.atan(ty / td) * 180 / Math.PI);
			var theta = (Math.atan(tx / tz) * 180 / Math.PI);
			
			if (tz < 0)
				theta = 180 + theta;
			else if (tz > 0 && tx < 0)
				theta = 360 + theta;
	
			if (td < 0)
				phi = 180 + phi;
			else if (td > 0 && ty < 0)
				phi = 360 + phi;
		
			mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * theta ); /* en   radianes */         
			mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * (-phi) ); /* en   radianes */
			mat4.translate(mvMatrix, mvMatrix, this.position);
			mat4.scale(mvMatrix, mvMatrix, [1,1,1] ); /* en   radianes */ 			        				
				
			gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camara.pMatrix);
				
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

		        
		        gl.uniform1f(shaderProgram.uIndex, 0);
		        gl.uniform1f(shaderProgram.uAlpha, Math.floor(this.uAlpha));
		        gl.uniform1f(shaderProgram.uFrames, this.frames);

		        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
					gl.drawElements(gl.TRIANGLES, 
						this.indexBuffer.numItems,
						gl.UNSIGNED_SHORT,
						0);
				}		     				
			gl.disableVertexAttribArray(shaderProgram.aVertexPosition);
			gl.disableVertexAttribArray(shaderProgram.aVertexNormal);
			if (this.uAlpha<(this.frames-1))
				this.uAlpha+=getDeltaTime()*40;
			else{
				this.play=false;		
			}			
		}		
	},

	drawAtFrame : function(frame,camara,mvMatrix,light){				

 		if (this.readyVertex ){	
			var shaderProgram = this.shaderProgram;
			gl.useProgram(shaderProgram);
			gl.enable(gl.BLEND);
			//gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
			gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
			
			var pos = [];
			mat4.getTranslation(pos,mvMatrix);
			var tx = camara.getPos().x - pos[0];
			var ty = camara.getPos().y - pos[1];
			var tz = camara.getPos().z - pos[2];		
	
			var td = Math.sqrt((tx*tx)+(tz*tz));
			
			var phi = (Math.atan(ty / td) * 180 / Math.PI);
			var theta = (Math.atan(tx / tz) * 180 / Math.PI);
			
			if (tz < 0)
				theta = 180 + theta;
			else if (tz > 0 && tx < 0)
				theta = 360 + theta;
	
			if (td < 0)
				phi = 180 + phi;
			else if (td > 0 && ty < 0)
				phi = 360 + phi;
		
			mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * theta ); /* en   radianes */         
			mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * (-phi) ); /* en   radianes */
			mat4.scale(mvMatrix, mvMatrix, [1,1,1] ); /* en   radianes */ 			        				
				
			gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camara.pMatrix);
				
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

		        
		        gl.uniform1f(shaderProgram.uIndex, 0);
		        gl.uniform1f(shaderProgram.uAlpha, Math.floor(frame));
		        gl.uniform1f(shaderProgram.uFrames, this.frames);

		        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
					gl.drawElements(gl.TRIANGLES, 
						this.indexBuffer.numItems,
						gl.UNSIGNED_SHORT,
						0);
				}		     				
			gl.disableVertexAttribArray(shaderProgram.aVertexPosition);
			gl.disableVertexAttribArray(shaderProgram.aVertexNormal);					
		}		
	},

	initPlay(mvMatrix){
		this.play=true;
		this.uAlpha=0;	
		var pos =[];
		mat4.getTranslation(pos,mvMatrix);		
		this.mvMatrix = mat4.create();
		mat4.translate(this.mvMatrix, this.mvMatrix, pos)
		this.position=[0,0,0];
	},

	initPlayTranslate(mvMatrix,position){
		this.play=true;
		this.uAlpha=0;	
		var pos =[];
		mat4.getTranslation(pos,mvMatrix);		
		this.mvMatrix = mat4.create();
		mat4.translate(this.mvMatrix, this.mvMatrix, pos)
		this.position = position;
	},
	
	drawPart : function(camara,light){
		
		var tx = camara.getPos().x - this.px;
		var ty = camara.getPos().y - this.py;
		var tz = camara.getPos().z - this.pz;		

		var td = Math.sqrt((tx*tx)+(tz*tz));
		
		var phi = (Math.atan(ty / td) * 180 / Math.PI);
		var theta = (Math.atan(tx / tz) * 180 / Math.PI);
		
		if (tz < 0)
			theta = 180 + theta;
		else if (tz > 0 && tx < 0)
			theta = 360 + theta;

		if (td < 0)
			phi = 180 + phi;
		else if (td > 0 && ty < 0)
			phi = 360 + phi;
		

 		for (var i = 1; i >= 0; i--) {                            
               
			if (this.readyVertex){	
				var shaderProgram = this.shaderProgram;
				gl.useProgram(shaderProgram);

				gl.enable(gl.BLEND);
				//gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
				gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

				

		
				var mvMatrix = mat4.create();

				mat4.identity(mvMatrix);
				
				mat4.translate(mvMatrix, mvMatrix, [this.px,this.py,this.pz]);
				mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * theta ); /* en   radianes */         
				mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * (-phi) ); /* en   radianes */         				
				
				mat4.translate(mvMatrix, mvMatrix, [0,0,-i]);

				gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
				gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camara.pMatrix);
					
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

		           
		           	gl.uniform1f(shaderProgram.uIndex, i);
		           	gl.uniform1f(shaderProgram.uAlpha, Math.floor(this.uAlpha));
		           	gl.uniform1f(shaderProgram.uFrames, this.frames);

		            	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
						gl.drawElements(gl.TRIANGLES, 
							this.indexBuffer.numItems,
							gl.UNSIGNED_SHORT,
							0);
					}
		      

				
		
				gl.disableVertexAttribArray(shaderProgram.aVertexPosition);
				gl.disableVertexAttribArray(shaderProgram.aVertexNormal);


				//gl.enable(gl.DEPTH_TEST);
				
			}
		}		


		if (this.uAlpha<16)
			this.uAlpha+=getDeltaTime()*50;
		else
			this.uAlpha-=16.0;
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

            shaderProgram.uIndex =             	gl.getUniformLocation(shaderProgram, "uIndex");
            shaderProgram.uAlpha =             	gl.getUniformLocation(shaderProgram, "uAlpha");
            shaderProgram.uFrames =            	gl.getUniformLocation(shaderProgram, "uFrames");
            
    	
    
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

    setPos:function(x,y,z){
		this.px = x;
		this.py = y;
		this.pz = z;
	},
    
};

