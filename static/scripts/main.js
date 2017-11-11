$(document).ready(function() {
  // Gradient
  var startPos = 0,
      endPos = 3*$(window).height(),
      startColor = [20,12,45],
      endColor = [32,78,160],
      diffColor = [endColor[0] - startColor[0], endColor[1] - startColor[1], endColor[2] - startColor[2]];

  $(document).scroll(function() {
    var pos = ($(this).scrollTop() - startPos) / (endPos - startPos);
    pos = Math.min(1, Math.max(0, pos));
    var bgColor = [Math.round(startColor[0] + diffColor[0] * pos), Math.round(startColor[1] + diffColor[1] * pos), Math.round(startColor[2] + diffColor[2] * pos)];
    $('body').css('background-color', 'rgb(' + bgColor.join(',') +')');
    // $('nav.navbar.navbar-inverse').css('background-color', 'rgb(' + bgColor.join(',') +')');
  });
});