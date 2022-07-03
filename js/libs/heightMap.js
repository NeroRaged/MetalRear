var HeightMapModel = function (hdnCanvas,path,xi,yi,txt,shader_vs,shader_fs){

	this.shaderProgram = this.initShaders(shader_vs,shader_fs);

	this.texture = [];
	this.pathTexture = [];
	
	this.pathTexture[0] = txt[0];
    addTextureArray(txt[0]);
	
	this.pathTexture[1] = txt[1];
    addTextureArray(txt[1]);
	
	this.pathTexture[2] = txt[2];
    addTextureArray(txt[2]);

    this.txt=txt;

	this.height = 0;
	this.width = 0;
	this.dataImg = [];
	this.data = [];

	this.readyVertex = false;
	this.isTextureActive= false;

	var imgL = new Image();
	imgL.src = path;

	this.texture = [];
			
	imgL.onload = () => {
	
		hdnCanvas.width = imgL.width;
		hdnCanvas.height = imgL.height;			
    	var hctx = hdnCanvas.getContext('2d');
		hctx.drawImage(imgL, 0, 0, imgL.width, imgL.height);
		var myImageData = hctx.getImageData(0,0,imgL.width, imgL.height);									

		this.height = hdnCanvas.width;
		this.width = hdnCanvas.height;
		this.dataImg = myImageData.data;	

		this.cleanData();

		//this.createVertex();
		//this.createIndex();
		this.initElement(xi,yi);
		this.initTexture1();

		this.aVar = 0;
	};
};

HeightMapModel.prototype = {
	initElement:function(xi,yi){
		
		var width = this.width;
		var height = this.height;
		
		var x, y;

		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		// generate vertices, normals and uvs
			
		for ( y = 0; y < height; y ++ ) {

			//var z = iy * segment_height - height_half;

			for ( x = 0; x < width; x ++ ) {

				//var x = ix * segment_width - width_half;

				vertices.push( x+xi, (this.data[width * y + x]), y+yi );

				//////////////////////////////////
				//Original
				//normals.push( 0, 0, 1 );
				var vertexA = [
					 x+xi, (this.data[width * y + x]), y+yi 
				];
				var vertexB = [
					 x+xi+1, (this.data[width * y + x]), y+yi 
				];
				var vertexC = [
					 x+xi, (this.data[(width * (y +1)) + x]), y+yi+1 
				];
				
				var normalCoord = this.getNormalCoord(vertexA,vertexB,vertexC);
				normals.push( normalCoord.nx,normalCoord.ny,normalCoord.nz );
				/*normalCoord = this.getNormalCoord(vertexB,vertexC,vertexD);
				normals.push( normalCoord.nx,normalCoord.ny,normalCoord.nz );*/

				uvs.push( (x / (width-1) * 8 ) );
				uvs.push( (1 - ( y / (height-1) )) * 8);

			}	
		}

		// indices

		var index = 0;

		for ( y = 0; y < height-1; y ++ ) {

			for ( x = 0; x < width-1; x ++ ) {

				var a = width * y + x;
				var b = (width * ( y + 1 )) + x;
				var c = (width * ( y + 1 )) + ( x + 1 );
				var d = (width * y) + ( x + 1 );

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


	draw : function(pMatrix,light){
		if (this.readyVertex){
			var shaderProgram = this.shaderProgram;
			gl.useProgram(shaderProgram);
    
			var mvMatrix = mat4.create();

			mat4.identity(mvMatrix);
			
			//mat4.scale(mvMatrix, mvMatrix, [.1,.1,.1]);
		

			gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
				
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vPosBuffer);
			gl.vertexAttribPointer(shaderProgram.aVertexPosition, this.vPosBuffer.itemSize	, gl.FLOAT, false, 0, 0);		
			gl.enableVertexAttribArray(shaderProgram.aVertexPosition);									

			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
                gl.vertexAttribPointer(shaderProgram.aVertexNormal, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderProgram.aVertexNormal);               

			//if (this.isTextureActive){
                gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoorBuffer);
                gl.vertexAttribPointer(shaderProgram.aTexcoord, this.textureCoorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderProgram.aTexcoord);                                

                
				gl.activeTexture(TexturasDeModelos[this.pathTexture[0]].numTexture);
                gl.bindTexture(gl.TEXTURE_2D, this.texture[0]);
                gl.uniform1i(shaderProgram.uTexture1, TexturasDeModelos[this.pathTexture[0]].num);

				gl.activeTexture(TexturasDeModelos[this.pathTexture[1]].numTexture);
                gl.bindTexture(gl.TEXTURE_2D, this.texture[1]);
                gl.uniform1i(shaderProgram.uTexture2, TexturasDeModelos[this.pathTexture[1]].num);
            
                gl.uniform3fv(shaderProgram.uAmbientColor, light.ambientColor);
                
                var adjustedLD = vec3.create();
                vec3.normalize(adjustedLD,light.lightingDirection);   
                         
                
                gl.uniform3fv(shaderProgram.uLightingDirection, adjustedLD);
                gl.uniform3fv(shaderProgram.uDirectionalColor, light.directionalColor);
                

                var normalMatrix = mat4.create();
            
                mat4.invert(normalMatrix,mvMatrix);
                mat4.transpose(normalMatrix,mvMatrix);
                gl.uniformMatrix4fv(shaderProgram.uNMatrix, false, normalMatrix);
                /////////////
            //}


			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	
			gl.drawElements(gl.TRIANGLES, 
				this.indexBuffer.numItems,
				gl.UNSIGNED_SHORT,
				0);
			
			if (this.readyVertex){
				gl.disableVertexAttribArray(shaderProgram.aVertexPosition);
				gl.disableVertexAttribArray(shaderProgram.aVertexNormal);
				gl.disableVertexAttribArray(shaderProgram.aTexcoord);                                
			}
		}
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
            shaderProgram.uTexture2 =            gl.getUniformLocation(shaderProgram, "uTexture2");
            shaderProgram.uTexture1 =            gl.getUniformLocation(shaderProgram, "uTexture1");
            shaderProgram.aTexcoord =           gl.getAttribLocation(shaderProgram, "aTexcoord");
            shaderProgram.aVertexNormal=        gl.getAttribLocation(shaderProgram, "aVertexNormal");
            shaderProgram.uAmbientColor =       gl.getUniformLocation(shaderProgram, "uAmbientColor");
            shaderProgram.uLightingDirection=   gl.getUniformLocation(shaderProgram, "uLightingDirection");
            shaderProgram.uDirectionalColor=    gl.getUniformLocation(shaderProgram, "uDirectionalColor");
            shaderProgram.uNMatrix=             gl.getUniformLocation(shaderProgram, "uNMatrix");
    
    
            return shaderProgram;
        }catch(e){
            alert("Failed load shaders.");
            return false;
        }
    },

	initTexture1: function() {
        this.texture[0] = gl.createTexture();
        this.texture[0].image = new Image();

        gl.bindTexture(gl.TEXTURE_2D, this.texture[0]);       
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255]));   

        
        this.texture[1] = gl.createTexture();
        this.texture[1].image = new Image();

        gl.bindTexture(gl.TEXTURE_2D, this.texture[1]);       
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255])); 

        this.texture[2] = gl.createTexture();
        this.texture[2].image = new Image();

        gl.bindTexture(gl.TEXTURE_2D, this.texture[2]);        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255]));

        this.texture[0].image.onload = () => {
            this.handleLoadedTexture(this.texture[0])
            this.initTexture2();
        };
		this.texture[0].image.src = this.txt[0];                        
    },
    initTexture2: function() {
    	this.texture[1].image.onload = () => {
            this.handleLoadedTexture(this.texture[1])
            this.initTexture3();
        };        
        this.texture[1].image.src = this.txt[1];       
    },
    initTexture3: function() {
    	this.texture[2].image.onload = () => {
            this.handleLoadedTexture(this.texture[2])
            this.isTextureActive = true;
        };
        this.texture[2].image.src = this.txt[2];        
    },


    handleLoadedTexture:function(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        
        gl.generateMipmap(gl.TEXTURE_2D);
        /*gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        /*gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);*/
        gl.bindTexture(gl.TEXTURE_2D, null);        
        
    },
	cleanData : function(){
		var index = 0;
		for (var i = 0; i < this.height * this.width * 4; i+=4) {
			this.data[index++] = this.dataImg[i];	
		}		
	},

	logInfo:function(){
		console.log("Height: " + this.height + " Width: " + this.width + " Data size: " + this.data.length);
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
    getHeight:function(x,y){
		return this.data[this.width * y + x];
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

var HeightMap = function (hdnCanvas,path){

	this.height = 0;
	this.width = 0;
	this.dataImg = [];
	this.data = []

	this.isReady = false;
	
	var imgL = new Image();
	imgL.src = path;
			
	imgL.onload = () => {
	
		hdnCanvas.width = imgL.width;
		hdnCanvas.height = imgL.height;			
    	var hctx = hdnCanvas.getContext('2d');
		hctx.drawImage(imgL, 0, 0, imgL.width, imgL.height);
		var myImageData = hctx.getImageData(0,0,imgL.width, imgL.height);									

		this.height = hdnCanvas.width;
		this.width = hdnCanvas.height;
		this.dataImg = myImageData.data;	

		this.cleanData();	
		this.isReady = true;	
	};
};

HeightMap.prototype = {
	initElement:function(){
		
		var width = this.width;
		var height = this.height;
		
		var x, y;

		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		// generate vertices, normals and uvs
			
		for ( y = 0; y < height; y ++ ) {

			//var z = iy * segment_height - height_half;

			for ( x = 0; x < width; x ++ ) {

				//var x = ix * segment_width - width_half;

				vertices.push( x, (this.getHeight(x.y)) / 5.0, y );
				normals.push( 0, 0, 1 );

				uvs.push( x / width );
				uvs.push( 1 - ( y / height ) );

			}

			

		}

		// indices

		var index = 0;

		for ( y = 0; y < height-1; y ++ ) {

			for ( x = 0; x < width-1; x ++ ) {

				var a = width * y + x;
				var b = (width * ( y + 1 )) + x;
				var c = (width * ( y + 1 )) + ( x + 1 );
				var d = (width * y) + ( x + 1 );

				// faces

				indices.push( a, b, d );
				indices.push( b, c, d );
				index++;
			}

		}			
	},	
	cleanData : function(){
		var index = 0;
		for (var i = 0; i < this.height * this.width * 4; i+=4) {
			this.data[index++] = this.dataImg[i];	
		}		
	},
	getHeight:function(x,y){
		if (this.data.length>0)
			try{
				return this.data[this.width * y + x] + 5;
			}catch(e){
				return 5;
			}
		else
			return 5;
	}
	
};




//¿Crees que deba de esperarla?
