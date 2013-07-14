$(document).ready(function () {

  /** Carousel challenge **/
  if ($('#myCarousel').size() > 0) {

    var carousel = $('#myCarousel').carousel();
    carousel.carousel('pause');

    $("input[type=radio]").click(function() {

      setTimeout(function() {
        carousel.carousel('next');
      }, 200);

    });

    $(".btn").click(function(e) {
      e.preventDefault();

      var score = 0;
      $('input[type=radio]:checked').each(function() {
        score += parseInt($(this).attr('value'));
      });
      $('input[name=score]').val(score);

      $(this).parents('form').submit();
    });

    $('.typeahead').typeahead();

    Mousetrap.bind("right", function() {
      carousel.carousel('next');
    });
    Mousetrap.bind("left", function() {
      carousel.carousel('prev');
    });
  }

  /** Comparison **/

  if ($('#g1').size() > 0) {
    var g1 = new JustGage({
      id: "g1",
      value: $('input[name=score]').val(),
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
    var score = parseInt(
      parseInt($('input[name=company_score]').val()) /
      parseInt($('input[name=company_user_count]').val())
    );

    var g2 = new JustGage({
      id: "g2",
      value: score,
      min: 0,
      max: 100,
      title: $('input[name=company]').val(),
      titleFontColor: "#000",
      label: "",
      levelColors: [
        "#ff0000",
        "#ffcc00",
        "#00ff00",
      ]
    });
    $("button").click(function() {
      location.href="/challenges";
    });
  }

  $('.btn-facebook').click(function(e) {
    e.preventDefault();
    location.href="/auth/facebook";
  });

  if ($('#modal_register').size() > 0) {
    if ($('input[name=user]').val() === "") {
      $("a").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#modal_register').modal();
      });
    }
  }
});

