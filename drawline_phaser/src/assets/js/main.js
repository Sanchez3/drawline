'use strict';

var CreatePoint = require('./entities/CreatePoint');
var cp;
var pressed = false;
var oe = {};
var lines = [];
var wh = window.innerHeight;
var ww = window.innerWidth;
var config = {
    'width': '100',
    'height': '100',
    'render': Phaser.CANVAS,
    'parent': 'canvas-wrapper',
    'resolution': window.devicePixelRatio,
    'transparent': true,
    state: {
        create: create,
        update: update
    }
}
var game = new Phaser.Game(config);

function hsltorgb(h, s, l) {
    var h = h / 360;
    var s = s / 100;
    var l = l / 100;
    var rgb = [];
    if (s == 0) {
        rgb = [Math.round(l * 255), Math.round(l * 255), Math.round(l * 255)];
    } else {
        var q = l >= 0.5 ? (l + s - l * s) : (l * (1 + s));
        var p = 2 * l - q;
        var tr = rgb[0] = h + 1 / 3;
        var tg = rgb[1] = h;
        var tb = rgb[2] = h - 1 / 3;
        for (var i = 0; i < rgb.length; i++) {
            var tc = rgb[i];
            if (tc < 0) {
                tc = tc + 1;
            } else if (tc > 1) {
                tc = tc - 1;
            }
            switch (true) {
                case (tc < (1 / 6)):
                    tc = p + (q - p) * 6 * tc;
                    break;
                case ((1 / 6) <= tc && tc < 0.5):
                    tc = q;
                    break;
                case (0.5 <= tc && tc < (2 / 3)):
                    tc = p + (q - p) * (4 - 6 * tc);
                    break;
                default:
                    tc = p;
                    break;
            }
            rgb[i] = Math.round(tc * 255);
        }
    }

    return rgb;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function create() {
    game.input.maxPointers = 1;
    var dContainer = game.add.group();
    var centerGp = game.add.graphics(0, 0);
    centerGp.beginFill(0xffffff, 1);
    centerGp.drawRect(game.width / 2 - 3, game.height / 2 - 3, 6, 6);
    centerGp.endFill();
    dContainer.addChild(centerGp);
    cp = new CreatePoint(game, window.innerWidth / 2, window.innerHeight / 2, 7);

    for (var i = 0; i < cp.lGp.length; i++) {
        dContainer.addChild(cp.lGp[i]);
    }
    window.l = { h: 0, hsl: 'hsl(' + this.h + ',90%,50%)', hex: 0x000000, rgb: [0, 0, 0] }

    TweenMax.to(window.l, 5, {
        h: 360,
        yoyo: true,
        repeat: -1,
        onUpdate: function () {
            window.l.rbg = hsltorgb(window.l.h, 90, 50);
            window.l.hex = rgbToHex(window.l.rbg[0], window.l.rbg[1], window.l.rbg[2])
        }
    })


    // var bmd=game.add.bitmapData(game.width, game.height);
    // var grd = bmd.context.createLinearGradient(0, 0, 170, 0);
    // grd.addColorStop("0", "magenta");
    // grd.addColorStop("0.5", "blue");
    // grd.addColorStop("1.0", "red");
    // var ctx = bmd.ctx;
    // ctx.beginPath();
    // ctx.moveTo(game.width / 2, game.height / 2);
    // ctx.lineTo(31, 12);
    // ctx.lineTo(10, 32);
    // ctx.strokeStyle = grd;
    // ctx.stroke();
    // ctx.closePath();
    // bmd.addToWorld()
    // var sprite = game.add.sprite(0, 0, bmd); 

    game.input.onDown.add(tap, this);
    game.input.onUp.add(release, this);
    game.input.addMoveCallback(drag, this);
}


function tap() {
    pressed = true;

}

function drag(pointer, x, y) {
    if (pressed) {
        oe.x = game.input.x;
        oe.y = game.input.y;
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
        // console.log(cp);
        cp.update(lines);
        // cp.draw(lines);
    }
}

function release() {
    pressed = false;
}

function update() {}

function showStats() {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    var fs = document.createElement('div');
    fs.style.position = 'absolute';
    fs.style.left = 0;
    fs.style.top = 0;
    fs.style.zIndex = 999;
    fs.appendChild(stats.domElement);
    document.body.appendChild(fs);

    function animate() {
        stats.begin();
        // monitored code goes here
        stats.end();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
showStats();