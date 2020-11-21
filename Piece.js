function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; // this is the first item in the array for that tetromino
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // controlling the tetromino
    this.x = 3;
    this.y = -2;
    this.isFalling = true;
}

Piece.prototype.fill = function (color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // only draw active ones
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color, ctx, color !== VACANT);
            }
        }
    }
}

Piece.prototype.preview = function (color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // only draw active ones
            if (this.activeTetromino[r][c]) {
                drawSquare(c,r, color, prevCtx, color !== BLANK);
            }
        }
    }
}

Piece.prototype.draw = function () {
    this.fill(this.color);
}

Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}

Piece.prototype.moveDown = function () {
    // x stays same so 0
    // we drop so y = 1
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // new piece? lock this one?
        this.lock();
    }
}


// move the piece right
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}
// move the piece left
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate a piece
Piece.prototype.rotate = function () {
    let index = (this.tetrominoN + 1) % this.tetromino.length;
    let nextPattern = this.tetromino[index];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        kick = this.x > COLUMN / 2 ? -1 : 1;
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = index;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function () {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            //skip VACANT ONES
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            if (this.y + r < 0) {
                alert("game Over");
                gameOver = true;
                break;
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }
    let rowsToClear = [];
    for (let r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (let c = 0; c < COLUMN; c++) {
            isRowFull = isRowFull && board[r][c] !== VACANT;
        }
        if (isRowFull) {
            rowsToClear.push(r);
        }
    }
    // splicing out the full rows and unshifting a new one on top
    let multiplier = 1;
    rowsToClear.forEach(r => {
        board.splice(r, 1);
        board.unshift([VACANT,VACANT,VACANT,VACANT,VACANT,VACANT,VACANT,VACANT,VACANT,VACANT]);
        score += multiplier * 10;
        multiplier += 0.4
    });
    score = Math.floor(score);

    // updating the board and we are no longer falling
    drawBoard();
    this.isFalling = false;
}

Piece.prototype.collision = function (x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {
            // skip if empty
            if (!piece[r][c]) continue;

            let newX = this.x + c + x;
            let newY = this.y + r + y;
            if (newX < 0 || newX >= COLUMN || newY >= ROW) {
                return true;
            }
            if (newY < 0) {
                continue;
            }
            // Check if the spot is vacant
            if (board[newY][newX] !== VACANT) {
                return true;
            }
        }
    }
    return false; // no collision occurred
}