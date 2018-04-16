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

    this.bmd = this.game.add.bitmapData(this.game.width, this.game.height);
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
LineGp.prototype.drawGradientLine = function(lines) {
    var grd = this.bmd.context.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop("0", "magenta");
    grd.addColorStop("0.5", "blue");
    grd.addColorStop("1.0", "red");
    var ctx = this.bmd.context;
    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.lineTo(31, 12);
    ctx.lineTo(10, 32);
    ctx.strokeStyle = grd;
    ctx.stroke();


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