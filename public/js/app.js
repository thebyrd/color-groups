// Copyright 2013 David Byrd.

/**
 * @fileoverview The following program visually 
 * identifies groups of cells that are contiguous.
 */

/**
 * Help is a singleton that groups functions that are not my original work
 */
var Help = {

/**
 * Generates a binary matrix that is n by m elements large
 * @param {number} n is the height of the matrix
 * @param {number} m is the width of the matrix
 * @return {array.<array<number>>}
 */
  createMatrix: function (n, m) { //From the Problem Handout
    var matrix = []
    for (var i = 0; i < n; i++) {
      matrix[i] = []
      for (var j = 0; j < m; j++) {
        matrix[i].push(Math.round(Math.random()));
      }
    } 
    return matrix 
  },
/**
 * Generates a random color is hex value form. This is an adapted 
 * version of an approach I saw on Paul Irish's Blog.
 * @return {string}
 */
  randColor: function () {
    return '#' + ((Math.random() * 0xEEEEEE << 0) + (0x100000 << 0)).toString(16)
  }
}


/**
 * Cell is a programmatic representation of a filled cell on a grid
 * @param {number} x The x coordinate that the cell inhabits on a grid
 * @param {number} y The y coordinate that the cell inhabits on a grid
 * @constructor
 */
var Cell = function (x, y) {
  this.x = x
  this.y = y
  this.id = '['+this.x + '.' + this.y + ']'
}

/**
 * Grid is a container for cells that knows each cell's neighbors. It can
 * also render itself on a webpage
 * @param {number} height The height of the grid in abstract units
 * @param {number} width The width of the grid in abstract units
 * @constructor
 */
function Grid (height, width) {
  this.height = height
  this.width = width

  this.cellsByID = {}
  this.neighborsByCellID = {}

  var matrix = Help.createMatrix(this.height, this.width)

  this.populateMaps(matrix)
  this.setColors()
}


/**
 * Populates cellsByID and neighborsByCellID for an instance of Grid
 * @param {array.<array<number>>} binaryMatrix is a 2-dimensional
 * array of 1s and 0s that represent which cells are colored.
 */
Grid.prototype.populateMaps = function (binaryMatrix) {
  var m = binaryMatrix
  for (var y = 0; y < m.length; y++) {
    for (var x = 0; x < m[y].length; x++) {
      var hasColor = m[y][x]
      if (hasColor) {

        // if the cell already exists in the cellsByID map use that cell for storing neighbors
        var cell = new Cell(x, y)
        this.cellsByID[cell.id] ? 
            cell = this.cellsByID[cell.id] : this.cellsByID[cell.id] = cell

        // get neighbors (left, right, bottom, top)
        var neighbors = [];

        if (m[y-1] !== undefined && m[y-1][x]) 
          neighbors.push(new Cell(x, y-1))

        if (m[y+1] !== undefined && m[y+1][x]) 
          neighbors.push(new Cell(x, y+1))

        if (m[y][x-1] !== undefined && m[y][x-1]) 
          neighbors.push(new Cell(x-1, y))

        if (m[y][x+1] !== undefined && m[y][x+1]) 
          neighbors.push(new Cell(x+1, y))

        //add neighbors to cellsByID
        for (var i = 0; i < neighbors.length; i++) 
          this.cellsByID[neighbors[i].id] = neighbors[i]

        this.neighborsByCellID[cell.id] = neighbors
        
      }
    }
  }
}

/**
 * Iterates through every cell that is stored in 
 * cellsByID of a particular instance of Grid
 * and assigns a random color to each cell
 * based on the color of contiguous cells
 */
Grid.prototype.setColors = function () {
  for (var id in this.cellsByID) {

    var cell = this.cellsByID[id]
    if (cell.color === undefined) {

      var color = Help.randColor()
        , q = []

      cell.color = color
      q.push(cell)

      while (q.length > 0) {

        var next = q.shift()
          , neighbors = this.neighborsByCellID[next.id]

        for (var i = 0; i < neighbors.length; i++) {
          
          if (neighbors[i].color === undefined) {
            neighbors[i].color = next.color
            q.push(neighbors[i])
          }

        }

      }
    }
  }
}


/**
 * Displays a particular instance of Grid
 * on a webpage as a black & white canvas element
 * and a colored canvas element
 */
Grid.prototype.render = function () {

  //draw black & white canvas
  var grayCnvs = document.getElementsByClassName('grayscale')[0]
    , grayCntxt = grayCnvs.getContext('2d')

  grayCntxt.fillStyle = 'black'

  for (var grayID in this.cellsByID) {
    var grayCell = this.cellsByID[grayID]
    grayCntxt.fillRect(8 * grayCell.x, 8 * grayCell.y, 8, 8)
  }

  //draw colored canvas
  var colorCnvs = document.getElementsByClassName('colorful')[0]
    ,  colorCntxt = colorCnvs.getContext('2d')

  for (var colorID in this.cellsByID) {
    var coloredCell = this.cellsByID[colorID]

    colorCntxt.fillStyle = coloredCell.color
    colorCntxt.fillRect(8 * coloredCell.x, 8 * coloredCell.y, 8, 8)

  }

}