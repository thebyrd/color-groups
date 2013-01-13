var Help = {
  createMatrix: function (n, m) { //From the Problem Handout
    var matrix = [];
    for (var i = 0; i < n; i++) {
      matrix[i] = [];
      for (var j = 0; j < m; j++) {
        matrix[i].push(Math.round(Math.random())); 
      }
    } 
    return matrix; 
  },
  randColor: function () {
    return '#' + ((Math.random() * 0xEEEEEE << 0) + (0x100000 << 0)).toString(16);
  }
};

var Cell = function (x, y) {
  this.x = x;
  this.y = y;
  this.id = '['+this.x + '.' + this.y + ']';
};

function Grid (height, width) {
  this.height = height;
  this.width = width;

  this.cellsByID = {};
  this.neighborsByCellID = {};

  var matrix = Help.createMatrix(this.height, this.width);

  this.populateMaps(matrix);
  this.setColors();
}

Grid.prototype.populateMaps = function (binaryMatrix) {
  var m = binaryMatrix;
  for (var y = 0; y < m.length; y++) {
    for (var x = 0; x < m[y].length; x++) {
      var hasColor = m[y][x];
      if (hasColor) {

        // if the cell already exists in the cellsByID map use that cell for storing neighbors
        var cell = new Cell(x,y);
        this.cellsByID[cell.id] ? 
          cell = this.cellsByID[cell.id] : this.cellsByID[cell.id] = cell;

        // get neighbors (left, right, bottom, top)
        var neighbors = [];

        if (m[y-1]    !== undefined && m[y-1][x]) neighbors.push( new Cell(x, y-1) );
        if (m[y+1]    !== undefined && m[y+1][x]) neighbors.push( new Cell(x, y+1) );
        if (m[y][x-1] !== undefined && m[y][x-1]) neighbors.push( new Cell(x-1, y) );
        if (m[y][x+1] !== undefined && m[y][x+1]) neighbors.push( new Cell(x+1, y) );

        this.neighborsByCellID[cell.id] = neighbors;

        //add neighbors to cellsByID
        for (var i = 0; i < neighbors.length; i++) this.cellsByID[neighbors[i].id] = neighbors[i];
        
      }
    }
  }
};

Grid.prototype.setColors = function () {
  var color = null;
  for (var id in this.cellsByID) {
    var cell = this.cellsByID[id];
    if (cell.color === undefined) {
      color = Help.randColor();
      cell.color = color;

      var q = [];
      q.push(cell);

      while (q.length > 0) {
        var next = q.shift();
        var neighbors = this.neighborsByCellID[next.id];

        for (var i = 0; i < neighbors.length; i++) {
          
          if (neighbors[i].color === undefined) {
            neighbors[i].color = color;
            q.push(neighbors[i]);
          }

        }

      }
    }
  }
};

Grid.prototype.render = function () {

  var grayCnvs = document.getElementsByClassName('grayscale')[0];
  var grayCntxt = grayCnvs.getContext('2d');
  grayCntxt.fillStyle = 'black';

  for (var grayID in this.cellsByID) {
    var grayCell = this.cellsByID[grayID];
    grayCntxt.fillRect(20 * grayCell.x, 20 * grayCell.y, 20, 20);
  }

  var colorCnvs = document.getElementsByClassName('colorful')[0]; 
  var colorCntxt = colorCnvs.getContext('2d');

  for (var colorID in this.cellsByID) {
    var coloredCell = this.cellsByID[colorID];
    colorCntxt.fillStyle = coloredCell.color;
    console.log('cell' + colorID + ' is ' + coloredCell.color);
    colorCntxt.fillRect(20 * coloredCell.x, 20 * coloredCell.y, 20, 20);
  }
};