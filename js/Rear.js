var Rear = function() {
	this.frwd = 0;
	this.bFrwd = false;
	this.bBcwd = false;
	this.bLeft = false;
	this.bRight = false;
	
	this.isDamage = false;

	this.px = 0;
	this.py = 0;
	this.pz = 0;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;

	this.rTz = 0;
	this.tRz = 0;
	this.rHeadz = 0;

	this.base = new Model("obj/enemy/base.obj","obj/enemy/blue.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	this.cabeza = new Model("obj/enemy/cabeza.obj","obj/enemy/blueHead.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	this.eje = new Model("obj/enemy/eje.obj","obj/enemy/blue.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	this.rueda = new Model("obj/enemy/rueda.obj","obj/enemy/BlackRust.png",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	this.torBase = new Model("obj/enemy/torretaBase.obj","obj/enemy/blue.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	//this.torLaser = new Model("obj/enemy/toretaLaser.obj","obj/enemy/txt.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	this.torCannon = new Model("obj/enemy/torretaCanon.obj","obj/enemy/txt.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);

	this.life = 1000;

	this.mvMatrix = mat4.create();
	this.base.mvMatrix = mat4.create();	
	this.cabeza.mvMatrix = mat4.create();	
	this.eje.mvMatrixUR = mat4.create();	
	this.eje.mvMatrixUL = mat4.create();	
	this.eje.mvMatrixDR = mat4.create();	
	this.eje.mvMatrixDL = mat4.create();	

	this.rueda.mvMatrixUR = mat4.create();	
	this.rueda.mvMatrixUL = mat4.create();	
	this.rueda.mvMatrixDR = mat4.create();	
	this.rueda.mvMatrixDL = mat4.create();

	this.torBase.mvMatrixLeft = mat4.create();	
	this.torCannon.mvMatrixLeft = mat4.create();	
	this.torBase.mvMatrixRight = mat4.create();	
	this.torCannon.mvMatrixRight = mat4.create();	
	//this.torCannon.mvMatrix = mat4.create();

	this.holeMatrix = mat4.create();

	this.rect = new RectangleF(80,40,70);
	this.rectUp = new RectangleF(40,30,25);

	this.phi = 0;
	this.theta = 0;
};

Rear.prototype = {
	setHard(dificultad){
		this.life=1000*(dificultad/30);
		this.vel = 30 + (dificultad/2);
	},

	getUnit : function () {
		return this.frwd / 100;
	},
	
	update:function(delta,nave){
		if (delta==undefined)	
			delta = 0;

		var RAD = (Math.PI / 180);
			

		if (this.life>0){

			var frwd = this.frwd;
	
			if (this.bFrwd){
        		this.frwd = 30;
			} else if (this.bBcwd){
        		this.frwd = -30;
			} else{
        		this.frwd = 0;  
        	}

        	if (this.bLeft){
				this.ry+=(20*delta);		
			}
			else if (this.bRight){
				this.ry-=(20*delta);		
			}
        	        
			
			var moveX = Math.sin(Math.PI / 180 *(this.rz+90)) * Math.sin(Math.PI / 180 *this.ry);
			var moveZ = Math.sin(Math.PI / 180 *(this.rz+90)) * Math.cos(Math.PI / 180 *this.ry);
			
			this.pz+=(moveZ * frwd *delta);		
			this.px+=(moveX * frwd *delta);		
			
			var px2= Math.pow(this.px-400,2);
			var pz2= Math.pow(this.pz-400,2);
	
			
			/*if (Math.sqrt(px2+pz2)>400){
				this.pz-=(moveZ * frwd);		
				this.px-=(moveX * frwd);	
				this.frwd = frwd>0 ? frwd - (1*delta) : 0;
			}*/
	
			//console.log(moveZ);
	
			var floor = terrenoIDE.getHeight(Math.round(this.px),Math.round(this.pz));		
			this.px =  this.px >= 500 ?  499 : this.px <= 300 ?  301 : this.px;
			this.pz =  this.pz >= 500 ?  499 : this.pz <= 300 ?  301 : this.pz;
	
			
			
			var mvMatrix = this.mvMatrix;
			var baseMvMatrix = this.base.mvMatrix;		
			var cabezaMvMatrix = this.cabeza.mvMatrix;
			var ejeMvMatrixUR = this.eje.mvMatrixUR;
			var ejeMvMatrixUL = this.eje.mvMatrixUL;
			var ejeMvMatrixDR = this.eje.mvMatrixDR;
			var ejeMvMatrixDL = this.eje.mvMatrixDL;
	
			var ruedaMvMatrixUR = this.rueda.mvMatrixUR;
			var ruedaMvMatrixUL = this.rueda.mvMatrixUL;
			var ruedaMvMatrixDR = this.rueda.mvMatrixDR;
			var ruedaMvMatrixDL = this.rueda.mvMatrixDL;
	
			var torBaseMvMatrixLeft = this.torBase.mvMatrixLeft;	
			var torCannonMvMatrixLeft = this.torCannon.mvMatrixLeft;	

			var torBaseMvMatrixRight = this.torBase.mvMatrixRight;	
			var torCannonMvMatrixRight = this.torCannon.mvMatrixRight;	
			
			var mov = Math.sin(RAD * this.rTz * 10) / 5;
			var mov2 = Math.cos(RAD * this.rTz * 15) / 5;
	
        	mat4.identity(mvMatrix);           
       		mat4.translate(mvMatrix, mvMatrix, [this.px, this.py, this.pz]);         
       		
       		var cpy = mat4.create();
       		mat4.copy(cpy,mvMatrix);
        	
        	mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx); /* en radianes */
        	mat4.rotateY(mvMatrix, mvMatrix, RAD * (this.ry-90) ); /* en   radianes */
        	mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz); /* en radianes */ 
        	
        	var pos=[];
        	mat4.translate(baseMvMatrix, mvMatrix, [0, 10 + mov, 0]);
        	mat4.getTranslation(pos,baseMvMatrix);
        	pos[1]-=15;      		
	
        	mat4.translate(cabezaMvMatrix, baseMvMatrix, [-14, 10, 0]);        		
	  		
        	var posAim = [];
			mat4.getTranslation(posAim,cabezaMvMatrix);
			var tx = nave.px - posAim[0];
			var ty = nave.py - posAim[1];
			var tz = nave.pz - posAim[2];		
			var td = Math.sqrt((tx*tx)+(tz*tz));
		
			this.phi = (Math.atan(ty / td) * 180 / Math.PI);
			this.theta = (Math.atan(tx / tz) * 180 / Math.PI);
			
			if (tz < 0)
				this.theta = 180 + this.theta;
			else if (tz > 0 && tx < 0)
				this.theta = 360 + this.theta;
			if (td < 0)
				this.phi = 180 + this.phi;
			else if (td > 0 && ty < 0)
				this.phi = 360 + this.phi;
			
			//this.theta-=90;
	
			
		  	mat4.rotateX(cabezaMvMatrix, cabezaMvMatrix, RAD * this.rx); /* en radianes */        
		  	mat4.rotateY(cabezaMvMatrix, cabezaMvMatrix, (Math.PI / 180) * (this.theta-this.ry) ); /* en   radianes */         
			mat4.rotateZ(cabezaMvMatrix, cabezaMvMatrix, (Math.PI / 180) * (this.phi) ); /* en   radianes */ 
			mat4.translate(this.holeMatrix, cabezaMvMatrix, [35, 18, 0]);
    	   
	
    	    //mat4.rotateY(cabezaMvMatrix, cabezaMvMatrix, RAD * this.rHeadz);
	
    	    mat4.translate(ejeMvMatrixUL, mvMatrix, [25, -5, 20]);
    	    mat4.translate(ejeMvMatrixUR, mvMatrix, [25, -5, -20]);        
    	    mat4.translate(ejeMvMatrixDL, mvMatrix, [-30, -5, 20]);
    	    mat4.translate(ejeMvMatrixDR, mvMatrix, [-30, -5, -20]);
    	    
    	    mat4.rotateY(ejeMvMatrixDL, ejeMvMatrixDL, RAD * (-180) );
    	    mat4.rotateY(ejeMvMatrixDR, ejeMvMatrixDR, RAD * (-180) );
	
    	    mat4.translate(ruedaMvMatrixUL, ejeMvMatrixUL, [2, -5, 0]);
    	    mat4.translate(ruedaMvMatrixUR, ejeMvMatrixUR, [2, -5, 0]);        
    	    mat4.translate(ruedaMvMatrixDL, ejeMvMatrixDL, [2, -5, 0]);
    	    mat4.translate(ruedaMvMatrixDR, ejeMvMatrixDR, [2, -5, 0]);
			
			if (this.bFrwd || this.bBcwd){
    	    	mat4.rotateZ(ruedaMvMatrixUL, ruedaMvMatrixUL, RAD * this.rTz);
    	    	mat4.rotateZ(ruedaMvMatrixUR, ruedaMvMatrixUR, RAD * this.rTz);
    	    	mat4.rotateZ(ruedaMvMatrixDL, ruedaMvMatrixDL, RAD * this.rTz  * -1);
    	    	mat4.rotateZ(ruedaMvMatrixDR, ruedaMvMatrixDR, RAD * this.rTz  * -1);
    	    }else if (this.bRight || this.bLeft){
    	    	mat4.rotateZ(ruedaMvMatrixUL, ruedaMvMatrixUL, RAD * this.rTz * -1);
    	    	mat4.rotateZ(ruedaMvMatrixUR, ruedaMvMatrixUR, RAD * this.rTz);
    	    	mat4.rotateZ(ruedaMvMatrixDL, ruedaMvMatrixDL, RAD * this.rTz);
    	    	mat4.rotateZ(ruedaMvMatrixDR, ruedaMvMatrixDR, RAD * this.rTz * -1);
    	    }else{
    	    	mat4.rotateZ(ruedaMvMatrixUL, ruedaMvMatrixUL, RAD * this.rTz);
    	    	mat4.rotateZ(ruedaMvMatrixUR, ruedaMvMatrixUR, RAD * this.rTz);
    	    	mat4.rotateZ(ruedaMvMatrixDL, ruedaMvMatrixDL, RAD * this.rTz  * -1);
    	    	mat4.rotateZ(ruedaMvMatrixDR, ruedaMvMatrixDR, RAD * this.rTz  * -1);
    	    }
    	    
    	    mat4.translate(torBaseMvMatrixRight, cabezaMvMatrix, [-10, 12, 25]);
    	    mat4.translate(torCannonMvMatrixRight, torBaseMvMatrixRight, [20, 0, 0]);
    	    mat4.rotateX(torCannonMvMatrixRight, torCannonMvMatrixRight, RAD * this.tRz);
    	    
    	    mat4.translate(torBaseMvMatrixLeft, cabezaMvMatrix, [-10, 12, -25]);
    	    mat4.rotateX(torBaseMvMatrixLeft, torBaseMvMatrixLeft, RAD * 180);
    	    mat4.translate(torCannonMvMatrixLeft, torBaseMvMatrixLeft, [20, 0, 0]);
    	    mat4.rotateX(torCannonMvMatrixLeft, torCannonMvMatrixLeft, RAD * this.tRz);
    	    

    	    mat4.translate(ejeMvMatrixUL, ejeMvMatrixUL, [0, mov2, 0]);
    	    mat4.translate(ejeMvMatrixUR, ejeMvMatrixUR, [0, mov2, 0]);        
    	    mat4.translate(ejeMvMatrixDL, ejeMvMatrixDL, [0, mov2, 0]);
    	    mat4.translate(ejeMvMatrixDR, ejeMvMatrixDR, [0, mov2, 0]);
    	    
    	    this.totalRotTor=[this.rx,this.theta,this.phi];
			
    	    
    	    if (this.bFrwd || this.bLeft){
    	    	this.rTz-=80*delta;
			} else if (this.bBcwd  || this.bRight){
    	    	this.rTz+=80*delta;
			} else{
    	    	this.rTz+=0;
    	    }
    	    this.tRz-=100*delta;
    	    this.rHeadz -= 70*delta;
    	    this.bFrwd = false;       
    	    this.bBcwd = false;
    	    this.bLeft = false;
			this.bRight = false;
	
			
    	    this.rect.update(pos,[0,this.ry-90,this.rz]);
    	    posAim[1]+=15; 
    	    this.rectUp.update(posAim,[this.rx,this.theta-90,this.phi]);

    	}else{

    		var floor = terrenoIDE.getHeight(Math.round(this.px),Math.round(this.pz));		
			this.px =  this.px >= 500 ?  499 : this.px <= 300 ?  301 : this.px;
			this.pz =  this.pz >= 500 ?  499 : this.pz <= 300 ?  301 : this.pz;

    		var mvMatrix = this.mvMatrix;
			var baseMvMatrix = this.base.mvMatrix;		
			var cabezaMvMatrix = this.cabeza.mvMatrix;
			var ejeMvMatrixUR = this.eje.mvMatrixUR;
			var ejeMvMatrixUL = this.eje.mvMatrixUL;
			var ejeMvMatrixDR = this.eje.mvMatrixDR;
			var ejeMvMatrixDL = this.eje.mvMatrixDL;
	
			var ruedaMvMatrixUR = this.rueda.mvMatrixUR;
			var ruedaMvMatrixUL = this.rueda.mvMatrixUL;
			var ruedaMvMatrixDR = this.rueda.mvMatrixDR;
			var ruedaMvMatrixDL = this.rueda.mvMatrixDL;
	
			var torBaseMvMatrix = this.torBase.mvMatrixRight;	
			var torCannonMvMatrix = this.torCannon.mvMatrixRight;	
				
        	mat4.identity(mvMatrix);           
       		mat4.translate(mvMatrix, mvMatrix, [this.px, this.py, this.pz]);         
       		       		
        	mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx); /* en radianes */
        	mat4.rotateY(mvMatrix, mvMatrix, RAD * (this.ry-90) ); /* en   radianes */
        	mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz); /* en radianes */ 
        	
        	mat4.translate(baseMvMatrix, mvMatrix, [0, 10, 0]);        
        	mat4.rotateX(baseMvMatrix, baseMvMatrix, (Math.PI / 180) * (10) ); /* en   radianes */ 	
        	mat4.translate(cabezaMvMatrix, baseMvMatrix, [-14, 10, 0]);
	  		        	
		  	mat4.rotateX(cabezaMvMatrix, cabezaMvMatrix, RAD * (this.rx+10)); /* en radianes */        
		  	mat4.rotateY(cabezaMvMatrix, cabezaMvMatrix, (Math.PI / 180) * (this.theta-this.ry) ); /* en   radianes */         
			mat4.rotateZ(cabezaMvMatrix, cabezaMvMatrix, (Math.PI / 180) * (this.phi) ); /* en   radianes */ 
	
    	    //mat4.rotateY(cabezaMvMatrix, cabezaMvMatrix, RAD * this.rHeadz);
	
    	    mat4.translate(ejeMvMatrixUL, mvMatrix, [25, -10, 16]);
    	    mat4.translate(ejeMvMatrixUR, mvMatrix, [25, -5, -20]);        
    	    mat4.translate(ejeMvMatrixDL, mvMatrix, [-30, -10, 16]);
    	    mat4.translate(ejeMvMatrixDR, mvMatrix, [-30, -5, -20]);
    	    
    	    mat4.rotateY(ejeMvMatrixDL, ejeMvMatrixDL, RAD * (-170) );
    	    mat4.rotateY(ejeMvMatrixDR, ejeMvMatrixDR, RAD * (-170) );

    	    mat4.rotateZ(ejeMvMatrixDR, ejeMvMatrixDR, RAD * (-10) );
    	    mat4.rotateZ(ejeMvMatrixUR, ejeMvMatrixUR, RAD * (-10) );
	
    	    mat4.translate(ruedaMvMatrixUL, ejeMvMatrixUL, [-2, 0, 0]);
    	    mat4.translate(ruedaMvMatrixUR, ejeMvMatrixUR, [-2, -5, 0]);        
    	    mat4.translate(ruedaMvMatrixDL, ejeMvMatrixDL, [-2, 0, 0]);
    	    mat4.translate(ruedaMvMatrixDR, ejeMvMatrixDR, [-2, -5, 0]);
	
    	    mat4.rotateZ(ruedaMvMatrixUL, ruedaMvMatrixUL, RAD * this.rTz);
    	    mat4.rotateZ(ruedaMvMatrixUR, ruedaMvMatrixUR, RAD * this.rTz);
    	    mat4.rotateZ(ruedaMvMatrixDL, ruedaMvMatrixDL, RAD * this.rTz  * -1);
    	    mat4.rotateZ(ruedaMvMatrixDR, ruedaMvMatrixDR, RAD * this.rTz  * -1);
    	    
    	    mat4.translate(torBaseMvMatrix, cabezaMvMatrix, [-10, 12, 25]);
    	    mat4.rotateY(torBaseMvMatrix, torBaseMvMatrix, RAD * -20);    
    	    mat4.rotateZ(torBaseMvMatrix, torBaseMvMatrix, RAD * -20);

    	    mat4.translate(torCannonMvMatrix, torBaseMvMatrix, [20, 0, 0]);
    	    mat4.rotateX(torCannonMvMatrix, torCannonMvMatrix, RAD * this.tRz);    	              	   
    	}
	},

	increaseMove: function(){
		this.bFrwd = true;		
	},
	decreaseMove: function(){
		this.bBcwd = true;		
	},
	moveBack: function(delta){
		this.pz-=
		(
			Math.cos(Math.PI / 180 *this.ry) * 20*delta
		);		
		this.px+=
		(
			Math.sin(Math.PI / 180 *this.ry) * 20*delta
		);		
	},
	moveLeft: function(delta){
		this.pz+=
		(
			Math.cos(Math.PI / 180 *(this.ry-90)) * 20*delta
		);		
		this.px-=
		(
			Math.sin(Math.PI / 180 *(this.ry-90)) * 20*delta
		);		
	},
	moveRight: function(delta){
		this.pz+=
		(
			Math.cos(Math.PI / 180 *(this.ry+90)) * 20*delta
		);		
		this.px-=
		(
			Math.sin(Math.PI / 180 *(this.ry+90)) * 20*delta
		);	
	},
	turnLeft: function(delta){
		this.bLeft = true;		
	},
	turnRight: function(delta){
		this.bRight = true;
	},
	turnUp: function(delta){
		this.rz+=(60*delta);		
	},
	turnDown: function(delta){
		this.rz-=(60*delta);		
	},

	turnLook: function(mag){
		this.rz-=mag*this.getUnit();		
	},

	turnAround: function(mag){
		this.ry-=mag*this.getUnit();		
	},
	
	draw:function(camara,light){
		this.base.isDamage = this.isDamage;
		this.cabeza.isDamage = this.isDamage;
		this.torBase.isDamage = this.isDamage;
		this.torCannon.isDamage = this.isDamage;
		
		this.base.draw(camara.pMatrix,this.base.mvMatrix,light);
		this.cabeza.draw(camara.pMatrix,this.cabeza.mvMatrix,light);		
		
		this.eje.isDamage = this.isDamage;		
		this.eje.draw(camara.pMatrix,this.eje.mvMatrixDL,light);		
		this.eje.isDamage = this.isDamage;
		this.eje.draw(camara.pMatrix,this.eje.mvMatrixDR,light);		
		this.eje.isDamage = this.isDamage;
		this.eje.draw(camara.pMatrix,this.eje.mvMatrixUL,light);		
		this.eje.isDamage = this.isDamage;
		this.eje.draw(camara.pMatrix,this.eje.mvMatrixUR,light);	

		this.rueda.isDamage = this.isDamage;		
		this.rueda.draw(camara.pMatrix,this.rueda.mvMatrixDL,light);
		this.rueda.isDamage = this.isDamage;				
		this.rueda.draw(camara.pMatrix,this.rueda.mvMatrixDR,light);
		this.rueda.isDamage = this.isDamage;				
		this.rueda.draw(camara.pMatrix,this.rueda.mvMatrixUL,light);
		this.rueda.isDamage = this.isDamage;
		this.rueda.draw(camara.pMatrix,this.rueda.mvMatrixUR,light);

		this.torCannon.draw(camara.pMatrix,this.torCannon.mvMatrixRight,light);
		this.torBase.draw(camara.pMatrix,this.torBase.mvMatrixRight,light);

		this.torBase.isDamage = this.isDamage;
		this.torCannon.isDamage = this.isDamage;		
		this.torCannon.draw(camara.pMatrix,this.torCannon.mvMatrixLeft,light);
		this.torBase.draw(camara.pMatrix,this.torBase.mvMatrixLeft,light);
		//this.torLaser.draw(camara.pMatrix,this.torLaser.mvMatrix,light);

		this.isDamage = false;
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
	setRot:function(x,y,z){
		this.rx = x;
		this.ry = y;
		this.rz = z;
	},

};