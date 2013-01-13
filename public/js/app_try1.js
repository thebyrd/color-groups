//'#'+Math.floor(Math.random()*16777215).toString(16);
var Cell = function (coordinates, neighbors) {
  
  this.x = coordinates.x;
  this.y = coordinates.y;

  this.neighbors = neighbors;

};

var Group = function (cells) {
  this.cells = cells;
};

Group.prototype.touching = function (cell) {
  for(var i = 0; i < this.cells.length; i++) {
    var c = this.cells[i];
    if (c.neighbors.indexOf(cell) != -1) {
      return true;
    }
  }
  return false;
};

Group.prototype.add = function (cell) {
  this.cells.push(cell);
  console.log(cell);
};



var Grid = function (binaryMatrix) {
  this.matrix = binaryMatrix;
  this.groups = [];
  this.buildGroups();
};

Grid.prototype.buildGroups = function () {
  for(var i = 0; i < this.matrix.length; i++) {
    console.log('row #' + i + ' of ' + (this.matrix.length - 1));
    for(var j = 0; j < this.matrix[i].length; j++) {
      console.log(j + ' of ' + (this.matrix[i].length - 1)  + ':');
      var isFilled = this.matrix[i][j];
      if (isFilled){ 
        
        var coordinates = { x: j, y: i };

        var neighbors = [];

        var rowAbove = this.matrix[i-1];
        if (rowAbove) neighbors.push(rowAbove[j]);

        var rowBelow = this.matrix[i+1];
        if (rowBelow) neighbors.push(rowBelow[j]);

        var leftNeighbor = this.matrix[i][j-1];
        if (leftNeighbor) neighbors.push(leftNeighbor);

        var rightNeighbor = this.matrix[i][j+1];
        if (rightNeighbor) neighbors.push(rightNeighbor);

        var c = new Cell(coordinates, neighbors);

        if (this.groups.length === 0) {
          this.groups.push(new Group([c]));
        } else {
          
          // THIS IS WHERE I STOPPED
          var len = this.groups.length;

          for (var x = 0; x < len; x++) {
            this.groups[x].touching(c) ?
              this.groups[x].add(c) : this.groups.push(new Group([c]));
          }


        }

      }
    }
  }
};



var GridView = function (grid) {
  this.grid = grid;
  console.log(this.grid.groups);
};

GridView.prototype.render = function () {
  document.getElementsByTagName('h1')[0].innerHTML = "GridView Working";
};




var App = function () {
  this.generate();
};
App.prototype = {
  generate: function () {
    var m = this.createRandomMatrix(10, 10),
        g = new Grid(m),
        gv = new GridView(g);

    gv.render();
  },
  createRandomMatrix: function (n, m) {
    console.log('matrix created...');
    var matrix = [];
    for (var i = 0; i < n; i++) {
      matrix[i] = [];
      for (var j = 0; j < m; j++) {
        matrix[i].push(Math.round(Math.random()));
      }
      console.log(matrix[i]);
    }
    return matrix;
  }
};