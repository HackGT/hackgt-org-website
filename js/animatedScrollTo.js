// modified from https://gist.github.com/andjosh/6764939

function scrollTo(to, duration) {

    var element = document.body;
    var start = window.scrollY,
        change = to - start,
        currentTime = 0,
        increment = 10;

    var val = start;

    var easing = function(t) {
        // t value from 0 to 1
        return Math.sin(t * Math.PI / 2);
    }

    var animateScroll = function(){        
        var ease = easing(currentTime / duration);
        currentTime += increment;

        var delta = ease * change;

        window.scroll(0, delta + start);

        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

function getVerticalDisplacement(element) {
    var bodyRect = document.body.getBoundingClientRect(),
    elemRect = element.getBoundingClientRect();

    return elemRect.top - bodyRect.top;
}