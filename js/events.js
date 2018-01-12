var yearSelector = document.getElementById('year-selector');

var listElements = yearSelector.querySelectorAll('li');

var scrollTime = 750;

var margin = 8;

var yearSectionElements = getAllYearSectionElements();

var scrolling = false;
var currentTimeout;

yearSelector.querySelectorAll('a').forEach(function(link, index) {
    (function(link, index){
        link.onclick = function(e) {

            e.preventDefault();

            if (scrolling) {
                return;
            }
            
            var element = yearSectionElements[index];

            var displacement = getVerticalDisplacement(element) - margin * 0.5;

            scrolling = true;
            clearTimeout(currentTimeout);

            setTimeout(function() {
                scrolling = false;
            }, scrollTime);

            scrollTo(displacement, scrollTime);

            activateLink(index);
        };
    })(link, index);
});

function activateLink(index) {
    clearAllActiveYearLinks();
    listElements[index].classList.add('active');
}

function clearAllActiveYearLinks() {
    listElements.forEach(function(li) {
        li.classList.remove('active');
    });
}

function getAllYearSectionElements() {
    var sections = [];

    listElements.forEach(function(li) {
        var link = li.querySelector('a');
        var id = link.href.substr(link.href.indexOf('#') + 1);
        sections.push(document.getElementById(id));
    });

    return sections;
}

window.onscroll = function(e) {
    if (scrolling) {
        return;
    }

    for (var i = yearSectionElements.length - 1; i >= 0; i--) {
        var element = yearSectionElements[i];
        var displacement = getVerticalDisplacement(element);
        displacement = window.scrollY - displacement;

        if (displacement >= -margin) {
            return activateLink(i);
        }
    }
};