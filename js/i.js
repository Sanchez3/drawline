// var LineGp = require('./LineGp');

var dl = {
    init: function(argument) {
        // body...
    },
    cssInit: function(argument) {
        // body...
    },
    eventInit: function(argument) {
        // body...
        var that = this;
        document.addEventListener('touchstart', function(e) {}, false);
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
        //禁止弹出选择菜单
        document.documentElement.style.webkitTouchCallout = "none";
        return that;
    },
    app: null,
    canvasInit: function(argument) {
        var that = this;
        var wh = window.innerHeight;
        var ww = window.innerWidth;
        //antialias抗齿锯, forceCanvas
        renderer = new PIXI.autoDetectRenderer({ width: ww, height: wh, transparent: false, antialias: true });
        document.getElementById('mcanvas').appendChild(renderer.view);
        renderer.autoResize = true;
        renderer.resize(window.innerWidth, window.innerHeight);

        var stage = new PIXI.Container();
        stage.x = 0;
        stage.y = 0;
        stage.interactive = true;

        var dContainer = new PIXI.Container();
        //pivot 是一个具体坐标点
        dContainer.pivot.x = ww / 2;
        dContainer.pivot.y = wh / 2;
        dContainer.x = ww / 2;
        dContainer.y = wh / 2;
        stage.addChild(dContainer);


        var lines = [];
        var flag = false;
        var oe;

        var centerGp = new PIXI.Graphics();

        centerGp.beginFill(0xffffff, 1);
        centerGp.drawRect(ww / 2 - 3, wh / 2 - 3, 6, 6);
        centerGp.endFill();
        // centerGp.rotation=45*Math.PI/180;
        centerGp.pivot.x = 0;
        centerGp.pivot.y = 0;
        dContainer.addChild(centerGp);

        var spot_num = 5;
        var spot_r = 360 / spot_num;

        // var s1Gp_opp=new LineGp(ww,wh/2,{x:-1,y:1},0,lines);
        // dContainer.addChild(boppGp);

        var lGp = new LineGp(ww / 2, wh / 2 - ww / 2, { x: 1, y: 1 }, 90, lines);
        dContainer.addChild(lGp);
        var loppGp = new LineGp(ww / 2, wh / 2 + ww / 2, { x: -1, y: 1 }, 90, lines);
        dContainer.addChild(loppGp);

        var rGp = new LineGp(ww / 2, wh / 2 - ww / 2, { x: 1, y: -1 }, 90, lines);
        dContainer.addChild(rGp);
        var roppGp = new LineGp(ww / 2, wh / 2 + ww / 2, { x: -1, y: -1 }, 90, lines);
        dContainer.addChild(roppGp);

        var tGp = new LineGp(0, wh / 2, { x: 1, y: -1 }, 0, lines);
        dContainer.addChild(tGp);
        var toppGp = new LineGp(ww, wh / 2, { x: -1, y: -1 }, 0, lines);
        dContainer.addChild(toppGp);

        var bGp = new LineGp(0, wh / 2, { x: 1, y: 1 }, 0, lines);
        dContainer.addChild(bGp);
        var boppGp = new LineGp(ww, wh / 2, { x: -1, y: 1 }, 0, lines);
        dContainer.addChild(boppGp);

        //blurFilter pixi  only in webgl
        // var blurFilter = new PIXI.filters.BlurFilter();
        // blurFilter.blur = 1;
        // dContainer.filters=[blurFilter];
        // console.log(dContainer.filters);


        var upflag = false;
        stage.on('pointerup', function(e) {
            if (upflag) return;
            upflag = true;
            var t = TweenLite.to(dContainer, 4, {
                rotation: 2 * Math.PI,
                ease: Linear.easeInOut,
                onComplete: function() {
                    this.restart();
                }
            });
        });

        stage.on('pointermove', function(e) {
            // body...
            if (upflag) return;
            oe = e.data.global;
            if (oe.x >= ww - 5) {
                oe.x = ww - 5;
            }
            if (oe.x <= 5) {
                oe.x = 5;
            }
            if (oe.y >= (wh / 2 + ww / 2 - 5)) {
                oe.y = wh / 2 + ww / 2 - 5;
            }
            if (oe.y <= wh / 2 + 5) {
                oe.y = wh / 2 + 5;
            }
            if (lines.length > 30) {
                lines.shift();
                lines.push({ x: oe.x, y: oe.y });

            } else {
                lines.push({ x: oe.x, y: oe.y });
            }

        });


        mLoop();

        function mLoop() {
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
dl.eventInit().canvasInit();