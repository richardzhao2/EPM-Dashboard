// for smooth scroll animation
$('a').click(function(){
  $('html, body').animate({
    scrollTop: $($(this).attr('href')).offset().top - 60,
  }, 500);
});