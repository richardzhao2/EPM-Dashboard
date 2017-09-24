const d3 = require('d3');

var svg;
var x;
var y;
var xStart = 0;
// var currMax = 0;
var data = [];

module.exports = {
  updateData: (d) => {

    // Scale the range of the data
    x.domain([xStart, xStart + 60]);
    y.domain([0, 20]);

    // Add the valueline path.
    svg.append("path")
      .data(data.push(d))
      .attr("class", "line")
      .attr("d", valueline);
    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    xStart++;
  },
  init: () => {
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 300 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    // set the ranges
    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);
    // define the line
    var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });
    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    svg = d3.select("#line-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    console.log()

    setInterval(module.exports.updateData(4), 100);
  },
};



