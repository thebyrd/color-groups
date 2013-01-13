# Medium Coding Test #
## Problem ##

## Solution ##
- Cell
  * x, y
  * isFilled
  * topCell, leftCell, rightCell, bottomCell

- Grid
  * is functionally just an array of non touching cells 
  * has some type of validation to make sure its a rectangle

- GridFactory (binary[][])
  * goes through the matrix and creates a grid object with arrays of groups.

- GridView (Grid)
  * will show the grid in HTML in both grayscale and color next to each other
  * it should also have a button for refreshing