const d3 = require('d3');

var isPaused = true;

// data

// console.log(data[0]);

// make graphs

const circleSize = 3;
/*
var data = [
  {'game-clock': '720.00', 'time': '1477438579336', 'game-event-id': '', 'shot-clock': '24.00', 'locations': '-1,-1,47.13248,28.14078,4.80829;5,214152,52.06204,36.55583,0;5,253997,48.19851,14.86676,0;5,395374,59.89999,30.06305,0;5,551768,59.73518,30.4817,0;5,552806,48.85235,24.29689,0;18,172890,47.43618,36.39903,0;18,263220,45.68554,26.50675,0;18,276755,46.63328,14.68745,0;18,399612,11.54205,26.79228,0;18,877869,37.57692,24.91517,0'},
  {'game-clock': '720.00', 'time': '1477438579376', 'game-event-id': '', 'shot-clock': '24.00', 'locations': '-1,-1,47.02735,28.1051,4.77021;5,214152,51.98853,36.51799,0;5,253997,48.21179,14.90437,0;5,395374,59.87765,30.07992,0;5,551768,59.76784,30.39574,0;5,552806,48.82836,24.24862,0;18,172890,47.43423,36.38794,0;18,263220,45.694,26.51621,0;18,276755,46.66147,14.67148,0;18,399612,11.49175,26.84274,0;18,877869,37.59448,24.916,0'},
  {'game-clock': '720.00', 'time': '1477438579416', 'game-event-id': '', 'shot-clock': '24.00', 'locations': '-1,-1,47.037,28.15165,4.81177;5,214152,51.91445,36.48042,0;5,253997,48.22716,14.93942,0;5,395374,59.8548,30.09741,0;5,551768,59.79861,30.29613,0;5,552806,48.80721,24.21254,0;18,172890,47.42726,36.3817,0;18,263220,45.70306,26.52511,0;18,276755,46.6878,14.68096,0;18,399612,11.44316,26.89027,0;18,877869,37.60582,24.91469,0'},
  {'game-clock': '720.00', 'time': '1477438579456', 'game-event-id': '', 'shot-clock': '24.00', 'locations': '-1,-1,47.00464,28.11229,4.86896;5,214152,51.84018,36.44796,0;5,253997,48.268,14.96555,0;5,395374,59.8716,30.06265,0;5,551768,59.775,30.22263,0;5,552806,48.78863,24.18705,0;18,172890,47.41658,36.37766,0;18,263220,45.70741,26.5293,0;18,276755,46.71775,14.68142,0;18,399612,11.40131,26.9369,0;18,877869,37.62093,24.91348,0'},
  {'game-clock': '720.00', 'time': '1477438579497', 'game-event-id': '', 'shot-clock': '24.00', 'locations': '-1,-1,46.9132,28.14059,4.76157;5,214152,51.7677,36.41709,0;5,253997,48.30185,14.97203,0;5,395374,59.88597,29.95172,0;5,551768,59.75187,30.21147,0;5,552806,48.76948,24.16984,0;18,172890,47.4039,36.37484,0;18,263220,45.70938,26.52806,0;18,276755,46.73903,14.70541,0;18,399612,11.362,26.9768,0;18,877869,37.6287,24.91039,0'},
];
*/

var data = require('../data/NBA_LG_FINAL_SEQUENCE_OPTICAL$2016102505_Q1');

var frame = 1;

module.exports = {
  init: () => {
    module.exports.makeGraph();
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
  makeGraph: () => {
    const canvas_width = 600;
    const canvas_height = 600 * 0.5744;
    const padding = 30;  // for chart edges
    const gc = module.exports.getCoordinates;
    const startData = gc(0);

    // Create scale functions
    const xScale = d3.scaleLinear()  // xScale is width of graphic
      .domain([0, 100])
      .range([padding, canvas_width - padding * 2]); // output range

      /*
      d3.max(startData, function(d) {
        return d[0];  // input domain
      })])
      */

    const yScale = d3.scaleLinear()  // yScale is height of graphic
      .domain([0, 50])
      .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip         
        
      /*d3.max(startData, function(d) {
        return d[1];  // input domain
      })])
      */

    // Define X axis
    var xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(5);

    // Define Y axis
    var yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(5);

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

    // Add to X axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (canvas_height - padding) +')')
      .call(xAxis);

    // Add to Y axis
    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + padding +',0)')
      .call(yAxis);

    function updatePoints (tempData) {
      // Update circles
      svg.selectAll('circle')
        .data(tempData)  // Update with new data
        .transition()  // Transition from old to new
        .duration(1000)  // Length of animation
        .delay(function(d, i) {
          return i / tempData.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
        })
        //.ease('linear')  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr('cx', function(d) {
          return xScale(d[0]);  // Circle's X
        })
        .attr('cy', function(d) {
          return yScale(d[1]);  // Circle's Y
        })
        .on('end', function() {  // End animation
          d3.select(this)  // 'this' means the current element
            .transition()
            .duration(500);
        });

      // Update X Axis
      svg.select('.x.axis')
        .transition()
        .duration(1000)
        .call(xAxis);

      // Update Y Axis
      svg.select('.y.axis')
        .transition()
        .duration(100)
        .call(yAxis);
    }

    // On click, update with new data
    d3.select('.play')
      .on('click', function() {
        if (frame < data.length) {
          var tempData = gc(frame);
          frame += 5;

          updatePoints(tempData);
        }
      });

    // On click, update with new data
    d3.select('.back')
      .on('click', function() {
        if (frame > 5) {
          var tempData = gc(frame);
          frame -= 5;

          updatePoints(tempData);
        }
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

