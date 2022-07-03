

var TexturasDeModelos = [];

function addTextureArray(pathTexture) {
	if (!TexturasDeModelos.includes(pathTexture)){
		
        TexturasDeModelos[pathTexture] = {};
        TexturasDeModelos[pathTexture].num = TexturasDeModelos.length;
        TexturasDeModelos[pathTexture].numTexture = gl.TEXTURE0 + TexturasDeModelos.length;
        TexturasDeModelos.push(pathTexture);
    }
}