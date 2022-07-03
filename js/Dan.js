var Dan = function() {
	this.frwd = 0;
	this.bFrwd = false;
	this.bBcwd = false;

	this.px = 0;
	this.py = 0;
	this.pz = 0;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;

	this.rTz = 0;
	this.tYz = 0;

	this.sphere = new Sphere("multi/blue.jpg",3,$('#shader-vModel')[0], $('#shader-fModel')[0]);
	this.bill = new Bill("obj/target/ammo.png",$('#shader-vBill')[0], $('#shader-fBill')[0]);

	this.life = 50;

	this.mvMatrix = mat4.create();
	this.sphere.mvMatrix = mat4.create();
	this.bill.mvMatrix = mat4.create();	

	this.rect = new RectangleF(5,13,5);

	this.MODE = 1;
	//1 float
	//2 ammo
	//3 respawn

	this.timeRespawn = 0;
};

Dan.prototype = {
	getUnit : function () {
		return this.frwd / 100;
	},
	
	update:function(delta){
		if (delta==undefined)
			delta = 0;

		if (this.MODE == 1 || this.MODE == 2){
        	var RAD = (Math.PI / 180);                
			var floor = terrenoIDE.getHeight(Math.round(this.px),Math.round(this.pz));
			
			if (this.MODE == 2){
				if (this.dt==undefined){
					this.dt = delta*5;
				}
				this.dt += delta*5;
				this.py-=this.dt;
			}

			this.py = this.py > floor ? this.py : floor;			
			
			var mvMatrix = this.mvMatrix;
			var sphereMvMatrix = this.sphere.mvMatrix;
			var billMvMatrix = this.bill.mvMatrix;
			
    	    mat4.identity(mvMatrix);           
    	   	mat4.translate(mvMatrix, mvMatrix, [this.px, this.py, this.pz]);
	
    	    mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx); /* en radianes */
    	    mat4.rotateY(mvMatrix, mvMatrix, RAD * this.ry); /* en   radianes */
    	    mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz); /* en radianes */
	
    	    var pos=[];
    	    mat4.getTranslation(pos,mvMatrix);
    	    pos[1]+=7;   
    	    
    	    mat4.translate(sphereMvMatrix, mvMatrix, [0, (this.MODE == 2 ? 0 : 10) + Math.sin(RAD *(this.tYz)) , 0]);       
    	    mat4.translate(billMvMatrix, sphereMvMatrix, [0, -5, 0]);       
    	            
    	    this.rect.update(pos,[this.rx,this.ry-90,this.rz]);

    	    this.timeRespawn = 0;			
    	}
    	
    	if (this.MODE == 3){
    		this.timeRespawn+=delta;    		
    		if (this.timeRespawn>5){
        		this.rect = new RectangleF(5,13,5);
				this.timeRespawn = 0;
	   	    	this.rect.update([0,0,0],[this.rx,this.ry-90,this.rz]);
	   	    	this.MODE = 1;
	   	    	this.dt=0;
	   	    	this.setPos(
					Math.floor(Math.random() * 300) + 300,
					Math.floor(Math.random() * 100) + 80,
					Math.floor(Math.random() * 300) + 300);
	   	    	var mvMatrix = this.mvMatrix;
				var sphereMvMatrix = this.sphere.mvMatrix;
				var billMvMatrix = this.bill.mvMatrix;
									
    	    	mat4.identity(mvMatrix);
    	   		mat4.translate(mvMatrix, mvMatrix, [this.px, this.py, this.pz]);
    	    	mat4.translate(sphereMvMatrix, mvMatrix, [0, 0, 0]);   
    	   		mat4.translate(billMvMatrix, sphereMvMatrix, [0, 0, 0]);    	   
        	}    
    	}    	
	},
	ammoMode(){
		this.MODE=2;
		this.rect = new RectangleF(3,8,3);
		var pos=[];
        mat4.getTranslation(pos,this.mvMatrix);
        pos[1]+=7; 
		this.rect.update(pos,[this.rx,this.ry-90,this.rz]);
	},

	respawnMode(){
		this.MODE=3;
		this.rect = new RectangleF(0,0,0);
		this.rect.update([0,0,0],[0,0,0]);
	},

	
	draw:function(camara,light){

		if (this.MODE==1 || this.MODE==2){
			this.sphere.isDamage = this.MODE==2;				
			this.sphere.draw(camara.pMatrix,this.sphere.mvMatrix,light);
			if (this.MODE==1){
				this.bill.draw(camara,this.bill.mvMatrix,light);
			}
		}
		/*this.fire.draw(camara,this.mvMatrixFire1,light);		
		this.fire.draw(camara,this.mvMatrixFire2,light);		*/
	},

	setPos:function(x,y,z){
		this.px = x;
		this.py = y;
		this.pz = z;
	},

	getPos:function(x,y,z){
		var x = this.px;
		var y = this.py;
		var z = this.pz;
		return {x,y,z};
	},

	getRot:function(x,y,z){
		var x = this.rx;
		var y = this.ry;
		var z = this.rz;
		return {x,y,z};
	},

};