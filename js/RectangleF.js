var RectangleF = function (sizeX,sizeY,sizeZ){

	this.sizeX=sizeX;
	this.sizeX2=sizeX/2;
	this.sizeY=sizeY;
	this.sizeY2=sizeY/2;
	this.sizeZ=sizeZ;
	this.sizeZ2=sizeZ/2;
	this.px = 0;
	this.py = 0;
	this.pz = 0;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;

	this.lenght = Math.sqrt(Math.pow(sizeX/2,2)+Math.pow(sizeY/2,2)+Math.pow(sizeZ/2,2));
};

RectangleF.prototype = {
	isCross(rectangle){
		if (this.isNear){
			if (this.doPolygonsIntersect(this.points,rectangle.points)){
				return true;
			}
		}
		return false;
	},

	update(position,rotation){
		this.px = position[0];
		this.py = position[1];
		this.pz = position[2];
		this.rx = rotation[0];
		this.ry = rotation[1];
		this.rz = rotation[2];
		this.points = this.givePoints();
	},

	distanceWith(rectangle){
		return Math.sqrt(Math.pow(this.px-rectangle.px,2)+Math.pow(this.py-rectangle.py,2)+Math.pow(this.pz-rectangle.pz,2));
	},
	isNear(rectangle){
		return this.lenght + rectangle.lenght > this.distanceWith(rectangle);
	},

	givePoints(){
		var px = this.px;
		var sX = this.sizeX2;
		var py = this.py;
		var sY = this.sizeY2;
		var pz = this.pz;
		var sZ = this.sizeZ2;
		var RAD = (Math.PI / 180);
		var pos = [];
		var rect = [];	
		var mvMatrix = mat4.create();
		
		mat4.translate(mvMatrix, mvMatrix, [px, py, pz]); 
		mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx);
        mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry);
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz);
        mat4.translate(mvMatrix, mvMatrix, [sX, sY, sZ]);              
        mat4.getTranslation(pos,mvMatrix);       
		rect[0] = {x: pos[0], y: pos[1],z: pos[2],mv:mvMatrix};
		
		mvMatrix = mat4.create();   
       	mat4.translate(mvMatrix, mvMatrix, [px, py, pz]); 		
       	mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx);
        mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry);
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz);
        mat4.translate(mvMatrix, mvMatrix, [sX,-sY, sZ]);       
        mat4.getTranslation(pos,mvMatrix);		
		rect[1] = {x: pos[0], y: pos[1],z: pos[2],mv:mvMatrix};

		mvMatrix = mat4.create(); 
		mat4.translate(mvMatrix, mvMatrix, [px, py, pz]); 			
       	mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx);
        mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry);
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz);
        mat4.translate(mvMatrix, mvMatrix, [-sX, sY, sZ]);        
        mat4.getTranslation(pos,mvMatrix);		
		rect[2] = {x: pos[0], y: pos[1],z: pos[2],mv:mvMatrix};

		mvMatrix = mat4.create(); 
		mat4.translate(mvMatrix, mvMatrix, [px, py, pz]); 			
       	mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx);
        mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry);
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz);
        mat4.translate(mvMatrix, mvMatrix, [-sX, -sY, sZ]);        
        mat4.getTranslation(pos,mvMatrix);		
		rect[3] = {x: pos[0], y: pos[1],z: pos[2],mv:mvMatrix};
		
		mvMatrix = mat4.create();
		
		mat4.translate(mvMatrix, mvMatrix, [px, py, pz]); 
		mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx);
        mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry);
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz);
        mat4.translate(mvMatrix, mvMatrix, [sX, sY, -sZ]);              
        mat4.getTranslation(pos,mvMatrix);       
		rect[4] = {x: pos[0], y: pos[1],z: pos[2],mv:mvMatrix};
		
		mvMatrix = mat4.create();   
       	mat4.translate(mvMatrix, mvMatrix, [px, py, pz]); 		
       	mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx);
        mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry);
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz);
        mat4.translate(mvMatrix, mvMatrix, [sX,-sY, -sZ]);       
        mat4.getTranslation(pos,mvMatrix);		
		rect[5] = {x: pos[0], y: pos[1],z: pos[2],mv:mvMatrix};

		mvMatrix = mat4.create(); 
		mat4.translate(mvMatrix, mvMatrix, [px, py, pz]); 			
       	mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx);
        mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry);
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz);
        mat4.translate(mvMatrix, mvMatrix, [-sX, sY, -sZ]);        
        mat4.getTranslation(pos,mvMatrix);		
		rect[6] = {x: pos[0], y: pos[1],z: pos[2],mv:mvMatrix};

		mvMatrix = mat4.create(); 
		mat4.translate(mvMatrix, mvMatrix, [px, py, pz]); 			
       	mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx);
        mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry);
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz);
        mat4.translate(mvMatrix, mvMatrix, [-sX, -sY, -sZ]);        
        mat4.getTranslation(pos,mvMatrix);		
		rect[7] = {x: pos[0], y: pos[1],z: pos[2],mv:mvMatrix};
		/*
		rect[4] = {x: px + sX, y: py+sY,z: pz - sZ};
		rect[5] = {x: px + sX, y: py-sY,z: pz - sZ};
		rect[6] = {x: px - sX, y: py+sY,z: pz - sZ};
		rect[7] = {x: px - sX, y: py-sY,z: pz - sZ};
		
		/*
		if (rect1.x < rect2.x + rect2.width &&
   			rect1.x + rect1.width > rect2.x &&
   			rect1.y < rect2.y + rect2.height &&
   			rect1.height + rect1.y > rect2.y) {
    		// collision detected!
		}
		*/
		return rect;
	},
	
	doPolygonsIntersect (a, b) {
    	var polygons = [a, b];
    	var minA, maxA, projected, i, i1, j, minB, maxB;

    	for (i = 0; i < polygons.length; i++) {
	
    	    // for each polygon, look at each edge of the polygon, and determine if it separates
    	    // the two shapes
    	    var polygon = polygons[i];
    	    for (i1 = 0; i1 < polygon.length; i1++) {
	
    	        // grab 2 vertices to create an edge
    	        var i2 = (i1 + 1) % polygon.length;
    	        var p1 = polygon[i1];
    	        var p2 = polygon[i2];
	
    	        // find the line perpendicular to this edge
    	        var normal = { x: (p2.y - p1.y) * (p1.z-p2.z), y: (p1.x - p2.x)* (p1.z-p2.z), z: (p2.y - p1.y) *  (p1.x - p2.x) };
	
    	        minA = maxA = undefined;
    	        // for each vertex in the first shape, project it onto the line perpendicular to the edge
    	        // and keep track of the min and max of these values
    	        for (j = 0; j < a.length; j++) {
    	            projected = normal.x * a[j].x + normal.y * a[j].y + normal.z * a[j].z ;
    	            if (minA == undefined || projected < minA) {
    	                minA = projected;
    	            }
    	            if (maxA == undefined || projected > maxA) {
    	                maxA = projected;
    	            }
    	        }
	
    	        // for each vertex in the second shape, project it onto the line perpendicular to the edge
    	        // and keep track of the min and max of these values
    	        minB = maxB = undefined;
    	        for (j = 0; j < b.length; j++) {
    	            projected = normal.x * b[j].x + normal.y * b[j].y + normal.z * b[j].z ;
    	            if (minB ==undefined || projected < minB) {
    	                minB = projected;
    	            }
    	            if (maxB==undefined || projected > maxB) {
    	                maxB = projected;
    	            }
    	        }
	
    	        // if there is no overlap between the projects, the edge we are looking at separates the two
    	        // polygons, and we know there is no overlap
    	        if (maxA < minB || maxB < minA) {
    	           return false;
    	        }
    	    }
    	}
    	return true;
	},
};