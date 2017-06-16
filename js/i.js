
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
		//pivot 是一个具体坐标点
		dContainer.pivot.x=ww/2;
		dContainer.pivot.y=wh/2;
		dContainer.x=ww/2;
		dContainer.y=wh/2;
		stage.addChild(dContainer);


		var lines=[];
		var flag=false;
		var oe;

		var centerGp=new PIXI.Graphics();
		centerGp.lineStyle(8, 0xffffff, 1.0)
		centerGp.beginFill(0x000001, 1);
		centerGp.drawRect(ww/2-3, wh/2-3 ,200, 200);

		centerGp.endFill();
		//blurFilter bug  pixi
		var blurFilter = new PIXI.filters.BlurFilter();
		blurFilter.blur = 20;
		centerGp.filters=[blurFilter];
		centerGp.pivot.set(0.5,0.5);
		// centerGp.rotation=45*Math.PI/180;
		stage.addChild(centerGp);



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
			if(upflag) return;
			upflag=true;
			var t=TweenLite.to(dContainer,2,{rotation:+Math.PI,ease:Linear.easeInOut,onComplete:function(){
				this.restart();
			}});
			// dContainer.width=ww;
			// dContainer.height=ww;
			console.log(dContainer.pivot.x,dContainer.pivot.y);
			// dContainer.x=dContainer.width/2;
			// dContainer.y=dContainer.height/2;
			// dContainer.rotation+=90*Math.PI/180;


			// dContainer.scale.set(0.2);

		});

		hitGraphics.on('pointermove',function (e) {
			// body...
			if(upflag) return;
			// if(oe!==e.data.global){
				oe=e.data.global;
				// console.log(e.data.global.x);
				// alert(oe.x);
				if((oe.x<ww&&oe.x>0)&&(oe.y<(wh/2+ww/2)&&oe.y>wh/2)){
					if(lines.length>30) {
						lines.shift();
						lines.push({x:oe.x,y:oe.y});

					}else{
						lines.push({x:oe.x,y:oe.y});
					}
				}
				
			// }

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

