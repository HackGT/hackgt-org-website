var s = Snap('#hexagon');
var canvasDiv = document.getElementById("hexagon");

var width = height = null;
updateWidthAndHeight(canvasDiv);

var center = {x: width / 2, y: height / 2};
var hexagonRadius = Math.min(width/2, height/2);
var gradient = s.gradient("l(0,0,1,0)#4AC8EF-#8B54A2");
var offsets = [28, 30, 34];
var durations = [10000, 9800, 8500];

var hexagons = [];

function init() {
    for (var i = 0; i < hexagons.length; i++) {
        var hex = hexagons[i];
        hex.remove();
    }

    hexagons = [];

    for (var i = 0; i < offsets.length; i++) {
        var hex = createHexagon(offsets[i]);
        hexagons.push(hex);
    }

    for (var i = 0; i < hexagons.length; i++) {
        rotate(hexagons[i], durations[i]);
    }
}

function createHexagon(offset) {

    var vertices = [];

    for (var i = 0; i < 6; i++) {
        var angle = (360 / 6) * i + offset;
        var vector = add(scalarMultiply(angleToUnitVector(angle), hexagonRadius), center);

        vertices = vertices.concat([vector.x, vector.y]);
    }

    var polygon = s.polygon(vertices);

    polygon.attr({
        stroke: gradient,
        strokeWidth: 1,
        fill: "none"
    });

    return polygon;
}

function rotate(el, duration) {
    Snap.animate(0, 360, function(val) {
        el.transform('r' + val + ',' + center.x + ',' + center.y )
    }, duration, mina.linear, rotate.bind(null, el, duration));
}

function onResize(e) {
    updateWidthAndHeight(canvasDiv);
    center = {x: width / 2, y: height / 2};
    hexagonRadius = Math.min(width/2, height/2);
    init();
}

window.onresize = onResize;
init();