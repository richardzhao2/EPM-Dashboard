const CanvasJS = require('canvasjs');

var dps = []; // dataPoints

var dataLength = 60; // number of dataPoints visible at any point

var chart;

module.exports = {
  // update the title of the chart
  updateTitle: (name) => {
    chart.options.title.text = name;
  },
  updateChart: (point) => {
    // shift over values

    dps.push(point);

    if (dps.length > dataLength) {
      dps.shift();				
    }
    
    chart.render();
  },

  init: () => {
    chart = new CanvasJS.Chart('line-chart',{
      title :{
        text: 'Accumulating Metrics',
      },			
      data: [{
        type: 'line',
        dataPoints: dps,
      }],
      width: 300,
      height: 200,
    });    
  },
};