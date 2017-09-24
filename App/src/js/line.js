const CanvasJS = require('canvasjs');

var dps = []; // dataPoints

var chart = new CanvasJS.Chart('line-chart',{
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

var dataLength = 60; // number of dataPoints visible at any point

var updateChart = function (count) {
count = count || 1;
// count is number of times loop runs to generate random dataPoints.

for (var j = 0; j < count; j++) {	
    var yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
    dps.push({
      x: j,
      y: yVal
    });
  };
  if (dps.length > dataLength) {
    dps.shift();				
  }
	
  chart.render();		
};

// generates first set of dataPoints
updateChart(30);