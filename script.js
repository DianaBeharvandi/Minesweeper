// **Display/UI**


//2.left click on tiles ( reveal a tile)
//3. rigth click on tiles ( mark a tile)
//4. check for win or lose


import {
  TILE_STATUSES, 
  createBoard, 
  markTile, 
  revealTile, 
  checkWin, 
  checkLose 
} from "./minesweeper.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;
const minesLeftText = document.querySelector("[data-mines-count]");

//Populate a board with tiles/mines
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);

const boardElement = document.querySelector(".board");
const textMessage= document.querySelector(".subtext");

board.forEach(row => {
    row.forEach(tile => {
      boardElement.append(tile.element);
      tile.element.addEventListener('click', () => {
        revealTile(board, tile);
        checkGameEnd();
      });
      tile.element.addEventListener( 'contextmenu', e => {
        e.preventDefault();
        markTile(tile);
        listMinesLeft();
      })
    });
})

boardElement.style.setProperty( "--size", BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
  }, 0);
  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if(win || lose) {
    boardElement.addEventListener('click', stopProp, {capture : true});
    boardElement.addEventListener('contextmenu', stopProp, {capture : true});
  }
  if (win) {
    textMessage.textContent = "You WIN!!!";

  }
  if (lose) {
    textMessage.textContent = "You LOSE!!!";
    board.forEach(row => {
      row.forEach(tile => {
          if(tile.mine) {
              if(tile.status === TILE_STATUSES.MARKED) {
                  markTile(tile);
              }
              revealTile(board,tile);
          }
      })
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}