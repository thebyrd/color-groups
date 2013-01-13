# Obvious Coding Test #
## Problem ##
Given a random matrix, where each cell is either 1 or 0, determine the groups of contiguous cells that have the value 1. Cells are considered contiguous if they are neighboring to the north, south, east, or west; i.e. no diagonals.

## Solution ##
* Iterate through every element in the array that needs color and cast the binary cell to a Cell object. Store these cells in a map where a unique id is the key.
* Also, find all of the cells that are 'neighbors' and add them to a map where the key is the cell's id.
* When you've found all of the neighbors, you can find each group by getting a cell's neighbors changing their colors and then performing the same operation on each one of the neighbors ... neighbors. Stop when there are no more neighbors and then continue the loop and do the same thing for its 'tree' of neighbors. Make sure you only do this if the color has not been set yet.
