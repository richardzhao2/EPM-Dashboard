const d3 = require('d3');
const radar = require('./radar');
const line = require('./line');

var isPaused = true;

// make graphs
const delta = 1;
const timer = 40;
const circleSize = 3;

var update;

// all the data
var data = require('../data/NBA_LG_FINAL_SEQUENCE_OPTICAL$2016102505_Q1');
const gameInfo = require('../data/SVUtil.json');
const players = require('../data/SVNames');
const teams = require('../data/SVTeams'); 

var frame = 1;

module.exports = {
  init: () => {
    module.exports.makeGraph();
    radar.init();
  },
  // all the D3 goodies
  getCoordinates: (n) => {
    var result = [];
    var raw = data[n]['locations'].split(';');
    for (let i = 0; i < raw.length; i++) {
      let temp = raw[i].split(',');
      result.push([temp[2], temp[3]]);
    }

    return result;
  },
  process: () => {
    // request for data
    $.ajax({
      url: 'http://localhost:5000/data',
      type: 'POST',
      data: JSON.stringify({
        width: 'calvin',
        height: 'ricahrd',
      }),
      contentType: 'application/json',
      dataType: 'json',
    }).done((response) => {
      console.log(response);
    });
  },
  makeGraph: () => {
    const canvas_width = 600;
    const canvas_height = 600 * 0.5744;
    const padding = 30;  // for chart edges
    const gc = module.exports.getCoordinates;
    const startData = gc(0);

    // Create scale functions
    const xScale = d3.scaleLinear()  // xScale is width of graphic
      .domain([0, 89])
      .range([padding, canvas_width - padding * 2]); // output range

    const yScale = d3.scaleLinear()  // yScale is height of graphic
      .domain([0, 52])
      .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip

    // Create SVG element
    var svg = d3.select('#plot')  // This is where we put our vis
      .append('svg')
      .attr('width', canvas_width)
      .attr('height', canvas_height);

    // Create Circles
    svg.selectAll('circle')
      .data(startData)
      .enter()
      .append('circle')  // Add circle svg
      .attr('cx', function(d) {
        return xScale(d[0]);  // Circle's X
      })
      .attr('cy', function(d) {  // Circle's Y
        return yScale(d[1]);
      });

    svg.selectAll('circle')
      .filter((d, i) => {return i == 0;})
      .style('fill', 'orange')
      .attr('r', circleSize);  // radius

    svg.selectAll('circle')
      .filter((d, i) => {return ((i >= 1) && (i <= 6));})
      .style('fill', 'red')
      .attr('r', circleSize + 2);  // radius

    svg.selectAll('circle')
      .filter((d, i) => {return (i >= 6);})
      .style('fill', 'blue')
      .attr('r', circleSize + 2);  // radius

    function updatePoints (tempData) {
      // Update circles
      svg.selectAll('circle')
        .data(tempData)  // Update with new data
        .transition()
        .duration(100)
        .attr('cx', function(d) {
          return xScale(d[0]);  // Circle's X
        })
        .attr('cy', function(d) {
          return yScale(d[1]);  // Circle's Y
        });
    }

    // On click, update with new data
    d3.select('.play')
      .on('click', () => {
        isPaused = false;

        clearInterval(update);
        update = setInterval(
          () => {
            if (frame < data.length && !isPaused) {
              var tempData = gc(frame);
              frame += delta;
    
              updatePoints(tempData);
            }
          }, timer
        );
      });

    d3.select('.pause')
      .on('click', () => {
        clearInterval(update);
        // request for processed data
        // module.exports.process();
      });

    // On click, update with new data
    d3.select('.back')
      .on('click', () => {
        isPaused = false;            
        
        clearInterval(update);
        update = setInterval(
          () => {
            if (frame > 5 && !isPaused) {
              var tempData = gc(frame);
              frame -= delta;
    
              updatePoints(tempData);
            }
          }, timer
        );
      });
  },
  pause: () => {
    isPaused = true;
    console.log('pause');
  },
  play: () => {
    isPaused = false;
    console.log('play');
  },
};

