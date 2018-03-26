(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/sanchez/Work/test/drawline/src/assets/js/entities/CreatePoint.js":[function(require,module,exports){
/**
 * Created by Sanchez
 */
'use strict';
var LineGp = require('./LineGp');

/*
 添加起始点类         
 @x y 中心点
 @n 绘制点个数，总数n*2
 */

function CreatePoint(game, _x, _y, n) {
    this.n = n;
    this.lGp = [];
    this._x = _x;
    this._y = _y;
    var r = 360 / this.n;
    for (var i = 0; i < n; i++) {
        this.lGp[i] = new LineGp(game, _x, _y, r * i, { a: 1, b: 0, c: -_x });
        this.lGp[i].drawArea();
    }
}
CreatePoint.prototype.update = function(lines) {
    for (var i = this.lGp.length - 1; i >= 0; i--) {
        this.lGp[i].drawLine(lines);
    }
};

module.exports = CreatePoint;
},{"./LineGp":"/Users/sanchez/Work/test/drawline/src/assets/js/entities/LineGp.js"}],"/Users/sanchez/Work/test/drawline/src/assets/js/entities/LineGp.js":[function(require,module,exports){
/**
 * Created by Sanchez
 */
/*
 对称点绘制类         
 @x y 中心坐标
 @angle degrees 旋转角度     
 @l { a: 1, b: 0, c: -_x }  点关于直线对称，直线l方程ax+by+c=0,
 */

'use strict';

function LineGp(game, _x, _y, _angle, l) {
    this.game = game;

    this._x = _x;
    this._y = _y;
    this.l = l;
    this.wh = window.innerHeight;
    this.ww = window.innerWidth;
    Phaser.Sprite.call(this, this.game, this._x, this._y);
    this.anchor.setTo(0.5, 0);

    this.line = this.game.make.graphics(-this.ww / 2, 0);

    // this.line.angle = 0;
    this.addChild(this.line);
    this.lineArray = [];
    this.lineArraySym = [];
    this.angle = _angle;
    this.anchor.setTo(0.5);
    return this;
}

LineGp.prototype = Object.create(Phaser.Sprite.prototype);
LineGp.prototype.constructor = LineGp;
LineGp.prototype.drawArea = function() {
    this.line.beginFill(this.game.rnd.integerInRange(0x000000, 0xFFFFFF), 1);
    this.line.drawRect(0, 0, this.ww, this.ww / 2);
    this.line.endFill();
};

LineGp.prototype.drawLine = function(lines) {
    this.getPoints(lines);
    if (this.lineArray.length > 0) {
        this.line.clear();
        this.line.lineStyle(1.5, 0xFFFFFF, 1);
        this.line.moveTo(this.lineArray[0].x, this.lineArray[0].y - this.wh / 2);
        for (var i = 0; i < this.lineArray.length; i++) {
            this.line.lineTo(this.lineArray[i].x, this.lineArray[i].y - this.wh / 2);
        }
        this.line.beginFill(0xFFFFFF, 1);
        this.line.drawRect(this.lineArray[this.lineArray.length - 1].x - 3, this.lineArray[this.lineArray.length - 1].y - 3 - this.wh / 2, 6, 6);
        this.line.endFill();
        this.line.moveTo(this.lineArraySym[0].x, this.lineArraySym[0].y - this.wh / 2);
        for (var j = 0; j < this.lineArraySym.length; j++) {
            this.line.lineTo(this.lineArraySym[j].x, this.lineArraySym[j].y - this.wh / 2);
        }
        this.line.beginFill(0xFFFFFF, 1);
        this.line.drawRect(this.lineArraySym[this.lineArraySym.length - 1].x - 3, this.lineArraySym[this.lineArraySym.length - 1].y - 3 - this.wh / 2, 6, 6);
        this.line.endFill();
    }
};
LineGp.prototype.getPoints = function(lines) {
    var x0, y0;
    var a = this.l.a,
        b = this.l.b,
        c = this.l.c;
    this.lineArray = lines;
    for (var i = 0; i < lines.length; i++) {
        x0 = lines[i].x;
        y0 = lines[i].y;
        this.lineArraySym[i] = {
            x: ((b * b - a * a) * x0 - 2 * a * b * y0 - 2 * a * c) / (a * a + b * b),
            y: ((a * a - b * b) * y0 - 2 * a * b * x0 - 2 * b * c) / (a * a + b * b)
        };
    }
};
module.exports = LineGp;
},{}],"/Users/sanchez/Work/test/drawline/src/assets/js/main.js":[function(require,module,exports){
/**
 * Created by sanchez 
 */
'use strict';
var CreatePoint = require('./entities/CreatePoint');
var cp;
var pressed = false;
var oe = {};
var lines = [];
var wh = window.innerHeight;
var ww = window.innerWidth;
var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'mycanvas', {  create: create, update: update }, true);


function create() {
    game.input.maxPointers = 1;
    var dContainer = game.add.group();
    var centerGp = game.add.graphics(0, 0);
    centerGp.beginFill(0xffffff, 1);
    centerGp.drawRect(game.width / 2 - 3, game.height / 2 - 3, 6, 6);
    centerGp.endFill();
    dContainer.addChild(centerGp);
    cp = new CreatePoint(game, window.innerWidth / 2, window.innerHeight / 2, 9);

    for (var i = 0; i < cp.lGp.length; i++) {
        dContainer.addChild(cp.lGp[i]);
    }
    
 
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

function update() {
}

function showStats() {
    var stats = new Stats();
    stats.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom
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
},{"./entities/CreatePoint":"/Users/sanchez/Work/test/drawline/src/assets/js/entities/CreatePoint.js"}]},{},["/Users/sanchez/Work/test/drawline/src/assets/js/main.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXNzZXRzL2pzL2VudGl0aWVzL0NyZWF0ZVBvaW50LmpzIiwic3JjL2Fzc2V0cy9qcy9lbnRpdGllcy9MaW5lR3AuanMiLCJzcmMvYXNzZXRzL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBTYW5jaGV6XG4gKi9cbid1c2Ugc3RyaWN0JztcbnZhciBMaW5lR3AgPSByZXF1aXJlKCcuL0xpbmVHcCcpO1xuXG4vKlxuIOa3u+WKoOi1t+Wni+eCueexuyAgICAgICAgIFxuIEB4IHkg5Lit5b+D54K5XG4gQG4g57uY5Yi254K55Liq5pWw77yM5oC75pWwbioyXG4gKi9cblxuZnVuY3Rpb24gQ3JlYXRlUG9pbnQoZ2FtZSwgX3gsIF95LCBuKSB7XG4gICAgdGhpcy5uID0gbjtcbiAgICB0aGlzLmxHcCA9IFtdO1xuICAgIHRoaXMuX3ggPSBfeDtcbiAgICB0aGlzLl95ID0gX3k7XG4gICAgdmFyIHIgPSAzNjAgLyB0aGlzLm47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgdGhpcy5sR3BbaV0gPSBuZXcgTGluZUdwKGdhbWUsIF94LCBfeSwgciAqIGksIHsgYTogMSwgYjogMCwgYzogLV94IH0pO1xuICAgICAgICB0aGlzLmxHcFtpXS5kcmF3QXJlYSgpO1xuICAgIH1cbn1cbkNyZWF0ZVBvaW50LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihsaW5lcykge1xuICAgIGZvciAodmFyIGkgPSB0aGlzLmxHcC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB0aGlzLmxHcFtpXS5kcmF3TGluZShsaW5lcyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDcmVhdGVQb2ludDsiLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuY2hlelxuICovXG4vKlxuIOWvueensOeCuee7mOWItuexuyAgICAgICAgIFxuIEB4IHkg5Lit5b+D5Z2Q5qCHXG4gQGFuZ2xlIGRlZ3JlZXMg5peL6L2s6KeS5bqmICAgICBcbiBAbCB7IGE6IDEsIGI6IDAsIGM6IC1feCB9ICDngrnlhbPkuo7nm7Tnur/lr7nnp7DvvIznm7Tnur9s5pa556iLYXgrYnkrYz0wLFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gTGluZUdwKGdhbWUsIF94LCBfeSwgX2FuZ2xlLCBsKSB7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcblxuICAgIHRoaXMuX3ggPSBfeDtcbiAgICB0aGlzLl95ID0gX3k7XG4gICAgdGhpcy5sID0gbDtcbiAgICB0aGlzLndoID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMud3cgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBQaGFzZXIuU3ByaXRlLmNhbGwodGhpcywgdGhpcy5nYW1lLCB0aGlzLl94LCB0aGlzLl95KTtcbiAgICB0aGlzLmFuY2hvci5zZXRUbygwLjUsIDApO1xuXG4gICAgdGhpcy5saW5lID0gdGhpcy5nYW1lLm1ha2UuZ3JhcGhpY3MoLXRoaXMud3cgLyAyLCAwKTtcblxuICAgIC8vIHRoaXMubGluZS5hbmdsZSA9IDA7XG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxpbmUpO1xuICAgIHRoaXMubGluZUFycmF5ID0gW107XG4gICAgdGhpcy5saW5lQXJyYXlTeW0gPSBbXTtcbiAgICB0aGlzLmFuZ2xlID0gX2FuZ2xlO1xuICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbkxpbmVHcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKTtcbkxpbmVHcC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMaW5lR3A7XG5MaW5lR3AucHJvdG90eXBlLmRyYXdBcmVhID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5saW5lLmJlZ2luRmlsbCh0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKDB4MDAwMDAwLCAweEZGRkZGRiksIDEpO1xuICAgIHRoaXMubGluZS5kcmF3UmVjdCgwLCAwLCB0aGlzLnd3LCB0aGlzLnd3IC8gMik7XG4gICAgdGhpcy5saW5lLmVuZEZpbGwoKTtcbn07XG5MaW5lR3AucHJvdG90eXBlLmRyYXdHbGFzcyA9IGZ1bmN0aW9uKGxpbmVzKSB7XG4gICAgdGhpcy5nZXRQb2ludHMobGluZXMpO1xuXG4gICAgdGhpcy5ibWQuZHJhdyh0aGlzLmdsYXNzLCBsaW5lc1swXS54LCBsaW5lc1swXS55LCBudWxsLCBudWxsLCAnZGVzdGluYXRpb24tb3V0Jyk7XG5cblxufTtcblxuTGluZUdwLnByb3RvdHlwZS5kcmF3TGluZSA9IGZ1bmN0aW9uKGxpbmVzKSB7XG4gICAgdGhpcy5nZXRQb2ludHMobGluZXMpO1xuICAgIGlmICh0aGlzLmxpbmVBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMubGluZS5jbGVhcigpO1xuICAgICAgICB0aGlzLmxpbmUubGluZVN0eWxlKDEuNSwgMHhGRkZGRkYsIDEpO1xuICAgICAgICB0aGlzLmxpbmUubW92ZVRvKHRoaXMubGluZUFycmF5WzBdLngsIHRoaXMubGluZUFycmF5WzBdLnkgLSB0aGlzLndoIC8gMik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saW5lQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubGluZS5saW5lVG8odGhpcy5saW5lQXJyYXlbaV0ueCwgdGhpcy5saW5lQXJyYXlbaV0ueSAtIHRoaXMud2ggLyAyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpbmUuYmVnaW5GaWxsKDB4RkZGRkZGLCAxKTtcbiAgICAgICAgdGhpcy5saW5lLmRyYXdSZWN0KHRoaXMubGluZUFycmF5W3RoaXMubGluZUFycmF5Lmxlbmd0aCAtIDFdLnggLSAzLCB0aGlzLmxpbmVBcnJheVt0aGlzLmxpbmVBcnJheS5sZW5ndGggLSAxXS55IC0gMyAtIHRoaXMud2ggLyAyLCA2LCA2KTtcbiAgICAgICAgdGhpcy5saW5lLmVuZEZpbGwoKTtcbiAgICAgICAgdGhpcy5saW5lLm1vdmVUbyh0aGlzLmxpbmVBcnJheVN5bVswXS54LCB0aGlzLmxpbmVBcnJheVN5bVswXS55IC0gdGhpcy53aCAvIDIpO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubGluZUFycmF5U3ltLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmUubGluZVRvKHRoaXMubGluZUFycmF5U3ltW2pdLngsIHRoaXMubGluZUFycmF5U3ltW2pdLnkgLSB0aGlzLndoIC8gMik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saW5lLmJlZ2luRmlsbCgweEZGRkZGRiwgMSk7XG4gICAgICAgIHRoaXMubGluZS5kcmF3UmVjdCh0aGlzLmxpbmVBcnJheVN5bVt0aGlzLmxpbmVBcnJheVN5bS5sZW5ndGggLSAxXS54IC0gMywgdGhpcy5saW5lQXJyYXlTeW1bdGhpcy5saW5lQXJyYXlTeW0ubGVuZ3RoIC0gMV0ueSAtIDMgLSB0aGlzLndoIC8gMiwgNiwgNik7XG4gICAgICAgIHRoaXMubGluZS5lbmRGaWxsKCk7XG4gICAgfVxufTtcbkxpbmVHcC5wcm90b3R5cGUuZ2V0UG9pbnRzID0gZnVuY3Rpb24obGluZXMpIHtcbiAgICB2YXIgeDAsIHkwO1xuICAgIHZhciBhID0gdGhpcy5sLmEsXG4gICAgICAgIGIgPSB0aGlzLmwuYixcbiAgICAgICAgYyA9IHRoaXMubC5jO1xuICAgIHRoaXMubGluZUFycmF5ID0gbGluZXM7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB4MCA9IGxpbmVzW2ldLng7XG4gICAgICAgIHkwID0gbGluZXNbaV0ueTtcbiAgICAgICAgdGhpcy5saW5lQXJyYXlTeW1baV0gPSB7XG4gICAgICAgICAgICB4OiAoKGIgKiBiIC0gYSAqIGEpICogeDAgLSAyICogYSAqIGIgKiB5MCAtIDIgKiBhICogYykgLyAoYSAqIGEgKyBiICogYiksXG4gICAgICAgICAgICB5OiAoKGEgKiBhIC0gYiAqIGIpICogeTAgLSAyICogYSAqIGIgKiB4MCAtIDIgKiBiICogYykgLyAoYSAqIGEgKyBiICogYilcbiAgICAgICAgfTtcbiAgICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBMaW5lR3A7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHNhbmNoZXogXG4gKi9cbid1c2Ugc3RyaWN0JztcbnZhciBDcmVhdGVQb2ludCA9IHJlcXVpcmUoJy4vZW50aXRpZXMvQ3JlYXRlUG9pbnQnKTtcbnZhciBjcDtcbnZhciBwcmVzc2VkID0gZmFsc2U7XG52YXIgb2UgPSB7fTtcbnZhciBsaW5lcyA9IFtdO1xudmFyIHdoID0gd2luZG93LmlubmVySGVpZ2h0O1xudmFyIHd3ID0gd2luZG93LmlubmVyV2lkdGg7XG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSgnMTAwJywgJzEwMCcsIFBoYXNlci5XRUJHTCwgJ215Y2FudmFzJywgeyAgY3JlYXRlOiBjcmVhdGUsIHVwZGF0ZTogdXBkYXRlIH0sIHRydWUpO1xuXG5mdW5jdGlvbiBwcmVsb2FkKCkge1xuICAgIGdhbWUubG9hZC5pbWFnZSgnZ2xhc3MnLCAnLi4vYXNzZXRzL2ltZy9nbGFzcy5wbmcnKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKCkge1xuICAgIGdhbWUuaW5wdXQubWF4UG9pbnRlcnMgPSAxO1xuICAgIHZhciBkQ29udGFpbmVyID0gZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB2YXIgY2VudGVyR3AgPSBnYW1lLmFkZC5ncmFwaGljcygwLCAwKTtcbiAgICBjZW50ZXJHcC5iZWdpbkZpbGwoMHhmZmZmZmYsIDEpO1xuICAgIGNlbnRlckdwLmRyYXdSZWN0KGdhbWUud2lkdGggLyAyIC0gMywgZ2FtZS5oZWlnaHQgLyAyIC0gMywgNiwgNik7XG4gICAgY2VudGVyR3AuZW5kRmlsbCgpO1xuICAgIGRDb250YWluZXIuYWRkQ2hpbGQoY2VudGVyR3ApO1xuICAgIGNwID0gbmV3IENyZWF0ZVBvaW50KGdhbWUsIHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMiwgOSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNwLmxHcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBkQ29udGFpbmVyLmFkZENoaWxkKGNwLmxHcFtpXSk7XG4gICAgfVxuICAgIFxuIFxuICAgIGdhbWUuaW5wdXQub25Eb3duLmFkZCh0YXAsIHRoaXMpO1xuICAgIGdhbWUuaW5wdXQub25VcC5hZGQocmVsZWFzZSwgdGhpcyk7XG4gICAgZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2soZHJhZywgdGhpcyk7XG59XG5cblxuZnVuY3Rpb24gdGFwKCkge1xuICAgIHByZXNzZWQgPSB0cnVlO1xuXG59XG5cbmZ1bmN0aW9uIGRyYWcocG9pbnRlciwgeCwgeSkge1xuICAgIGlmIChwcmVzc2VkKSB7XG4gICAgICAgIG9lLnggPSBnYW1lLmlucHV0Lng7XG4gICAgICAgIG9lLnkgPSBnYW1lLmlucHV0Lnk7XG4gICAgICAgIGlmIChvZS54ID49IHd3IC0gNSkge1xuICAgICAgICAgICAgb2UueCA9IHd3IC0gNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2UueCA8PSA1KSB7XG4gICAgICAgICAgICBvZS54ID0gNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2UueSA+PSAod2ggLyAyICsgd3cgLyAyIC0gNSkpIHtcbiAgICAgICAgICAgIG9lLnkgPSB3aCAvIDIgKyB3dyAvIDIgLSA1O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvZS55IDw9IHdoIC8gMiArIDUpIHtcbiAgICAgICAgICAgIG9lLnkgPSB3aCAvIDIgKyA1O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA+IDMwKSB7XG4gICAgICAgICAgICBsaW5lcy5zaGlmdCgpO1xuICAgICAgICAgICAgbGluZXMucHVzaCh7IHg6IG9lLngsIHk6IG9lLnkgfSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goeyB4OiBvZS54LCB5OiBvZS55IH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNwKTtcbiAgICAgICAgY3AudXBkYXRlKGxpbmVzKTtcbiAgICAgICAgLy8gY3AuZHJhdyhsaW5lcyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZWxlYXNlKCkge1xuICAgIHByZXNzZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKCkge1xufVxuXG5mdW5jdGlvbiBzaG93U3RhdHMoKSB7XG4gICAgdmFyIHN0YXRzID0gbmV3IFN0YXRzKCk7XG4gICAgc3RhdHMuc2hvd1BhbmVsKDIpOyAvLyAwOiBmcHMsIDE6IG1zLCAyOiBtYiwgMys6IGN1c3RvbVxuICAgIHZhciBmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGZzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBmcy5zdHlsZS5sZWZ0ID0gMDtcbiAgICBmcy5zdHlsZS50b3AgPSAwO1xuICAgIGZzLnN0eWxlLnpJbmRleCA9IDk5OTtcbiAgICBmcy5hcHBlbmRDaGlsZChzdGF0cy5kb21FbGVtZW50KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZzKTtcblxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgICAgIHN0YXRzLmJlZ2luKCk7XG4gICAgICAgIC8vIG1vbml0b3JlZCBjb2RlIGdvZXMgaGVyZVxuICAgICAgICBzdGF0cy5lbmQoKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG5zaG93U3RhdHMoKTsiXX0=
