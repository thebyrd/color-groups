var App = {
  createMatrix: function (n, m) {
    var matrix = [];
    for (var i = 0; i < n; i++) {
      matrix[i] = [];
      for (var j = 0; j < m; j++) {
        matrix[i].push(Math.round(Math.random())); 
      }
    }
    return matrix; 
  }
};

var Cell = function (x, y) {
  this.x = x;
  this.y = y;
  this.id = this.x + '.' + this.y;
};

function Grid (height, width) {
  this.height = height;
  this.width = width;
  this.cellsByID = {};
  this.neighborsByCellID = {};
  var matrix = App.createMatrix(this.height, this.width);
  this.populateMaps(matrix);
  this.setColors();
}

var count = 0;

Grid.prototype.populateMaps = function (binaryMatrix) {
  var m = binaryMatrix;
  for (var y = 0; y < m.length; y++) {
    for (var x = 0; x < m[y].length; x++) {
      var hasColor = m[y][x];
      if (hasColor) {

        /* get neighbors */
        var neighbors = [];

        if (m[y-1]    !== undefined && m[y-1][x]) neighbors.push( new Cell(x, y-1) );
        if (m[y+1]    !== undefined && m[y+1][x]) neighbors.push( new Cell(x, y+1) );
        if (m[y][x-1] !== undefined && m[y][x-1]) neighbors.push( new Cell(x-1, y) );
        if (m[y][x+1] !== undefined && m[y][x+1]) neighbors.push( new Cell(x+1, y) );

        var cell = new Cell(x,y);

        this.cellsByID[cell.id] ? 
          cell = this.cellsByID[cell.id] : this.cellsByID[cell.id] = cell

        this.neighborsByCellID[cell.id] = neighbors;

        for (var i = 0; i < neighbors.length; i++) this.cellsByID[neighbors[i].id] = neighbors[i];
        
      }
    }
  }
};

Grid.prototype.setColors = function () {
  var color;
  for (var id in this.cellsByID) {
    var cell = this.cellsByID[id];
    if (cell.color === undefined) {

      color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      cell.color = color;

      var queue = [];
      queue.push(cell);
      while (queue.length > 0) {
        var next = queue.shift();
        var neighbors = this.neighborsByCellID[next.id];
        for (var i = 0; i < neighbors.length; i++) {
          var n = neighbors[i];
          if (n.color === undefined) {
            n.color = color;
            queue.push(n);
          }
        }
      }
    }
  }
};

Grid.prototype.render = function () {

  var c1 = document.getElementsByClassName('grayscale')[0];
  var cntxt1 = c1.getContext('2d');
  for (var id1 in this.cellsByID) {
    var cell1 = this.cellsByID[id1];
    cntxt1.fillStyle = 'black';
    cntxt1.fillRect(20 * cell1.x, 20 * cell1.y, 20, 20);
  }

  var c2 = document.getElementsByClassName('colorful')[0];
  var cntxt2 = c2.getContext('2d');
  for (var id2 in this.cellsByID) {
    var cell2 = this.cellsByID[id2];
    cntxt2.fillStyle = cell2.color || '#fff';
    cntxt2.fillRect(20 * cell2.x, 20 * cell2.y, 20, 20);
  }
};

var g = new Grid(20, 20);
g.render();