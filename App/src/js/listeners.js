// plotting all the magic
const plot = require('./plot');

const play = $('.buttons.play');
const pause = $('.buttons.wrapper .pause');
const drop2 = $('.select.two');


$("input[name='test']").change(() => {
	plot.changePlayer($("input:radio[name=test]:checked").val());
});

$('.select.one').on('change', () => {
	console.log();
});

play.on('click', () => {
  plot.play();
});

pause.on('click', () => {
  plot.pause();
});

plot.init();