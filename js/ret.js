var Ret = function (mvMatrix,frames){

	this.mvMatrix = mvMatrix;
	this.frames = frames;
	this.current = 0
};



Ret.prototype = {
	giveFrame:function(){
		var old = this.current;
		this.current++;
		return old;
	},

	isFinish(){
		return this.current >= this.frames;
	},
};