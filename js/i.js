
// var LineGp = require('./LineGp');

var dl={
	init:function (argument) {
		// body...
	},
	cssInit:function (argument) {
		// body...
	},
	eventInit:function (argument) {
		// body...
	},
	app:null,
	canvasInit:function(argument){
		var that=this;
		var wh=window.innerHeight;
		var ww=window.innerWidth;
		renderer=new PIXI.autoDetectRenderer({width:ww,height:wh,transparent:false,forceCanvas:true});
		document.getElementById('mcanvas').appendChild(renderer.view);


		renderer.autoResize = true;
		renderer.resize(window.innerWidth, window.innerHeight);

		var stage=new PIXI.Container();
		stage.x=0;
		stage.y=0;



		var hitGraphics= new PIXI.Graphics();
		hitGraphics.y=wh/2;
		hitGraphics.beginFill(0x0000FF, 1);
		hitGraphics.drawRect(0, 0, ww, ww/2);
		hitGraphics.endFill();
		hitGraphics.interactive=true;
		// hitGraphics.hitArea=new PIXI.Rectangle(0, wh/2, ww, wh/2)
		stage.addChild(hitGraphics);


		var dContainer=new PIXI.Container();
		dContainer.x=0;
		dContainer.y=0;
		stage.addChild(dContainer);


		var lines=[];
		var flag=false;
		var oe;

		var centerGp=new PIXI.Graphics();

		centerGp.beginFill(0xFFFFFF, 1);
		centerGp.drawRect(ww/2-3, wh/2-3 ,6, 6);
		centerGp.pivot.set(0.5,0.5);
		// centerGp.rotation=45*Math.PI/180;
		centerGp.endFill();
		dContainer.addChild(centerGp);


		var lGp=new LineGp(ww/2,wh/2-ww/2,{x:1,y:1},90,lines);
		dContainer.addChild(lGp);
		var loppGp=new LineGp(ww/2,wh/2+ww/2,{x:-1,y:1},90,lines);
		dContainer.addChild(loppGp);
		var rGp=new LineGp(ww/2,wh/2-ww/2,{x:1,y:-1},90,lines);
		dContainer.addChild(rGp);
		var roppGp=new LineGp(ww/2,wh/2+ww/2,{x:-1,y:-1},90,lines);
		dContainer.addChild(roppGp);


		var tGp=new LineGp(0,wh/2,{x:1,y:-1},0,lines);
		dContainer.addChild(tGp);
		var toppGp=new LineGp(ww,wh/2,{x:-1,y:-1},0,lines);
		dContainer.addChild(toppGp);


		var bGp=new LineGp(0,wh/2,{x:1,y:1},0,lines);
		dContainer.addChild(bGp);
		var boppGp=new LineGp(ww,wh/2,{x:-1,y:1},0,lines);
		dContainer.addChild(boppGp);


		var upflag=false;
		hitGraphics.on('pointerup',function(e){

			upflag=true;

		});

		hitGraphics.on('pointermove',function (e) {
			// body...
			if(upflag) return;
			if(oe!==e.data.originalEvent){
				oe=e.data.originalEvent;
				console.log(oe.globalX,oe.globalY);
				if((oe.globalX<ww&&oe.globalX>0)&&(oe.globalY<(wh/2+ww/2)&&oe.globalY>wh/2)){
					if(lines.length>30) {
						lines.shift();
						lines.push({x:oe.globalX,y:oe.globalY});

					}else{
						lines.push({x:oe.globalX,y:oe.globalY});
					}
				}
				
			}

		});

		
		mLoop();
		function mLoop(){
			requestAnimationFrame(mLoop);
			lGp.drawLine(lines);
			loppGp.drawLine(lines);

			roppGp.drawLine(lines);
			rGp.drawLine(lines);

			tGp.drawLine(lines);
			toppGp.drawLine(lines);

			boppGp.drawLine(lines);
			bGp.drawLine(lines);

			renderer.render(stage);
		}

		
	}
};
dl.canvasInit();

