var s = Snap('#canvas');
var animationInterval = null;

var canvasDiv = document.getElementById('canvas');

var translate = document.getElementById('translate');
var rotate = document.getElementById('rotate');
var reverse = document.getElementById('reverse');

var width = height = null;

updateWidthAndHeight(canvasDiv);

// var radiusMinRatio = 8;
// var radiusMaxRatio = 2;
var radiusMinRatio = 3;
var radiusMaxRatio = 1.2;

var radiusMin = Math.max(width / radiusMinRatio, height / radiusMinRatio);

var radiusMax = Math.min(width / radiusMaxRatio, height / radiusMaxRatio);

var center = {x: width / 2, y: height / 2};

var numHexagons = 15;
var hexagonMinSize = 10;
var hexagonMaxSize = 20;
var brightestHexagonColor = [126, 193, 230];
var darkestHexagonColor = [51, 139, 166];

var hexagons = [];

var timer = 0;
var scrollAmount = 0;

var fps = 80;
var intervalSpeed = 1000/fps;
// var baseDeltaT = 0.02;
// var deltaDeltaT = -0.02;

var baseDeltaT = 0.005;
var deltaDeltaT = -0.005;

var shadow = s.filter(Snap.filter.shadow(0,0,8,"#dddddd",0.9));

// the shadows actually skullfuck your battery life, so probs not gonna use them bc my fan get so loud
var useFilters = false;

init();
setTimeout(() => {
    onResize();
}, 100);

window.onwheel = onWheel;
var parentContainer = document.body;

function computeOvalPosition(a, b, t, rotation) {
    // rotation in degrees
    var rotationRad = Math.PI * rotation / 180.0;

    var cosRotation = Math.cos(rotationRad);
    var sinRotation = Math.sin(rotationRad);

    var x = Math.cos(t);
    var y = Math.sin(t);

    return {
        x: a * x * cosRotation - b * y * sinRotation,
        y: a * x * sinRotation - b * y * cosRotation
    };

}

function animateValence() {

    // apply a polynomial with degree < 1 to linger in the higher half of the range of 0-1 for longer
    // in order to make effects more visible sooner while maintaining interval of 0 to 1
    var easedOutScrollAmount = Math.pow(scrollAmount, 1/4);
    var axisScale = (1 + Math.pow(scrollAmount, 0.9) / 1.2);

    for (var i = 0; i < hexagons.length; i++) {
        var hexagon = hexagons[i];

        var a = parseFloat(hexagon.attr('a')) * axisScale;
        var b = parseFloat(hexagon.attr('b')) * axisScale;
        var t0 = parseFloat(hexagon.attr('t0'));
        var rotation = parseFloat(hexagon.attr('rotation'));

        // some pseudo-random-hash stuff to generate a more random orientation than i % 2 == 0
        var orientation = parseInt(((i + 0.4) / 7.3).toString(16).charAt(3), 16) < (8) ? 1 : -1;

        var currentT = timer * orientation + t0;

        var newTranslation = computeOvalPosition(a, b, currentT, rotation);

        var newRotation = 'r' + (currentT * 16);

        hexagon.transform(newRotation + toTranslation(newTranslation));

        useFilters && hexagon.attr({filter: shadow});
    }

    timer += (baseDeltaT + easedOutScrollAmount * deltaDeltaT);
    animationInterval = window.requestAnimationFrame(animateValence);
}

function updateScrollAmount() {
    // scrollAmount = Math.max(parentContainer.scrollTop / parentContainer.clientHeight, 0);
}

function onResize(e) {

    updateWidthAndHeight(canvasDiv);

    radiusMin = Math.max(width / radiusMinRatio, height / radiusMinRatio);

    radiusMax = Math.min(width / radiusMaxRatio, height / radiusMaxRatio);

    center = {x: width / 2, y: height / 2};

    updateScrollAmount();
    init();
}

window.onresize = onResize;

function onWheel(e) {

    updateScrollAmount()
}

function emptyCanvas() {
    for (var i = hexagons.length - 1; i >= 0; i--){
        var hexagon = hexagons[i];
        hexagon.remove();
    }

    hexagons = [];
}

function init() {
    
    if (s) {
        // s = null;
        // document.getElementById('canvas').innerHTML = '';
        emptyCanvas();

    }

    for (var i = 0; i < numHexagons; i++) {
        
        var radius = Math.random() * (hexagonMaxSize - hexagonMinSize) + hexagonMinSize;

        var scaleAmount = (radius - hexagonMinSize) / (hexagonMaxSize - hexagonMinSize);

        var t0 = Math.PI  * Math.random();
        var rotation = i / numHexagons * 360;

        var a = (Math.random() * (radiusMax - radiusMin) + radiusMin);
        var b = Math.pow(a, 0.9);

        var startingPoint = computeOvalPosition(a, b, t0, rotation);

        var hexagon = createNormalPolygon(radius);

        hexagon.transform(toTranslation(startingPoint));

        var hexagonColorArray = brightestHexagonColor.map(function(e, i) {
            return parseInt(Math.abs(brightestHexagonColor[i] - darkestHexagonColor[i]) * scaleAmount + darkestHexagonColor[i]);
        })

        var hexagonColor = arrayToRGB(hexagonColorArray);

        hexagon.attr({
            a: a, b: b, t0: t0, rotation: rotation, fill: hexagonColor
        });

        hexagons.push(hexagon);
    }

    if (animationInterval) {
        window.cancelAnimationFrame(animationInterval);
    }
    animationInterval = window.requestAnimationFrame(animateValence);
}

function createNormalPolygon(radius, degree) {
    if (!radius) {
        radius = 20;
    }

    if (!degree) {
        degree = 6;
    }

    var vertices = [];

    for (var i = 0; i < degree; i++) {
        var angle = (360 / degree) * i;

        var vector = add(scalarMultiply(angleToUnitVector(angle), radius), center);

        vertices = vertices.concat([vector.x, vector.y]);
    }

    return s.polygon(vertices);

}

function toTranslation(point) {
    return 't' + point.x + ',' + point.y
}

function arrayToRGB(array) {
    var result = "#";

    array.forEach(function(e) {
        var hex = e.toString(16);

        if (hex.length != 2) {
            hex = '0' + hex;
        }

        result += hex;
    })

    return result;
}
