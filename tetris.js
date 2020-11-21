const ROW = 20;
const COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = '#4e4b4b';
const BLANK = 'white';

const canvas = document.getElementById('tetris');
const preview = document.getElementById('preview');
const scoreLbl = document.getElementById('score');
const ctx = canvas.getContext('2d');
const prevCtx = preview.getContext('2d');

let board = new Array(20).fill(null).map(() => Array(10).fill(VACANT));

let prevBoard = new Array(4).fill(null).map(() => Array(4).fill(VACANT));

function drawSquare(x, y, color, canvas = ctx, hasBorder = true) {
    canvas.fillStyle = color;
    canvas.fillRect(x * SQ, y * SQ, SQ, SQ);

    if (hasBorder) {
        canvas.strokeStyle = '#949090';
        canvas.strokeRect(x * SQ + 1, y * SQ + 1, SQ - 2, SQ - 2);
    }
}

function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COLUMN; c++) {
            drawSquare(c, r, board[r][c], ctx, board[r][c] !== VACANT);
        }
    }
}

function drawPreview() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            drawSquare(c, r, BLANK, prevCtx, false);
        }
    }
}

// document listeners
document.addEventListener('keydown', CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) { p.moveLeft(); }
    else if (event.keyCode == 38) { p.rotate(); }
    else if (event.keyCode == 39) { p.moveRight(); }
    else if (event.keyCode == 40) { p.moveDown(); }
}


drawBoard();
drawPreview();

// generate random piece
function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();
let nextPiece = randomPiece();
nextPiece.preview(nextPiece.color);
let score = 0;

// controlled drop

let dropStart = Date.now();
let gameOver = false;
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    scoreLbl.innerText = score;
    if (!p.isFalling) {
        // drawPreview();
        nextPiece.preview(BLANK);
        p = nextPiece;
        // drawPreview();

        nextPiece = randomPiece();
        nextPiece.preview(nextPiece.color);
    }
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }

    if (!gameOver) {
        requestAnimationFrame(drop);
    }
};

drop();
