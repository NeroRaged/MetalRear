


Model = function(pathModel,pathTexture,shader_vs,shader_fs){

    this.shaderProgram = this.initShaders(shader_vs,shader_fs);

    this.pathTexture = pathTexture;
    addTextureArray(pathTexture);

    this.isModelReady = false;
    this.isTextureActive = false;
    this.isDamage = false;


    this.posx=0;this.posy=0;this.posz=0;
    this.rotx=0;this.roty=0;this.rotz=0;
    this.scalex=1;this.scaley=1;this.scalez=1;

    var client = new XMLHttpRequest();
    client.open('GET', pathModel);
    var that = this;
    client.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            that.loadModel(this.responseText);
            that.initTexture(pathTexture);                
            that.isModelReady = true;
        }

    }
    client.send();


    
};

Model.prototype = {
    setPos:function(){

    },

    draw: function(pMatrix,mvMatrix,light){

        if (this.isModelReady){
            var shaderProgram = this.shaderProgram;
            gl.useProgram(shaderProgram);
    
            
            //Asignamos al shader nuestros valores de las matrices
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);        
            
            // Se "activa" el buffer de vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
            gl.vertexAttribPointer(shaderProgram.aVertexPosition, this.vertexBuffer.itemSize  , gl.FLOAT, false, 0, 0);       
            gl.enableVertexAttribArray(shaderProgram.aVertexPosition);                                  
        
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
                gl.vertexAttribPointer(shaderProgram.aTexcoord, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderProgram.aTexcoord);                                

                gl.activeTexture(TexturasDeModelos[this.pathTexture].numTexture);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(shaderProgram.uTexture, TexturasDeModelos[this.pathTexture].num);


                gl.bindBuffer(gl.ARRAY_BUFFER, this.normsBuffer);
                gl.vertexAttribPointer(shaderProgram.aVertexNormal, this.normsBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderProgram.aVertexNormal);

            //////////////
                gl.uniform3fv(shaderProgram.uAmbientColor, light.ambientColor);
                
                var adjustedLD = vec3.create();
                vec3.normalize(adjustedLD,light.lightingDirection);               
                gl.uniform3fv(shaderProgram.uLightingDirection, adjustedLD);
                gl.uniform3fv(shaderProgram.uDirectionalColor,light.directionalColor);
                gl.uniform1i(shaderProgram.uIsDamage,this.isDamage);
                

                var normalMatrix = mat4.create();
            
                mat4.invert(normalMatrix,mvMatrix);
                mat4.transpose(normalMatrix,mvMatrix);
                gl.uniformMatrix4fv(shaderProgram.uNMatrix, false, normalMatrix);
                /////////////
            

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
        
        }
         this.isDamage = false;

    },

    drawPoly: function(pMatrix,light){

        if (this.isModelReady){
            var shaderProgram = this.shaderProgram;
            gl.useProgram(shaderProgram);
    
            var mvMatrix = mat4.create();

            // Se limpia la matriz de transformaciones
            mat4.identity(mvMatrix);
            
            // Se aplica translacion sobre la matriz de transformaciones
            mat4.translate(mvMatrix, mvMatrix, [this.posx, this.posy, this.posz]);
            mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotx); /* en radianes */
            mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * this.roty ); /* en   radianes */
            mat4.rotateZ(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotz); /* en radianes */
            mat4.scale(mvMatrix, mvMatrix, [this.scalex, this.scaley, this.scalez]);
        
            //Asignamos al shader nuestros valores de las matrices
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);        
            
            // Se "activa" el buffer de vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
            gl.vertexAttribPointer(shaderProgram.aVertexPosition, this.vertexBuffer.itemSize  , gl.FLOAT, false, 0, 0);       
            gl.enableVertexAttribArray(shaderProgram.aVertexPosition);                                  
        
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
                gl.vertexAttribPointer(shaderProgram.aTexcoord, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderProgram.aTexcoord);                                

                gl.activeTexture(TexturasDeModelos[this.pathTexture].numTexture);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(shaderProgram.uTexture, TexturasDeModelos[this.pathTexture].num);


                gl.bindBuffer(gl.ARRAY_BUFFER, this.normsBuffer);
                gl.vertexAttribPointer(shaderProgram.aVertexNormal, this.normsBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shaderProgram.aVertexNormal);

            //////////////
                gl.uniform3fv(shaderProgram.uAmbientColor, light.ambientColor);
                
                var adjustedLD = vec3.create();
                vec3.normalize(adjustedLD,light.lightingDirection);               
                gl.uniform3fv(shaderProgram.uLightingDirection, adjustedLD);
                gl.uniform3fv(shaderProgram.uDirectionalColor,light.directionalColor);
                gl.uniform1i(shaderProgram.uIsDamage,this.isDamage);
                

                var normalMatrix = mat4.create();
            
                mat4.invert(normalMatrix,mvMatrix);
                mat4.transpose(normalMatrix,mvMatrix);
                gl.uniformMatrix4fv(shaderProgram.uNMatrix, false, normalMatrix);
                /////////////
            

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
        
        }

        this.isDamage = false;

        


        if (this.isTextureNormalActive){
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.textureNormal);
            gl.uniform1i(shaderProgram.uNormalMap, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
            gl.vertexAttribPointer(shaderProgram.aTangent, this.tangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shaderProgram.aTangent);
        
            gl.bindBuffer(gl.ARRAY_BUFFER, this.biTangentBuffer);
            gl.vertexAttribPointer(shaderProgram.aBiTangent, this.biTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shaderProgram.aBiTangent);
                
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
    loadModel : function (objectData) {
        var verts = [], vertNormals = [], textures = [], unpacked = {};
        // unpacking stuff
        unpacked.verts = [];
        unpacked.norms = [];
        unpacked.textures = [];
        unpacked.hashindices = {};
        unpacked.indices = [];
        unpacked.index = 0;
        // array of lines separated by the newline
        var lines = objectData.split('\n');
    
        var VERTEX_RE = /^v\s/;
        var NORMAL_RE = /^vn\s/;
        var TEXTURE_RE = /^vt\s/;
        var FACE_RE = /^f\s/;
        var WHITESPACE_RE = /\s+/;
    
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            var elements = line.split(WHITESPACE_RE);
            elements.shift();
            
            if (VERTEX_RE.test(line)) {
              // if this is a vertex
              verts.push.apply(verts, elements);
            } else if (NORMAL_RE.test(line)) {
              // if this is a vertex normal
              vertNormals.push.apply(vertNormals, elements);
            } else if (TEXTURE_RE.test(line)) {
              // if this is a texture
              textures.push.apply(textures, elements);
            } else if (FACE_RE.test(line)) {
              // if this is a face
              /*
              split this face into an array of vertex groups
              for example:
                 f 16/92/11 14/101/22 1/69/1
              becomes:
                ['16/92/11', '14/101/22', '1/69/1'];
              */
              var quad = false;

              for (var j = 0, eleLen = elements.length; j < eleLen; j++){
                  // Triangulating quads
                  // quad: 'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2 v3/t3/vn3/'
                  // corresponding triangles:
                  //      'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2'
                  //      'f v2/t2/vn2 v3/t3/vn3 v0/t0/vn0'
                  if(j === 3 && !quad) {
                      // add v2/t2/vn2 in again before continuing to 3
                      j = 2;
                      quad = true;
                  }
                  if(elements[j] in unpacked.hashindices){
                      unpacked.indices.push(unpacked.hashindices[elements[j]]);
                  }
                  else{

                      var vertex = elements[ j ].split( '/' );
                      

                      unpacked.verts.push(verts[(vertex[0] - 1) * 3 + 0]);
                      unpacked.verts.push(verts[(vertex[0] - 1) * 3 + 1]);
                      unpacked.verts.push(verts[(vertex[0] - 1) * 3 + 2]);
                      // vertex textures
                      unpacked.textures.push(textures[(vertex[1] - 1) * 3 + 0]);
                      unpacked.textures.push(textures[(vertex[1] - 1) * 3 + 1]);
                      // vertex normals
                      unpacked.norms.push(vertNormals[(vertex[2] - 1) * 3 + 0]);
                      unpacked.norms.push(vertNormals[(vertex[2] - 1) * 3 + 1]);
                      unpacked.norms.push(vertNormals[(vertex[2] - 1) * 3 + 2]);
                      // add the newly created vertex to the list of indices
                      unpacked.hashindices[elements[j]] = unpacked.index;
                      unpacked.indices.push(unpacked.index);
                      // increment the counter
                      unpacked.index += 1;
                  }
                  if(j === 3 && quad) {
                      // add v0/t0/vn0 onto the second triangle
                      unpacked.indices.push( unpacked.hashindices[elements[0]]);
                  }
              }
            }
        }
        this.vertices = unpacked.verts;
        //this.vertexNormals = unpacked.norms;
        //this.textures = unpacked.textures;
        //this.indices = unpacked.indices;
        
        this.textureBuffer = this.initBuffer(unpacked.textures,gl.ARRAY_BUFFER,2);
        this.vertexBuffer = this.initBuffer(unpacked.verts,gl.ARRAY_BUFFER,3);
        this.normsBuffer = this.initBuffer(unpacked.norms,gl.ARRAY_BUFFER,3);
        this.indexBuffer = this.initBuffer(unpacked.indices,gl.ELEMENT_ARRAY_BUFFER ,1);

  }  
};

