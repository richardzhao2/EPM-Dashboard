// plotting all the magic
const plot = require('./plot');

const play = $('.buttons.play');
const pause = $('.buttons.wrapper .pause');

play.on('click', () => {
  plot.play();
});

pause.on('click', () => {
  plot.pause();
});

plot.init();