var Bullet = function ( pos, raw, pitch, roll,type,distance){

	if (type=="BALA"){
		var r = (Math.random() * distance) - (distance/2);
		this.raw = raw + r;
		r = (Math.random() * distance) - (distance/2);
		this.pitch = pitch + r;
		r = (Math.random() * distance) - (distance/2);
		this.roll = roll+90 + r;
		this.pos = {
			x : pos[0],
			y : pos[1],
			z : pos[2],
		};

		this.vect = 0;
		this.vel = 400;
		this.rect = new RectangleF(10,3,3);
	} else if (type=="BOLA"){
		var r = (Math.random() * 10) - 5;
		this.raw = raw + r;
		r = (Math.random() * 10) - 5;
		this.pitch = pitch + r;
		r = (Math.random() * 10) - 5;
		this.roll = roll+100 + r;
		this.pos = {
			x : pos[0],
			y : pos[1],
			z : pos[2],
		};
		this.vect = 0;
		this.vel = 150;
		this.distance = distance;
		this.rect = new RectangleF(6,6,6);
	} else {
		this.raw = 0;
		this.pitch = 0;
		this.roll = 0;
		this.pos = {
			x : 0,
			y : 0,
			z : 0,
		};		
		this.vect = 0;
		this.vel = 300;
		this.rect = new RectangleF(10,3,3);
	} 
	
};

Bullet.prototype = {
	
	run:function(deltaTime){
		
		/*
		pos += D3DXVECTOR3(
			sin(D3DXToRadian(raw))*sin(D3DXToRadian(pitch))*300,
			cos(D3DXToRadian(raw))*300,
			sin(D3DXToRadian(raw))*cos(D3DXToRadian(pitch))*300
			);
		*/
		var roll = this.roll;
		var pitch = this.pitch;
		var mov = this.vel*deltaTime;
		this.vect+=mov;
		this.pos.x += Math.sin(Math.PI / 180 *(roll)) * Math.sin(Math.PI / 180 *pitch)*mov;
		this.pos.y -= Math.cos(Math.PI / 180 *(roll))*mov;
		this.pos.z += Math.sin(Math.PI / 180 *(roll)) * Math.cos(Math.PI / 180 *pitch)*mov;
		this.rect.update([this.pos.x,this.pos.y,this.pos.z],[this.raw,this.pitch-90,this.roll+90]);
	},

	launch:function(deltaTime){

		var dt = (deltaTime*4000)/this.distance;
		
		this.roll = this.roll > 0 ? this.roll - dt : this.roll < -1 ? this.roll + dt : 0;  

		var roll = this.roll;
		var pitch = this.pitch;
		var mov = this.vel*deltaTime;
		this.vect+=mov;
		this.pos.x += Math.sin(Math.PI / 180 *(roll)) * Math.sin(Math.PI / 180 *pitch)*mov;
		this.pos.y -= Math.cos(Math.PI / 180 *(roll))*mov;
		this.pos.z += Math.sin(Math.PI / 180 *(roll)) * Math.cos(Math.PI / 180 *pitch)*mov;
		this.rect.update([this.pos.x,this.pos.y,this.pos.z],[this.raw,this.pitch-90,this.roll+90]);
	},

	getMV(){
		var px = this.pos.x;
		var py = this.pos.y;
		var pz = this.pos.z;
		var rx = this.raw;
		var ry = this.pitch;
		var rz = this.roll;
		return{px,py,pz,rx,ry,rz};
	},
	getMatrix(){
		var mvMatrix = mat4.create();	
		mat4.translate(mvMatrix, mvMatrix, [this.pos.x, this.pos.y, this.pos.z]);                	
		return mvMatrix;
	},
	getPos(){
		var px = this.pos.x;
		var py = this.pos.y;
		var pz = this.pos.z;
		return[px,py,pz];
	},
};

