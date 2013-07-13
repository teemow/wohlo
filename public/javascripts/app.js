$(document).ready(function () {
  var carousel = $('#myCarousel').carousel();
  carousel.carousel('pause');

  $("input[type=radio]").click(function() {

    setTimeout(function() {
      carousel.carousel('next');
    }, 200);

    $.post("/answer", { id: $(this).attr("id"), value: 1 });
  });
  $('.typeahead').typeahead()  
});

