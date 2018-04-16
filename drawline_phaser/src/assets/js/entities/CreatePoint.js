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