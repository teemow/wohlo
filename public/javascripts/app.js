$(document).ready(function () {

  /** Carousel challenge **/

  var carousel = $('#myCarousel').carousel();
  carousel.carousel('pause');

  $("input[type=radio]").click(function() {

    setTimeout(function() {
      carousel.carousel('next');
    }, 200);

    $.post("/answer", { id: $(this).attr("id"), value: 1 });
  });

  $('.typeahead').typeahead();

  Mousetrap.bind("right", function() {
    carousel.carousel('next');
  });
  Mousetrap.bind("left", function() {
    carousel.carousel('prev');
  });

  /** Comparison **/

  if ($('#g1').size() > 0) {
    var g1 = new JustGage({
      id: "g1",
      value: 60,
      min: 0,
      max: 100,
      title: "Dein Score",
      label: "",
      titleFontColor: "#000",
      levelColors: [
        "#ff0000",
        "#ffcc00",
        "#00ff00",
      ]
    });
  }

  if ($('#g2').size() > 0) {
    var g2 = new JustGage({
      id: "g2",
      value: 65,
      min: 0,
      max: 100,
      title: "BMW",
      titleFontColor: "#000",
      label: "",
      levelColors: [
        "#ff0000",
        "#ffcc00",
        "#00ff00",
      ]
    });
  }
});

