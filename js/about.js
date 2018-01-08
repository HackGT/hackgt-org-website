var transitionButtons = document.getElementById('transition-buttons');

var chunks = document.getElementsByClassName('info-chunk');

var hexagonContainer = document.getElementById('glyphs');
var hexagons = document.getElementsByClassName('hexagon-img');

var footer = document.getElementsByTagName('footer')[0];

var currentIndex = 0;

var buttonCount = chunks.length;

var animationTime = 0.5 * 1000; // taken from the css file
var animationWaitRatio = 0.5;

var currentTimeout = null;
var chunkInterval = null;
var chunkAnimationTime = 4 * 1000;

var width = 0;
var height = 0;

updateHexagonContainerHeight();

function updateHexagonContainerHeight() {
    height = footer.offsetTop - hexagonContainer.offsetTop;
    width = hexagonContainer.scrollWidth;
}


initializeChunks();

function initializeChunks() {
    for (var i = 0; i < chunks.length; i++) {
        var button = document.createElement('div');

        if (i == 0) {
            button.classList.add('active-button');
        }

        (function(i){
            button.onclick = function() {
                revealChunk(i);

                clearInterval(chunkInterval);
            };
        })(i);

        transitionButtons.appendChild(button);
    }

    revealChunk(0);

    chunkInterval = setInterval(function() {
        // 39 makes it go right
        scrollChunks(39);

    }, chunkAnimationTime);
}

function revealChunk(chunkNum) {
    currentIndex = chunkNum;

    for (var i = 0; i < chunks.length; i++) {
        var chunk = chunks[i];
        var button = transitionButtons.children[i];

        if (i != chunkNum) {
            chunk.classList.add('hidden');
            button.classList.remove('active-button');
        } else {
            clearTimeout(currentTimeout);
            (function(i) {
                var chunk = chunks[i];

                currentTimeout = setTimeout(function() {
                    chunk.classList.remove('hidden');    
                }, animationTime * animationWaitRatio);
            })(i);
            
            button.classList.add('active-button');
        }
    }
}

function scrollChunks(keyCode) {
    if (keyCode == 37) {
        // left
        currentIndex--;
    } else if (keyCode == 39) {
        // right
        currentIndex++;
    }

    currentIndex += buttonCount;
    currentIndex %= buttonCount;
    
    revealChunk(currentIndex);
}

function handleKeypress(e) {
    var keyCode = e.keyCode;

    // clear interval because when the user starts messing with it, we don't want to keep auto-scrolling
    clearInterval(chunkInterval);

    scrollChunks(keyCode);
}

document.onkeydown = handleKeypress;

// hexagon stuff

// how much we will scale the images down by if we can't fit them all
var scaleFactor = 0.9;

var hexagonOffset = 4;

var rotationAmount = 15;

var maxAttempts = 10;

var hexagonSize = getHexagonSize(hexagons[0]);

var longestSide = Math.max(hexagonSize.x, hexagonSize.y);
var shortestSide = Math.min(hexagonSize.x, hexagonSize.y);

var widthOffsetRatio = 0.4;

var distanceFactor = 1.05;

function placeHexagons() {
    

    updateHexagonContainerHeight
    // // will not work with like 13 ppl sooo

    // var heightForHexagons = document.body.clientHeight - hexagonContainer.offsetTop;
    // var widthForHexagons = hexagonContainer.clientWidth;
    // var center = getHexagonContainerCenter();
    // console.log(center);

    // moveHexagonToPosition(hexagons[0], sub(center, scalarMultiply(getHexagonSize(hexagons[0]), 1/2)));

    // randomlyRotateHexagon(hexagons[0]);

    // var hexagonSize = getHexagonSize(hexagons[0]);

    // var longestSide = Math.max(hexagonSize.x, hexagonSize.y);
    // var shortestSide = Math.min(hexagonSize.x, hexagonSize.y);

    // var sizeDelta = longestSide - shortestSide;

    // for (var i = 1; i < hexagons.length; i++) {

    //     if (i <= 6) {
    //         var newPosition = add(scalarMultiply(angleToUnitVector(i * 60), longestSide + sizeDelta), getHexagonPosition(hexagons[0]));

    //         moveHexagonToPosition(hexagons[i], newPosition);

    //         randomlyRotateHexagon(hexagons[i]);
    //     }
    // }

    // console.log(hexagons.length)

    var rowCount = colCount = Math.sqrt(hexagons.length);

    var containerWidth = hexagonContainer.clientWidth;
    var offset = containerWidth * widthOffsetRatio / 2;
    containerWidth -= 2 * offset;

    // console.log("a",offset)

    var containerHeight = footer.offsetTop - hexagonContainer.offsetTop;

    var numCols = Math.floor(containerWidth / longestSide);
    var numRows = Math.floor(containerHeight / longestSide);

    var fits = ((numCols * numRows) >= hexagons.length);


    var currentScale = 1;

    while (!fits) {

        currentScale *= scaleFactor;

        numCols = Math.floor(containerWidth / longestSide / currentScale);
        numRows = Math.floor(containerHeight / longestSide / currentScale);

        fits = ((numCols * numRows) >= hexagons.length);
    }

    var cellHeight = containerHeight / numRows;
    var cellWidth = containerWidth / numCols;

    longestSide *= currentScale;
    shortestSide *= currentScale;

    if (currentScale != 1) {
        // resize hexagons if we need to, in order to make them all fit without overlap
        for (var i = 0; i < hexagons.length; i++) {
            var hexagon = hexagons[i];
            hexagon.style.width = hexagon.width * currentScale;
            hexagon.style.height = hexagon.height * currentScale;
        }
    }

    // console.log(numRows, numCols, hexagons.length, cellHeight, cellWidth);
    
    // var cells = generateRandomCellOrder(numRows, numCols);
    // // rowCount = Math.ceil(rowCount * height / width);
    // // colCount = Math.ceil(colCount * width / height);

    // // console.log(rowCount, colCount)

    // // var maxHeight = height / rowCount;
    // // var maxWidth = width / colCount;

    // // console.log(maxHeight, maxWidth)


    // // TODO, find a better way to position these pseudo-randomly without just randomly putting shit down lmao
    // for (var i = 0; i < hexagons.length; i++) {
    //     var hexagon = hexagons[i];
    //     var cell = cells[i];

    //     // moveHexagonToPosition(hexagon, getRandomPosition());
    //     moveHexagonToRandomPositionInCell(cellWidth, cellHeight, cell, offset, hexagon);
    //     randomlyRotateHexagon(hexagon);
    // }

    var distance = longestSide * distanceFactor;
    var sampler = poissonDiscSampler(width - longestSide, height - longestSide, distance);
    console.log(width, height, distance)

    var leftCenterPoint = [width / 3 - longestSide / 2, height / 3 - longestSide / 2];
    var rightCenterPoint = [width * 2 / 3 - longestSide / 2, height * 2 / 3 - longestSide / 2];

    sampler.sample(leftCenterPoint[0], leftCenterPoint[1]);
    sampler.sample(rightCenterPoint[0], rightCenterPoint[1]);

    var generatedSamples = 2;

    var sample;

    var samples = [leftCenterPoint, rightCenterPoint];

    while ((sample = sampler.generate()) && generatedSamples < hexagons.length) {
        samples.push(sample);
        generatedSamples++;
    }

    console.log(samples);

    for (var i = 0; i < samples.length; i++) {
        randomlyRotateHexagon(hexagons[i]);
        moveHexagonToPosition(hexagons[i], {
            x: samples[i][0],
            y: samples[i][1]
        });
    }

    // for (var i = 0; i < hexagons.length; i++) {
    //     var hexagon = hexagons[i];
    //     moveHexagonToPosition(hexagon, getRandomPosition());

    //     var colliding = false;

    //     for (var j = 0; j < i; j++) {
    //         var target = hexagons[j];

    //         var currentAttempts = 0;

    //         while (intersectRect(hexagon.getBoundingClientRect(), target.getBoundingClientRect()) && currentAttempts < maxAttempts) {
    //             moveHexagonToPosition(hexagon, getRandomPosition());
    //             currentAttempts++;
    //         }
    //     }
    // }

}

function randomlyRotateHexagon(hexagonImageElement) {
    var rotation = 2 * rotationAmount * Math.random() - rotationAmount;

    hexagonImageElement.style.transform = "rotate(" + rotation + "deg)"
}

function moveHexagonToRandomPositionInCell(cellWidth, cellHeight, rowColArray, offset, hexagon) {
    var xSpace = cellWidth - hexagon.width;
    var ySpace = cellHeight - hexagon.height;

    console.log(xSpace, ySpace)

    var xPosition = rowColArray[1] * cellWidth + Math.random() * xSpace + offset;
    var yPosition = rowColArray[0] * cellHeight + Math.random() * ySpace;

    hexagon.style.left = xPosition;
    hexagon.style.top = yPosition;
}

function moveHexagonToPosition(hexagonImageElement, position) {

    hexagonImageElement.style.left = position.x;
    hexagonImageElement.style.top = position.y;
}

function getHexagonSize(hexagonImageElement) {
    
    return {
        x: hexagonImageElement.width,
        y: hexagonImageElement.height
    };
}

function getHexagonPosition(hexagonImageElement) {
    return {
        x: hexagonImageElement.offsetLeft,
        y: hexagonImageElement.offsetTop
    };
}

function getHexagonContainerCenter() {
    return {
        x: hexagonContainer.clientWidth / 2,
        y: document.body.clientHeight / 2 * containerHeightModifier};
}

function getRandomPosition() {
    return {
        x: Math.random() * (hexagonContainer.clientWidth - longestSide),
        y: Math.random() * (footer.offsetTop - hexagonContainer.offsetTop - longestSide)
    }
}

function generateRandomCellOrder(numRows, numCols) {
    var cells = [];

    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
            cells.push([i, j]);
        }
    }

    shuffle(cells);

    return cells;
}

placeHexagons()

function intersectRect (rectA, rectB) {
    // from https://github.com/Barry127/intersect-rect
    return !(
        rectB.left >= rectA.right ||
        rectB.right <= rectA.left ||
        rectB.top >= rectA.bottom ||
        rectB.bottom <= rectA.top
      );
}

function shuffle(a) {
    // from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}