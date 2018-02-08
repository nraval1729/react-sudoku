import React, { Component } from 'react';
import Board from './Board';
import puzzles from './Puzzles';
import './Sudoku.css';

export default class Sudoku extends Component {
  constructor(props) {
    super(props);

    this.state = {
            boardState : this.getFormattedPuzzle(),
            history   : [],
            conflicts : new Set([])  
          };
  }

  getRandomPuzzle = () => {
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  }

  getDeepCopyOfArray = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  }

  handleSquareValueChange = (i, j, newValue) => {
    this.setState(prevState => {
      const newBoardState = this.getDeepCopyOfArray(prevState.boardState);
      const prevEditable = prevState.boardState[i][j].editable;
      newBoardState[i][j] = {
        cellValue : newValue,
        cellId    : this.stringify(i, j),
        editable  : prevEditable
      };

      // Now push the previous board state on the history stack
      const newHistory = this.getDeepCopyOfArray(prevState.history);
      newHistory.push(prevState.boardState);

      return {boardState: newBoardState, history: newHistory,conflicts : new Set([])};
    });
  }

  handleUndoClick = () => {
    this.setState(prevState => {
      const newHistory = this.getDeepCopyOfArray(prevState.history);
      const lastBoardState = newHistory.pop();

      // Now assign the previous board state as the current board state
      return {boardState:lastBoardState, history:newHistory,conflicts : new Set([])};
    });
  }

  handleNewGameClick = () => {
    this.setState({
      boardState: this.getFormattedPuzzle(),
      history   : [],
      conflicts : new Set([])
    });
  }

  handleVerifyClick = () => {
    const boardState = this.state.boardState;

    // rows[0]/cols[0] -> first row/column
    const rows = {};
    const cols = {};
    // Example: boxes['00'] -> an array of values in the first box. 
    const boxes = {};

    for(let i=0; i<boardState.length; i++) {
      rows[i] = this.getDeepCopyOfArray(boardState[i]);
      for(let j=0; j<boardState[i].length;j++) {
        // populating cols
        if(cols.hasOwnProperty(j)) {
          cols[j].push(boardState[i][j]);
        } else {
          cols[j] = [boardState[i][j]];
        }

        // populating boxes
        const boxId = this.stringify(Math.floor(i/3), Math.floor(j/3));
        if(boxes.hasOwnProperty(boxId)) {
          boxes[boxId].push(boardState[i][j]);
        } else {
          boxes[boxId] = [boardState[i][j]];
        }
      }
    }

    const rowConflicts = this.flatten(this.getConflicts(Object.values(rows)));
    const colConflicts = this.flatten(this.getConflicts(Object.values(cols)));
    const boxConflicts = this.flatten(this.getConflicts(Object.values(boxes)));

    const mergedConflicts = [...rowConflicts, ...colConflicts, ...boxConflicts];
    this.setState({conflicts: new Set(mergedConflicts)});
  }

  flatten = (a) => {
    return Array.isArray(a) ? [].concat(...a.map(this.flatten)) : a;
}

  getConflicts = (arrs) => {
    return (arrs
            .map(arr => this.getConflictsInArray(arr)));
  }

  getConflictsInArray = (arr) => {
    const conflictMap = {};
    for(let i=0; i<arr.length; i++) {
      let curr = arr[i];
      if(curr.cellValue !== "0") {
        if(conflictMap.hasOwnProperty(curr.cellValue)) {
          conflictMap[curr.cellValue].push(curr.cellId);
        } else {
          conflictMap[curr.cellValue] = [curr.cellId];
        }        
      }
    }
    return Object.values(conflictMap).filter(arr => arr.length>1); 
  }

  formatPuzzle = (puzzle) => {
    const formattedPuzzle = createArray(9, 9);
    for(let i=0; i<puzzle.length; i++) {
      const rowId = this.getRowId(i);
      const colId = this.getColId(i);

      const editable = puzzle[i] === '0' ? true : false;

      formattedPuzzle[rowId][colId] = {
                                        cellValue : puzzle[i],
                                        cellId    : this.stringify(rowId, colId),
                                        editable  : editable
                                      };
    }
    return formattedPuzzle;
  }

  stringify = (num1, num2) => {
    return num1 + '' + num2;
  }

  getRowId = (i) => {
    return Math.floor(i/9);
  }

  getColId = (i) => {
    return (i%9);
  }

  /*
    Returns a puzzle formatted like so:
      [
        [ob1, ob2, ob3],
        [.     .    . ],
        [.     .    . ],
      ]

    Where ob = {
      cellValue     : value of this cell,
      editable : true if this cell will be user defined, false otherwise
    }
  */  
  getFormattedPuzzle = () => {
    const puzzle = this.getRandomPuzzle();
    const formattedPuzzle = this.formatPuzzle(puzzle);
    return formattedPuzzle;
  }

  render() {
    return (
      <div className = "Sudoku">
        <h1 className="sudokuHeader">Sudoku!</h1>
        <Board
          boardState          = {this.state.boardState}
          conflicts           = {this.state.conflicts}
          onNewGameClick      = {this.handleNewGameClick}
          onSquareValueChange = {this.handleSquareValueChange}
          historyLength       = {this.state.history.length}
          onUndoClick         = {this.handleUndoClick}
          onVerifyClick       = {this.handleVerifyClick}
        />
      </div>
    );
  }
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
