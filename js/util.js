function sub(point1, point2) {
    return add(point1, scalarMultiply(point2, -1));
}

function add(point1, point2) {
    return {
        x: point1.x + point2.x,
        y: point1.y + point2.y
    }
}

function scalarMultiply(point1, scalar) {
    return {
        x: point1.x * scalar,
        y: point1.y * scalar
    }
}

function angleToUnitVector(angle) {
    // angle in degrees
    return {
        x: Math.cos(angle * Math.PI / 180),
        y: Math.sin(angle * Math.PI / 180)
    }
}

function updateWidthAndHeight(el) {
    var bbox = el.getBoundingClientRect();
    width = el.clientWidth || bbox.width;
    height = el.clientHeight || bbox.height;
}