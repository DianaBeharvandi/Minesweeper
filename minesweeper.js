//**Logic of the game**

export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE : "mine",
    NUMBER: "number",
    MARKED: "marked"
}

export function createBoard(boardSize, numberOfMines) {
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);

    for(let x = 0; x < boardSize; x++) {
        const row = [];
        for(let y = 0; y < boardSize; y++) {
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(p => positionMatch(p, {x, y})),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                },
            }
            row.push(tile);
        }
        board.push(row);
    }
    return board;
}

export function revealTile(board, tile) {
    if(tile.status !== TILE_STATUSES.HIDDEN) {
        return;
    }
    if(tile.mine) {
        tile.status = TILE_STATUSES.MINE;
        return;
    } 
    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const mines = adjacentTiles.filter(t => t.mine);
    if(mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board));
    } else {
        tile.element.textContent = mines.length;
    }
}
export function markTile(tile) {
    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
        return;
    }
    if(tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN;
    } else { 
        tile.status = TILE_STATUSES.MARKED;
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER || (tile.status === TILE_STATUSES.HIDDEN && tile.mine) || (tile.status === TILE_STATUSES.MARKED && tile.mine);
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE;
        })
    })
}

function nearbyTiles(board, {x, y}) {
    const tiles = [];

    for(let xOffSet = -1; xOffSet <= 1; xOffSet++) {
        for(let yOffSet = -1; yOffSet <= 1; yOffSet++) {
            const tile = board[x + xOffSet]?.[y + yOffSet];
            if (tile) {
                tiles.push(tile);
            }
        }
    }
    return tiles;
}

function getMinePositions (boardSize, numberOfMines) {
    const positions = [];

    while(positions.length < numberOfMines) {
        const position = {
            x : randomNumber(boardSize),
            y : randomNumber(boardSize) 
        }
        if(!positions.some(p => positionMatch(p, position))) {
            positions.push(position);

        }
    }
    return positions;
}

function positionMatch(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

function randomNumber(boardSize) {
    return Math.floor(Math.random() * boardSize) ;
}

