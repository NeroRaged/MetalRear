/*
	Libreria de la camara
	Version 0.2 por Nero	
*/

var Camera = function (x,y,z){
	this.posx=-x;
	this.posy=-y;
	this.posz=-z;
	
	this.rotx=90;
	this.roty=0;
	this.rotz=0;
	//Esta variable nos ayudará a resetear la camara.
	this.isReset=false;

	this.TypeCamera=false;

	this.h = 50;

	this.pMatrix = mat4.create();	
};

Camera.prototype = {
	//Funcion donde usamos la matriz de la camara para actializarla
	update: function(){
		//Llamo la funcion de reiniciar siempre par ver si le pedi reiniciar o no
		this.restart();
		//Limpio mi matriz de proyeccion.
		mat4.identity(this.pMatrix);
		//Le doy la perspectiva a la camara.
		mat4.perspective(this.pMatrix, 30, gl.viewportWidth / gl.viewportHeight, 0.1, 2000.0);			
		//Hago las transformaciones para moverla.
		mat4.rotateX(this.pMatrix, this.pMatrix, (Math.PI / 180) * this.rotx);		
		mat4.rotateY(this.pMatrix, this.pMatrix, (Math.PI / 180) * this.roty);
		mat4.translate(this.pMatrix, this.pMatrix, [this.posx, this.posy, this.posz]);
		//mat4.lookAt(this.pMatrix,[this.posx, this.posy, this.posz],[200,80,200],[0,1,0]);

		//Una ver terminada, la matriz de proyeccion ya estara lista para ser usada
	},

	updatePos: function(model){
		var _poscx = model.getPos().x;
		var _poscy = model.getPos().y;
		var _poscz = model.getPos().z;
		var _dh = model.getRot().y+180;
		var _dv = model.getRot().z;

		
		this.roty += (_dh - this.roty) / 4;
		this.rotx += (_dv - this.rotx) / 4;
		var vup = 0;
		if (this.rotx > 0){
			if (Math.floor(this.rotx / 180) % 2 == 0)
				vup = 1;
			else
				vup = -1;
		}
		if (this.rotx < 0){
			if (Math.floor(this.rotx / 180) % 2 == -1)
				vup = 1;
			else
				vup = -1;
		}
		
		var poscx = _poscx;
		var poscy = _poscy;
		var poscz = _poscz;


		if (this.TypeCamera){

			dircx = (_poscx - ((-h+3)*(sin(this.rotx *(PI) / 180))*(sin(this.roty *(PI) / 180))));
			dircy = (_poscy - ((-h+3)*(cos((this.rotx)*(PI) / 180)))+.3);
			dircz = (_poscz - ((-h+3)*(sin(this.rotx *(PI) / 180))*(cos(this.roty *(PI) / 180))));
			gluLookAt(
				dircx, dircy, dircz,
				poscx, poscy, poscz,
				0, vup, 0);
		}
		else{

			dircx = _poscx - ((this.h)*(Math.sin((this.rotx-110) *(Math.PI) / 180))*(Math.sin(this.roty *(Math.PI) / 180)));
			dircy = _poscy - ((this.h)* Math.cos((this.rotx-110)*(Math.PI) / 180));
			dircz = _poscz - ((this.h)*(Math.sin((this.rotx-110) *(Math.PI) / 180))*(Math.cos(this.roty *(Math.PI) / 180)));
			
			var floor = terrenoIDE.getHeight(Math.round(dircx),Math.round(dircz));

			if (dircy<floor){
				dircy = floor;
			}

			/*
			gluLookAt(
				poscx + .8 * (sin(dv *(PI) / 180))*(sin(dh *(PI) / 180)),
				poscy + .8 * (cos(dv *(PI) / 180)),
				poscz + .8 * (sin(dv *(PI) / 180))*(cos(dh *(PI) / 180)),
				dircx, dircy, dircz,
				0, vup, 0);*/
			mat4.identity(this.pMatrix);
		
			mat4.perspective(this.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 2000.0);			
			mat4.rotateX(this.pMatrix, this.pMatrix, (Math.PI / 180) * (-this.rotx));			
			mat4.rotateY(this.pMatrix, this.pMatrix, (Math.PI / 180) * (-this.roty));
			

			mat4.translate(this.pMatrix, this.pMatrix, [-dircx, -dircy, -dircz]);
			this.posx = -dircx;
			this.posy = -dircy;
			this.posz = -dircz;
		}


		
		
	},

	//Las funciones move funcionan a traves de operaciondes con sin y cos. Mira el gif que esta en la carpeta del proyecto
	moveForward: function(delta){
		this.posz+=
		(
			Math.cos(Math.PI / 180 *this.roty) * 20*delta
		);		
		this.posx-=
		(
			Math.sin(Math.PI / 180 *this.roty) * 20*delta
		);		
	},
	moveBack: function(delta){
		this.posz-=
		(
			Math.cos(Math.PI / 180 *this.roty) * 20*delta
		);		
		this.posx+=
		(
			Math.sin(Math.PI / 180 *this.roty) * 20*delta
		);		
	},
	moveLeft: function(delta){
		this.posz+=
		(
			Math.cos(Math.PI / 180 *(this.roty-90)) * 20*delta
		);		
		this.posx-=
		(
			Math.sin(Math.PI / 180 *(this.roty-90)) * 20*delta
		);		
	},
	moveRight: function(delta){
		this.posz+=
		(
			Math.cos(Math.PI / 180 *(this.roty+90)) * 20*delta
		);		
		this.posx-=
		(
			Math.sin(Math.PI / 180 *(this.roty+90)) * 20*delta
		);	
	},
	turnLeft: function(delta){
		this.roty-=(60*delta);		
	},
	turnRight: function(delta){
		this.roty+=(60*delta);
	},
	turnUp: function(delta){
		this.rotx-=(60*delta);		
	},
	turnDown: function(delta){
		this.rotx+=(60*delta);
	},
	moveUp: function(delta){
		this.posy-=(6*delta);		
	},
	moveDown: function(delta){
		this.posy+=(6*delta);
	},
	reset:function(){
		this.isReset=true;
	},
	//Reseteo la camara, estara haciendo mas pequeño los valores de los angulos hasta que llegue a 0.
	restart:function(){
		if(this.isReset){
			if (
				this.rotx>1||this.rotx<-1
				||
				this.roty>1||this.roty<-1
				){
				this.rotx-=this.rotx/20;
				this.roty-=this.roty/20;
			}
			else{
				this.isReset=false;
			}
		}

		if (this.rotx>=360)
			this.rotx-=360;
		else if (this.rotx<=-360)
			this.rotx+=360;
		
		if (this.roty>=360)
			this.roty-=360;
		else if (this.roty<=-360)
			this.roty+=360;
	},
	getPos(){
		var x= -this.posx;
		var y= -this.posy;
		var z= -this.posz;
		return {x,y,z};
	
	},
	setPos(x,y,z){
		this.posx=-x;
		this.posy=-y;
		this.posz=-z;
	}
};
