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