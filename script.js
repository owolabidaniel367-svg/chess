// ==========================================================
// another.js
// PURE CHESS ENGINE
// ==========================================================

// ==========================================================
// BOARD
// ==========================================================

export let board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

// ==========================================================
// PIECES
// ==========================================================

export const pieces = {

    white: {
        pawn: "♙",
        rook: "♖",
        knight: "♘",
        bishop: "♗",
        queen: "♕",
        king: "♔"
    },

    black: {
        pawn: "♟",
        rook: "♜",
        knight: "♞",
        bishop: "♝",
        queen: "♛",
        king: "♚"
    }
}

// ==========================================================
// CREATE PIECE
// ==========================================================

export function createPiece(type, color) {

    return {
        type,
        color,
        moved: false
    }
}

// ==========================================================
// SET PIECE
// ==========================================================

export function setPiece(type, color, y, x) {

    board[y][x] = createPiece(type, color)
}

// ==========================================================
// REMOVE PIECE
// ==========================================================

export function removePiece(y, x) {

    board[y][x] = null
}

// ==========================================================
// GET PIECE
// ==========================================================

export function getPiece(y, x) {

    return board[y][x]
}

// ==========================================================
// MOVE PIECE
// ==========================================================

export function movePiece(fromY, fromX, toY, toX) {

    let piece = board[fromY][fromX]

    if(!piece) return

    board[toY][toX] = piece

    board[fromY][fromX] = null

    piece.moved = true
}

// ==========================================================
// CLEAR BOARD
// ==========================================================

export function clearBoard() {

    board = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null))
}

// ==========================================================
// INITIAL SETUP
// ==========================================================

export function setupBoard() {

    clearBoard()

    // ======================================================
    // PAWNS
    // ======================================================

    for(let i = 0; i < 8; i++) {

        setPiece("pawn", "white", 6, i)
        setPiece("pawn", "black", 1, i)
    }

    // ======================================================
    // ROOKS
    // ======================================================

    setPiece("rook", "white", 7, 0)
    setPiece("rook", "white", 7, 7)

    setPiece("rook", "black", 0, 0)
    setPiece("rook", "black", 0, 7)

    // ======================================================
    // KNIGHTS
    // ======================================================

    setPiece("knight", "white", 7, 1)
    setPiece("knight", "white", 7, 6)

    setPiece("knight", "black", 0, 1)
    setPiece("knight", "black", 0, 6)

    // ======================================================
    // BISHOPS
    // ======================================================

    setPiece("bishop", "white", 7, 2)
    setPiece("bishop", "white", 7, 5)

    setPiece("bishop", "black", 0, 2)
    setPiece("bishop", "black", 0, 5)

    // ======================================================
    // QUEENS
    // ======================================================

    setPiece("queen", "white", 7, 3)
    setPiece("queen", "black", 0, 3)

    // ======================================================
    // KINGS
    // ======================================================

    setPiece("king", "white", 7, 4)
    setPiece("king", "black", 0, 4)
}

// ==========================================================
// DRAW BOARD TO HTML
// ==========================================================

export function drawBoard(squares) {

    for(let y = 0; y < 8; y++) {

        for(let x = 0; x < 8; x++) {

            let piece = board[y][x]

            if(piece) {

                squares[y][x].innerHTML =
                    pieces[piece.color][piece.type]
            }

            else {

                squares[y][x].innerHTML = ""
            }
        }
    }
}

// ==========================================================
// SIMPLE PAWN MOVES
// ==========================================================

export function getPawnMoves(y, x) {

    let piece = board[y][x]

    if(!piece) return []

    let moves = []

    let dir =
        piece.color === "white"
        ? -1
        : 1

    // forward move
    if(
        board[y + dir] &&
        !board[y + dir][x]
    ) {

        moves.push([y + dir, x])
    }

    // captures
    if(
        board[y + dir]?.[x + 1] &&
        board[y + dir][x + 1].color !== piece.color
    ) {

        moves.push([y + dir, x + 1])
    }

    if(
        board[y + dir]?.[x - 1] &&
        board[y + dir][x - 1].color !== piece.color
    ) {

        moves.push([y + dir, x - 1])
    }

    return moves
}