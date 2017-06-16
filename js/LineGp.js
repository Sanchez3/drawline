function LineGp(_x,_y,_scale,_r,line_data){
	PIXI.Graphics.call(this);
	this.scale.set(_scale.x,_scale.y);
	this.rotation=_r*Math.PI/180;
	this.x=_x;
	this.y=_y;

	// this.beginFill(0x00EEFF, 1);
	// this.drawRect(0, 0, window.innerWidth, window.innerHeight/2);
	// this.endFill();
	
	this.lineArray=line_data;
	this.wh=window.innerHeight;
	return this;
}

LineGp.prototype = Object.create(PIXI.Graphics.prototype);
LineGp.prototype.constructor=LineGp;
LineGp.prototype.drawLine=function(line_data){
	this.lineArray=line_data;
	if(this.lineArray.length>0){
		this.clear();
		this.lineStyle(1,0xFFFFFF,1);
		this.moveTo(this.lineArray[0].x,this.lineArray[0].y-this.wh/2);
		for (var i = 1; i < this.lineArray.length; i++) {
			this.lineTo(this.lineArray[i].x,this.lineArray[i].y-this.wh/2);
		}

	}
};
LineGp.prototype.resizeH=function(){
	this.wh=window.innerHeight;
};

// module.exports = LineGp;
