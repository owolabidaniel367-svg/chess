// ======================================================
// CHESS AI ENGINE (MINIMAX CORE)
// ======================================================

// Piece encoding system:
// Positive = White
// Negative = Black
// Absolute value = piece type
//
// 1 pawn
// 2 knight
// 3 bishop
// 4 rook
// 5 queen
// 6 king

// ======================================================
// CONSTANTS
// ======================================================
import { getSquares } from "./Engine.js";
const PAWN = 1;
const KNIGHT = 2;
const BISHOP = 3;
const ROOK = 4;
const QUEEN = 5;
const KING = 6;

// ======================================================
// INITIAL BOARD (8x8 matrix)
// ======================================================

let board = Array.from({ length: 8 }, () => Array(8).fill(0));

// ======================================================
// PIECE SETUP
// ======================================================

export const piece = {
    white: {
        pawn: 1,
        knight: 2,
        bishop: 3,
        rook: 4,
        queen: 5,
        king: 6,
    },
    black: {
        pawn: -1,
        knight: -2,
        bishop: -3,
        rook: -4,
        queen: -5,
        king: -6,
    }
};

// ======================================================
// PLACE PIECE ON BOARD
// ======================================================

function set(type, color, row, col) {
    board[row][col] = piece[color][type];
}

// ======================================================
// INITIAL SETUP
// ======================================================

function setPiece() {

    // pawns
    for (let i = 0; i < 8; i++) {
        set("pawn", "white", 6, i);
        set("pawn", "black", 1, i);
    }

    // rooks
    set("rook", "white", 7, 0);
    set("rook", "white", 7, 7);
    set("rook", "black", 0, 0);
    set("rook", "black", 0, 7);

    // knights
    set("knight", "white", 7, 1);
    set("knight", "white", 7, 6);
    set("knight", "black", 0, 1);
    set("knight", "black", 0, 6);

    // bishops
    set("bishop", "white", 7, 2);
    set("bishop", "white", 7, 5);
    set("bishop", "black", 0, 2);
    set("bishop", "black", 0, 5);

    // queens
    set("queen", "white", 7, 3);
    set("queen", "black", 0, 3);

    // kings
    set("king", "white", 7, 4);
    set("king", "black", 0, 4);
}

setPiece();

// ======================================================
// PIECE VALUES (EVALUATION FUNCTION)
// ======================================================

const pieceValue = {
    1: 1,
    2: 3,
    3: 3,
    4: 5,
    5: 9,
    6: 100
};

// ======================================================
// BOARD EVALUATION
// ======================================================

function evaluateGame(board) {
    let score = 0;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            const p = board[r][c];
            if (p === 0) continue;

            const value = pieceValue[Math.abs(p)];
            score += p > 0 ? value : -value;
        }
    }

    return score;
}

// ======================================================
// UTILITIES
// ======================================================

function inside(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function enemy(p1, p2) {
    return (p1 > 0 && p2 < 0) || (p1 < 0 && p2 > 0);
}

function cloneBoard(board) {
    return board.map(row => [...row]);
}

// ======================================================
// MOVE GENERATION
// ======================================================

function lineMoves(board, row, col, directions) {

    const piece = board[row][col];
    const moves = [];

    for (let [dx, dy] of directions) {

        let r = row + dx;
        let c = col + dy;

        while (inside(r, c)) {

            const target = board[r][c];

            if (target === 0) {
                moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c });
            } else {

                if (enemy(piece, target)) {
                    moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c });
                }

                break;
            }

            r += dx;
            c += dy;
        }
    }

    return moves;
}

// ======================================================
// PIECE MOVES
// ======================================================

function getPseudoMoves(board, row, col) {

    const piece = board[row][col];
    if (piece === 0) return [];

    const type = Math.abs(piece);
    const moves = [];

    // -------------------
    // PAWN
    // -------------------
    if (type === PAWN) {

        const dir = piece > 0 ? -1 : 1;

        if (inside(row + dir, col) && board[row + dir][col] === 0) {
            moves.push({ fromRow: row, fromCol: col, toRow: row + dir, toCol: col });

            const start = piece > 0 ? 6 : 1;

            if (row === start && board[row + 2 * dir][col] === 0) {
                moves.push({ fromRow: row, fromCol: col, toRow: row + 2 * dir, toCol: col });
            }
        }

        for (let offset of [-1, 1]) {
            let r = row + dir;
            let c = col + offset;

            if (!inside(r, c)) continue;

            if (enemy(piece, board[r][c])) {
                moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c });
            }
        }
    }

    // -------------------
    // KNIGHT
    // -------------------
    if (type === KNIGHT) {
        const dirs = [
            [2,1],[2,-1],[-2,1],[-2,-1],
            [1,2],[1,-2],[-1,2],[-1,-2]
        ];

        for (let [dx, dy] of dirs) {
            let r = row + dx, c = col + dy;

            if (inside(r, c) && !enemy(piece, board[r][c])) {
                moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c });
            }
        }
    }

    // -------------------
    // BISHOP / ROOK / QUEEN
    // -------------------
    if (type === BISHOP) {
        return lineMoves(board, row, col, [[1,1],[1,-1],[-1,1],[-1,-1]]);
    }

    if (type === ROOK) {
        return lineMoves(board, row, col, [[1,0],[-1,0],[0,1],[0,-1]]);
    }

    if (type === QUEEN) {
        return lineMoves(board, row, col, [
            [1,0],[-1,0],[0,1],[0,-1],
            [1,1],[1,-1],[-1,1],[-1,-1]
        ]);
    }

    // -------------------
    // KING
    // -------------------
    if (type === KING) {

        const dirs = [
            [1,0],[1,1],[0,1],
            [-1,0],[-1,-1],
            [0,-1],[1,-1],[-1,1]
        ];

        for (let [dx, dy] of dirs) {
            let r = row + dx, c = col + dy;

            if (inside(r, c) &&  !enemy(piece, board[r][c])) {
                moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c });
            }
        }
    }

    return moves;
}

// ======================================================
// APPLY MOVE
// ======================================================

function applyMove(board, move) {
    const piece = board[move.fromRow][move.fromCol];

    board[move.toRow][move.toCol] = piece;
    board[move.fromRow][move.fromCol] = 0;
}

// ======================================================
// ALL MOVES FOR COLOR
// ======================================================

function getAllMoves(board, color) {

    const moves = [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            const p = board[r][c];
            if (p === 0) continue;

            if (color === "white" && p < 0) continue;
            if (color === "black" && p > 0) continue;

            moves.push(...getPseudoMoves(board, r, c));
        }
    }

    return moves;
}

// ======================================================
// MINIMAX CORE
// ======================================================

function minimax(board, depth, alpha, beta, isMaximizing) {

    if (depth === 0) {
        return evaluateGame(board);
    }

    const color = isMaximizing ? "white" : "black";
    const moves = getLegalMoves(board, color);

    if (moves.length === 0) {
        return evaluateGame(board);
    }

    if (isMaximizing) {

        let best = -Infinity;

        for (let move of moves) {

            const newBoard = cloneBoard(board);
            applyMove(newBoard, move);

            const score = minimax(
                newBoard,
                depth - 1,
                alpha,
                beta,
                false
            );

            best = Math.max(best, score);

            alpha = Math.max(alpha, best);

            if (beta <= alpha) {
                break; // prune
            }
        }

        return best;

    } else {

        let best = Infinity;

        for (let move of moves) {

            const newBoard = cloneBoard(board);
            applyMove(newBoard, move);

            const score = minimax(
                newBoard,
                depth - 1,
                alpha,
                beta,
                true
            );

            best = Math.min(best, score);

            beta = Math.min(beta, best);

            if (beta <= alpha) {
                break; // prune
            }
        }

        return best;
    }
}


// ======================================================
// BEST MOVE PICKER (AI)
// ======================================================

export function getBestMove(boards) {

    const moves = getLegalMoves(boards, "black");

    let bestMove = null;
    let bestScore = Infinity;

    for (let move of moves) {

        const newBoard = cloneBoard(boards);
        applyMove(newBoard, move);

        const score = minimax(
    newBoard,
    3,
    -Infinity,
    Infinity,
    true
);

        if (score < bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}









function isKingInCheck(board, color) {
    const kingValue = color === "white" ? KING : -KING;
    let kingRow, kingCol;

    // Locate the King
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === kingValue) {
                kingRow = r;
                kingCol = c;
                break;
            }
        }
    }

    // Check if any enemy piece can attack the King's square
    // We treat the board as if it's the enemy's turn to see if they can hit the king
    const enemyColor = color === "white" ? "black" : "white";
    const enemyMoves = getAllMoves(board, enemyColor);

    return enemyMoves.some(move => move.toRow === kingRow && move.toCol === kingCol);
}

function getLegalMoves(board, color) {
    const allMoves = getAllMoves(board, color);
    return allMoves.filter(move => {
        const tempBoard = cloneBoard(board);
        applyMove(tempBoard, move);
        return !isKingInCheck(tempBoard, color);
    });
}
