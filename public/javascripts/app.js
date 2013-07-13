$(document).ready(function () {
  var carousel = $('#myCarousel').carousel();
  carousel.carousel('pause');

  $("input[type=radio]").click(function() {

    setTimeout(function() {
      carousel.carousel('next');
    }, 200);
  });
  $('.typeahead').typeahead()  
});

