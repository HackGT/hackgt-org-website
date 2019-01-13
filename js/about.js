var transitionButtons = document.getElementById('transition-buttons');

var chunks = document.getElementsByClassName('info-chunk');

var hexagonContainer = document.getElementById('glyphs');

var teams = document.getElementsByClassName('team-glyphs');
var hexagonTeamPairs = [].slice.call(teams).map(function(e){
    return [].slice.call(e.getElementsByClassName('hexagon-img'));
});



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

var scaleFactor = 0.9;

var hexagonOffset = 4;

var rotationAmount = 15;

var maxAttempts = 10;

var hexagonSize = getHexagonSize(hexagonTeamPairs[0][0]);
var lastIndex = 0;


var widthOffsetRatio = 0.4;

var distanceFactor = 1.05;

updateHexagonContainerHeight();
resizeInfoChunks();

window.onresize = resizeInfoChunks;

var currentPage = document.getElementById('navabout');
currentPage.style.fontWeight = 'bold';
currentPage.style.color = 'white';

function updateHexagonContainerHeight() {
    height = footer.offsetTop - hexagonContainer.offsetTop;
    width = hexagonContainer.scrollWidth;
}


initializeChunks();

for (var i = 0; i < hexagonTeamPairs.length; i++) {
    placeHexagons(i);
}


function initializeChunks() {
    for (var i = 0; i < chunks.length; i++) {
        var button = document.createElement('div');

        if (i == 0) {
            button.classList.add('active-button');
        }

        (function(i){
            button.onclick = function() {
                lastIndex = currentIndex;
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
            // chunk.classList.add('hidden');
            chunk.classList.remove('visible-info-chunk');
            button.classList.remove('active-button');
        } else {
            clearTimeout(currentTimeout);
            (function(i) {
                var chunk = chunks[i];

                currentTimeout = setTimeout(function() {
                    // chunk.classList.remove('hidden');    
                    chunk.classList.add('visible-info-chunk');
                }, animationTime * animationWaitRatio);
            })(i);
            
            button.classList.add('active-button');
        }
    }

    for (var i = 0; i < teams.length; i++) {
        var team = teams[i];

        if (i == chunkNum) {
            team.classList.add('team-glyphs-active');
        } else {
            team.classList.remove('team-glyphs-active');
        }

        if (i != lastIndex && i != chunkNum) {
            placeHexagons(i);
        }
    }
}

function scrollChunks(keyCode) {
    lastIndex = currentIndex;
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

function placeHexagons(i) {
    
    // we'll do cool hexagon stuff l8r
    return;

    var hexagons = hexagonTeamPairs[i];

    updateHexagonContainerHeight();

    var longestSide = Math.max(hexagonSize.x, hexagonSize.y);
    var shortestSide = Math.min(hexagonSize.x, hexagonSize.y);

    var rowCount = colCount = Math.sqrt(hexagons.length);

    var containerWidth = hexagonContainer.clientWidth;
    // var offset = containerWidth * widthOffsetRatio / 2;
    // containerWidth -= 2 * offset;


    var containerHeight = footer.offsetTop - hexagonContainer.offsetTop;

    var numCols = Math.floor(containerWidth / longestSide);
    var numRows = Math.floor(containerHeight / longestSide);

    var fits = ((numCols * numRows) >= hexagons.length);


    var currentScale = 1;

    // while (!fits) {

    //     currentScale *= scaleFactor;

    //     numCols = Math.floor(containerWidth / longestSide / currentScale);
    //     numRows = Math.floor(containerHeight / longestSide / currentScale);

    //     fits = ((numCols * numRows) >= hexagons.length);
    // }

    var cellHeight = containerHeight / numRows;
    var cellWidth = containerWidth / numCols;

    longestSide *= currentScale;
    shortestSide *= currentScale;

    // if (currentScale != 1) {
    //     // resize hexagons if we need to, in order to make them all fit without overlap
    //     for (var i = 0; i < hexagons.length; i++) {
    //         var hexagon = hexagons[i];
    //         hexagon.style.width = hexagon.width * currentScale;
    //         hexagon.style.height = hexagon.height * currentScale;
    //     }
    // }


    var distance = longestSide * distanceFactor;
    // var sampler = poissonDiscSampler(width - longestSide, height - longestSide, distance);

    // var leftCenterPoint = [width / 3 - longestSide / 2, height / 3 - longestSide / 2];
    // var rightCenterPoint = [width * 2 / 3 - longestSide / 2, height * 2 / 3 - longestSide / 2];

    // sampler.sample(leftCenterPoint[0], leftCenterPoint[1]);
    // sampler.sample(rightCenterPoint[0], rightCenterPoint[1]);

    // var generatedSamples = 2;

    // var sample;

    // var samples = [leftCenterPoint, rightCenterPoint];

    // while ((sample = sampler.generate()) && generatedSamples < hexagons.length) {
    //     samples.push(sample);
    //     generatedSamples++;
    // }

    // console.log(samples);
    // console.log("H")
    // console.log(hexagons)
    // shuffle(hexagons);

    // for (var i = 0; i < samples.length; i++) {
    //     // randomlyRotateHexagon(hexagons[i]);
    //     moveHexagonToPosition(hexagons[i], {
    //         x: samples[i][0],
    //         y: samples[i][1]
    //     });
    // }

    // console.log(containerWidth, containerHeight)
    moveHexagonToPosition(hexagons[0], {x: containerWidth / 2, y: containerHeight / 2})


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

function moveHexagonToPosition(hexagonImageElement, position, fromCenter) {
    if (fromCenter === undefined) {
        fromCenter = true;
    }

    hexagonImageElement.style.left = position.x - (fromCenter ? hexagonImageElement.width / 2 : 0);
    hexagonImageElement.style.top = position.y - (fromCenter ? hexagonImageElement.width / 2 : 0);
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

function resizeInfoChunks() {
    var infoChunks = [].slice.call(document.getElementsByClassName('info-chunk'));

    var maxHeight = 0;

    infoChunks.forEach(function(e){
        maxHeight = Math.max(maxHeight, e.offsetHeight);
    });

    infoChunks[0].parentElement.style.minHeight = maxHeight + "px";
}