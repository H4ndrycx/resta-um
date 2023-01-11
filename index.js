const domqs = document.querySelector.bind(document);
let initBoard = [
    [1,1,1],
    [1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1],
    [1,1,1],
];

function createInitBoard() {
    initBoard.forEach(arr => {
        if(arr.length === 3) {
            for(let i = 0; i < 2; i++) {
                arr.push(null);
                arr.unshift(null);
            }
        }
    })
    
    return initBoard;
}

//     board
//    [1,1,1],
//    [1,1,1],
//[1,1,1,1,1,1,1],
//[1,1,1,0,1,1,1],
//[1,1,1,1,1,1,1],
//    [1,1,1],
//    [1,1,1],

class Game {
    constructor() {
        this.board = createInitBoard();
        this.start();
    }

    showBoard () {
        this.board.forEach((_value, idx) => {
            this.showRow(idx);
        })
    }

    showRow(idx) {
        const row = this.board[idx].filter(value => value != null);
        const center = (idx <= 1) || (idx > (this.board.length - 3));
        if(center) {
            console.log('   ', row.join('|'));
            return;
        }
        console.log(row.join('|'));
    }

    isLimitSpace(row, col) {
        if(typeof this.board[row][col] !== 'number') {
            return true;
        }

        return false;
    }

    verifyCorretMove() {
        const {row: endRow, col: endCol} = this.getEndPosition(
            this.row, 
            this.col, 
            this.direction
        );

        const {row: eatItemRow, col: eatItemCol} = this.getEatItem(
            this.row, 
            this.col, 
            this.direction
        );

        const isEatItem = this.board[eatItemRow][eatItemCol] === 1;
        const isItemOnStartSpace = this.board[this.row][this.col] === 1;
        const isItemOnEndSpace = this.board[endRow][endCol] === 1;

        if(!isItemOnStartSpace){
            throw new Error('Not a item to execute action');
        }
        if(isItemOnEndSpace){
            throw new Error('It end space moviment already occupied');
        }
        if(!isEatItem){
            throw new Error('Not item to eat');
        }
        if(this.isLimitSpace(endRow, endCol)){
            throw new Error('Moving Incorret because not space to moviments');
        }

        return true;
    }

    getEndPosition (row, col, direction) {

        switch(direction) {
            case 'right':
                col += 2;
                break;
            case 'left':
                col -= 2;
                break;
            case 'top':
                row -= 2;
                break;
            case 'bottom':
                row += 2;
                break;
            default:
                throw new Error('Incorret direction');
        }

        return {row, col};

    }

    getEatItem (row, col, direction) {

        switch(direction) {
            case 'right':
                col += 1;
                break;
            case 'left':
                col -= 1;
                break;
            case 'top':
                row -= 1;
                break;
            case 'bottom':
                row += 1;
                break;
            default:
                throw new Error('Incorret direction');
        }
        
        return {row, col};

    }

    moveItem () {
        this.board[this.row][this.col] = 0;

        const {row, col} = this.getEndPosition(
            this.row, 
            this.col, 
            this.direction
        );

        this.row = row;
        this.col = col;

        this.board[this.row][this.col] = 1;
        return {
            row: this.row, 
            col: this.col
        };

    }

    eatItem() {
        const {row, col} = this.getEatItem(
            this.row, 
            this.col, 
            this.direction
        );

        this.board[row][col] = 0;
    }

    play(row, col, direction) {
        this.row = row;
        this.col = col;
        this.direction = direction;

        try {
            this.verifyCorretMove();
            this.eatItem();
            this.moveItem();
            this.showBoard();
        }
        catch(ex) {
            console.log('Error: ', ex);
        }
    }

    start() {
    }

}

const game = new Game;

function renderBoard(board) {
    const element = domqs('#board');

    let rows = "";
    board.forEach((_value, idx) => {
        rows += getRowHtml(idx, board);
    });

    element.innerHTML = rows;
}

function getRowHtml(idx, board) {
    let columns = "";

    board[idx].forEach((value, idx) => {
        columns += `<div class="col" id=${idx} data-value=${value}></div>`
    });

    const row = `
        <div class="row" id=${idx}>
            ${columns}
        </div>
    `;

    return row;
}

renderBoard(game.board);
