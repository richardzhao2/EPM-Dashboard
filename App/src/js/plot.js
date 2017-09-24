const d3 = require('d3');
const radar = require('./radar');
const line = require('./line');

var isPaused = true;
var points;

// make graphs
const delta = 5;
const timer = 40;
const circleSize = 3;

var it = 0;

var xx = 0;

var update;

var knicksScore =0;
var cavsScore = 0;

const host = 'localhost';

// all the data
var data = require('../data/NBA_LG_FINAL_SEQUENCE_OPTICAL$2016102505_Q1');
const gameInfo = require('../data/SVUtil.json');
const players = require('../data/SVNames');
const teams = require('../data/SVTeams'); 

var currentPlayer = 'Kyrie Irving'; // 'Carmelo Anthony';

const names = [
  'LeBron James',
  'JR Smith',
  'Kevin Love',
  'Kyrie Irving',
  'Tristan Thompson',
  'Carmelo Anthony',
  'Joakim Noah',
  'Courtney Lee',
  'Derrick Rose',
  'Kristaps Porzingis',
];

const cavsN = [
  'LeBron James',
  'JR Smith',
  'Kevin Love',
  'Kyrie Irving',
  'Tristan Thompson',
];

const knicksN = [
  'Carmelo Anthony',
  'Joakim Noah',
  'Courtney Lee',
  'Derrick Rose',
  'Kristaps Porzingis',
];

var gameStats = {
  time: 720,
  gameID: 2016102505,
  quarter: 1,
};

var playerStats = {};

for (let i = 0; i < 10; i++) {
  playerStats[names[i]] = {
    ast: 0,
    pts: 0,
    tfga: 0,
    tfgm: 0,
    '3fga': 0,
    '3fgm': 0,    
    pm: 0,
    epm: 0,
  };
}

var frame = 2000;

module.exports = {
  init: () => {
    module.exports.makeGraph();
    radar.init();
    line.init();
  },
  // all the D3 goodies
  getCoordinates: (n) => {
    var result = [];
    gameStats['time'] = data[n]['game-clock']; // update game clock
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
      url: 'http://' + host + ':5000/data',
      type: 'POST',
      data: JSON.stringify(gameStats),
      contentType: 'application/json',
      dataType: 'json',
    }).done((response) => {
      console.log(knicksScore, cavsScore);
      if(response == null) {
        console.log('server responded with no matches');
        return;
      } else if (response && response['playerID'] == 'nobody') {
        console.log('nobody matches bc they are not famous');
        if(parseInt(response['teamID']) == 5) {
          points = parseInt(response['pts']);
          knicksScore += points;

          for(let i=0; i<5; i++) {
            playerStats[cavsN[i]]['pm'] -= points;
            playerStats[knicksN[i]]['pm'] += points;            
          }

        } else {
          points = parseInt(response['pts']);
          cavsScore += points;

          for(let i=0; i<5; i++) {
            playerStats[cavsN[i]]['pm'] += points;
            playerStats[knicksN[i]]['pm'] -= points;            
          }
        }

        radar.updateValues([
          [
            { axis: "+/-", value: playerStats[currentPlayer]['pm'] / 10},
            { axis: "AST", value: playerStats[currentPlayer]['ast'] / 10},
            { axis: "FG%", value: playerStats[currentPlayer]['tfgm'] / ((playerStats[currentPlayer]['tfga']) ? (playerStats[currentPlayer]['tfga']) : 1)},
            { axis: "3P%", value: playerStats[currentPlayer]['3fgm'] / ((playerStats[currentPlayer]['3fga']) ? (playerStats[currentPlayer]['3fga']) : 1)},
            { axis: "PTS", value: playerStats[currentPlayer]['pts'] / 20},
          ], 
        ], playerStats[currentPlayer]['epm']);

        return;
      } else {
        console.log(response);
        parseInt(response['pts_type'], response['playerID'], response['dribbles'], response['fga'], response['pts']);
        var playerID = response['playerID'];

        line.updateChart({x: xx, y: parseFloat(response['EPM'])});

        xx++;

        if(parseInt(response['teamID']) == 5) {
          points = parseInt(response['pts']);
          knicksScore += points;

          for(let i=0; i<5; i++) {
            playerStats[cavsN[i]]['pm'] -= points;
            playerStats[knicksN[i]]['pm'] += points;            
          }

        } else {
          points = parseInt(response['pts']);
          cavsScore += points;

          for(let i=0; i<5; i++) {
            playerStats[cavsN[i]]['pm'] += points;
            playerStats[knicksN[i]]['pm'] -= points;            
          }
        }

        playerStats[playerID] = {
          ast: playerStats[playerID]['ast'] + parseInt(response['ast']),
          pts: playerStats[playerID]['pts'] + parseInt(response['pts']),
          tfga: playerStats[playerID]['tfga'] + parseInt(response['fga']),
          tfgm: playerStats[playerID]['tfgm'] + (parseInt(response['pts']) > 1),
          '3fga': playerStats[playerID]['3fga'] + (parseInt(response['pts_type']) == 3),
          '3fgm': playerStats[playerID]['3fgm'] + (parseInt(response['pts']) == 3),    
          pm: playerStats[playerID]['epm'],
          epm: parseInt(response['EPM']),
        };

        console.log(playerStats[currentPlayer]);
        
        if (playerID == currentPlayer) {
          console.log('update', playerID);

          radar.updateValues([
            [
              { axis: "+/-", value: playerStats[currentPlayer]['pm'] / 10},
              { axis: "AST", value: playerStats[currentPlayer]['ast'] / 10},
              { axis: "FG%", value: playerStats[currentPlayer]['tfgm'] / ((playerStats[currentPlayer]['tfga']) ? (playerStats[currentPlayer]['tfga']) : 1)},
              { axis: "3P%", value: playerStats[currentPlayer]['3fgm'] / ((playerStats[currentPlayer]['3fga']) ? (playerStats[currentPlayer]['3fga']) : 1)},
              { axis: "PTS", value: playerStats[currentPlayer]['pts'] / 20},
            ], 
          ], playerStats[currentPlayer]['epm']);
        }
      }
    });
  },
  makeGraph: () => {
    const canvas_width = 500;
    const canvas_height = 500 * 0.5744;
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
              if (it % 20 == 0) {
                module.exports.process(); // get stats                
              }
              it++;
            }
          }, timer
        );
      });

    d3.select('.pause')
      .on('click', () => {
        clearInterval(update);
        // line.updateChart({x: 2, y: 3});
        // request for processed data
        
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
              module.exports.process(); // get stats
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
  changePlayer: (p) => {
  	currentPlayer = p;

  	// update values to new player
  	radar.updateValues([
      [
        { axis: "+/-", value: playerStats[currentPlayer]['pm'] / 10},
        { axis: "AST", value: playerStats[currentPlayer]['ast'] / 10},
        { axis: "FG%", value: playerStats[currentPlayer]['tfgm'] / ((playerStats[currentPlayer]['tfga']) ? (playerStats[currentPlayer]['tfga']) : 1)},
        { axis: "3P%", value: playerStats[currentPlayer]['3fgm'] / ((playerStats[currentPlayer]['3fga']) ? (playerStats[currentPlayer]['3fga']) : 1)},
        { axis: "PTS", value: playerStats[currentPlayer]['pts'] / 20},
      ],
    ], 
    playerStats[currentPlayer]['epm']);
  }
};

