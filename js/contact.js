var s = Snap('#hexagon');
var canvasDiv = document.getElementById("hexagon");

var width = height = null;
updateWidthAndHeight(canvasDiv);

var center = {x: width / 2, y: height / 2};
var hexagonRadius = Math.min(width/2, height/2);
var gradient = s.gradient("l(0,0,1,0)#4AC8EF-#8B54A2");
var numHexagons = 3;
var offsets = [-2, 0, 4];
var durations = [10000, 9800, 8500];

var hexagons = [];

function init() {
    for (var i = 0; i < hexagons.length; i++) {
        var hex = hexagons[i];
        hex.remove();
    }

    hexagons = [];
    createHexagons();
}

function createHexagons() {
    Snap.load('/assets/round-hex.svg', function(loadedFragment) {
        var hex = loadedFragment.select("#Polygon");
        hex.attr({
            stroke: gradient,
            strokeWidth: 1,
            fill: "none"
        });

        var bbox = hex.getBBox();
        
        for (var i = 0; i < offsets.length; i++) {
            var curr = hex.clone();
            s.append(curr);
            hexagons.push(curr);
            rotate(curr, durations[i], offsets[i], bbox);
        }
    });
}

function rotate(el, duration, offset, bbox) {
    var dx = center.x - bbox.cx;
    var dy = center.y - bbox.cy;
    var scaleAmount = Math.min(width, height) / ( Math.max(bbox.w, bbox.h) + 10);

    Snap.animate(0, 360, function(val) {
        el.transform(`s${scaleAmount},${scaleAmount}T${dx},${dy}r${val + offset},${bbox.cx},${bbox.cy}`);
    }, duration, mina.linear, rotate.bind(null, el, duration, offset, bbox));
}

function onResize(e) {
    updateWidthAndHeight(canvasDiv);
    center = {x: width / 2, y: height / 2};
    hexagonRadius = Math.min(width/2, height/2);
    init();
}

window.onresize = onResize;
init();