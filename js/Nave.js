var Nave = function() {
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

	this.fusel = new Model("obj/nave/nave.obj","obj/nave/txt.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	this.leftT = new Model("obj/nave/torreta.obj","obj/nave/metalr.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	this.rightT = new Model("obj/nave/torreta.obj","obj/nave/metalr.jpg",$('#shader-vModel')[0],$('#shader-fModel')[0]);
	this.fire = new Particle("multi/inlineFire.png",16,$('#shader-vPart')[0], $('#shader-fPart')[0]);

	this.fireResR = new Particle("multi/inlineFire.png",16,$('#shader-vPart')[0], $('#shader-fPart')[0]);
	this.fireResL = new Particle("multi/inlineFire.png",16,$('#shader-vPart')[0], $('#shader-fPart')[0]);

	this.life = 100;

	this.mvMatrix = mat4.create();
	this.mvMatrixTorLeft = mat4.create();
	this.mvMatrixTorRight = mat4.create();
	this.mvMatrixFire1 = mat4.create();
	this.mvMatrixFire2 = mat4.create();

	this.rect = new RectangleF(13,8,17);
};

Nave.prototype = {
	getUnit : function () {
		return this.frwd / 100;
	},
	
	update:function(delta){
		if (delta==undefined)
			delta = 0;

		var frwd = this.frwd;

		if (this.bFrwd){
        	this.frwd = 90*delta;
		} else if (this.bBcwd){
        	this.frwd = -60*delta;
		} else{
        	this.frwd = frwd > 0 ? frwd - (4*delta) : frwd < -1 ? frwd + (4*delta) : 0;  
        }
                
		
		var moveX = Math.sin(Math.PI / 180 *(this.rz+90)) * Math.sin(Math.PI / 180 *this.ry);
		var moveZ = Math.sin(Math.PI / 180 *(this.rz+90)) * Math.cos(Math.PI / 180 *this.ry);
		var moveY = Math.cos(Math.PI / 180 *(this.rz+90));
		
		this.pz+=(moveZ * frwd);		
		this.px+=(moveX * frwd);		
		this.py-=(moveY * frwd);

		var px2= Math.pow(this.px-400,2);
		var py2= Math.pow(this.py-400,2);
		var pz2= Math.pow(this.pz-400,2);

		
		if (Math.sqrt(px2+py2+pz2)>400){
			this.pz-=(moveZ * frwd);		
			this.px-=(moveX * frwd);	
			this.py+=(moveY * frwd);
			this.frwd = frwd>0 ? frwd - (1*delta) : 0;
		}

		//console.log(moveZ);

		var floor = terrenoIDE.getHeight(Math.round(this.px),Math.round(this.pz));


		if (this.life>0){
			this.py = this.py > floor ? this.py : floor;
		}
		else if (this.py > floor){
			this.py = this.py-(delta*20);
			this.rz = this.rz > -90 ? this.rz - (10*delta) : this.rz < -91 ? this.rz + (10*delta) : -90;  
        	this.ry++;
		}else{
			this.py = floor;
		}
			
		
		var mvMatrix = this.mvMatrix;
		var mvMatrixTorLeft = this.mvMatrixTorLeft;
		var mvMatrixTorRight = this.mvMatrixTorRight;
		var mvMatrixFire1 = this.mvMatrixFire1;
		var mvMatrixFire2 = this.mvMatrixFire2;
		var RAD = (Math.PI / 180);

        mat4.identity(mvMatrix);           
       	mat4.translate(mvMatrix, mvMatrix, [this.px, this.py, this.pz]);

        mat4.rotateX(mvMatrix, mvMatrix, RAD * this.rx); /* en radianes */
        mat4.rotateY(mvMatrix, mvMatrix, RAD * (this.ry-90) ); /* en   radianes */
        mat4.rotateZ(mvMatrix, mvMatrix, RAD * this.rz); /* en radianes */ 

        var pos=[];
        mat4.getTranslation(pos,mvMatrix);
        
        if (this.life>0){
        	mat4.translate(mvMatrixFire1, mvMatrix, [-11, 0, -12]);       
        	mat4.translate(mvMatrixFire2, mvMatrix, [-11, 0, 13]);       
        }else{
        	mat4.translate(mvMatrixFire1, mvMatrix, [9, 3, -2]);       
        	mat4.translate(mvMatrixFire2, mvMatrix, [-8, 5, 1]);               	        
        }

        mat4.translate(mvMatrixTorRight, mvMatrix, [11, -2, -12.5]);
        mat4.translate(mvMatrixTorLeft, mvMatrix, [11, -2, 12.5]);
        mat4.rotateX(mvMatrixTorRight, mvMatrixTorRight, RAD * this.rTz); /* en radianes */
        mat4.rotateX(mvMatrixTorLeft, mvMatrixTorLeft, RAD * (-this.rTz)); /* en radianes */

       
		
        this.rTz-=2000*delta;
        this.bFrwd = false;              
        this.bBcwd = false;

        this.rect.update(pos,[this.rx,this.ry-90,this.rz]);					
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
			Math.sin(Math.PI / 180 *(this.rz+90)) * Math.cos(Math.PI / 180 *(this.ry+90))*delta*100
		);		
		this.px+=
		(
			Math.sin(Math.PI / 180 *(this.rz+90)) * Math.sin(Math.PI / 180 *(this.ry+90))*delta*100
		);
	},
	moveRight: function(delta){
		this.pz-=
		(
			Math.sin(Math.PI / 180 *(this.rz+90)) * Math.cos(Math.PI / 180 *(this.ry+90))*delta*100
		);		
		this.px-=
		(
			Math.sin(Math.PI / 180 *(this.rz+90)) * Math.sin(Math.PI / 180 *(this.ry+90))*delta*100
		);
	},
	turnLeft: function(delta){
		this.ry+=(40*delta);		
	},
	turnRight: function(delta){
		this.ry-=(40*delta);		
	},
	turnUp: function(delta){
		this.rz+=(60*delta);		
	},
	turnDown: function(delta){
		this.rz-=(60*delta);		
	},

	turnLook: function(mag){
		this.rz-=mag;		
	},

	turnAround: function(mag){
		this.ry-=mag;		
	},
	
	draw:function(camara,light){
		this.fusel.draw(camara.pMatrix,this.mvMatrix,light);
		this.leftT.draw(camara.pMatrix,this.mvMatrixTorLeft,light);
		this.rightT.draw(camara.pMatrix,this.mvMatrixTorRight,light);
		this.fire.draw(camara,this.mvMatrixFire1,light);		
		this.fire.draw(camara,this.mvMatrixFire2,light);
		this.fireResL.drawOne(camara,light);
		this.fireResR.drawOne(camara,light);
	},

	setPos:function(x,y,z){
		this.px = x;
		this.py = y;
		this.pz = z;
	},

	setRot:function(x,y,z){
		this.rx = x;
		this.ry = y;
		this.rz = z;
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