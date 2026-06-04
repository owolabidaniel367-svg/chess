import { getSquares } from "./another.js"
import {
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING
} from "./constants.js"


let board = Array.from({length:8},
    ()=>Array(8).fill(0))
    console.log(board)
    const piece = {

    white: {
        pawn: 1,
        rook: 4,
        knight: 2,
        bishop: 3,
        queen: 5,
        king: 6,
    },

    black: {
        pawn: -1,
        rook: -4,
        knight: -2,
        bishop: -3,
        queen: -5,
        king: -6,
    }
}
function set(type,color,x,y){

    board[x][y] = piece[color][type]
    
}
function setPiece(){
// pawns
for(let i = 0; i < 8; i++){

    set("pawn","white",6,i)
    set("pawn","black",1,i)
}

// rooks
set("rook","white",7,0)
set("rook","white",7,7)

set("rook","black",0,0)
set("rook","black",0,7)

// knights
set("knight","white",7,1)
set("knight","white",7,6)

set("knight","black",0,1)
set("knight","black",0,6)

// bishops
set("bishop","white",7,2)
set("bishop","white",7,5)

set("bishop","black",0,2)
set("bishop","black",0,5)

// queens
set("queen","white",7,3)
set("queen","black",0,3)

// kings
set("king","white",7,4)
set("king","black",0,4)

// ==========================================================
// MOVED FLAGS
// ==========================================================

// squares[7][4].dataset.moved = "false"
// squares[0][4].dataset.moved = "false"

// squares[7][0].dataset.moved = "false"
// squares[7][7].dataset.moved = "false"

// squares[0][0].dataset.moved = "false"
// squares[0][7].dataset.moved = "false"

// ==========================================================
// HANDLE CLICK
// ==========================================================
}
setPiece()
console.log(board)
const pieceValue = {
    1:1,
    2:3,
    3:3,
    4:5,
    5:9,
    6:100
}
function evaluateGame(board) {
    let score = 0
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if(piece == 0) continue;
            const value = pieceValue[Math.abs(piece)];
            score += piece>0? value:-value;
        }
        
    }
    return score
}
function convert(state) {

    return state.map(row =>
        row.map(square => {

            const color = square.dataset.color
            const type = square.dataset.type

            return color && type
                ? piece[color][type]
                : 0
        })
    )
}

function getPseudoMoves(board, row, col) {

    const piece = board[row][col]

    if(piece === 0) return []

    const moves = []

    const type = Math.abs(piece)

    // =========================
    // PAWN
    // =========================

    if(type === PAWN) {

        const dir = piece > 0 ? -1 : 1

        // forward
        if(
            inside(row + dir, col) &&
            board[row + dir][col] === 0
        ) {

            moves.push({
                fromRow: row,
                fromCol: col,
                toRow: row + dir,
                toCol: col
            })

            // double move
            const startRow =
                piece > 0 ? 6 : 1

            if(
                row === startRow &&
                board[row + dir * 2][col] === 0
            ) {

                moves.push({
                    fromRow: row,
                    fromCol: col,
                    toRow: row + dir * 2,
                    toCol: col
                })
            }
        }

        // captures
        ;[-1, 1].forEach(offset => {

            const r = row + dir
            const c = col + offset

            if(!inside(r, c)) return

            const target = board[r][c]

            if(
                target !== 0 &&
                enemy(piece, target)
            ) {

                moves.push({
                    fromRow: row,
                    fromCol: col,
                    toRow: r,
                    toCol: c
                })
            }
        })
    }

    // =========================
    // KNIGHT
    // =========================

    if(type === KNIGHT) {

        const knightMoves = [
            [2,1],[2,-1],
            [-2,1],[-2,-1],
            [1,2],[1,-2],
            [-1,2],[-1,-2]
        ]

        knightMoves.forEach(([dx,dy]) => {

            const r = row + dx
            const c = col + dy

            if(!inside(r,c)) return

            const target = board[r][c]

            if(
                target === 0 ||
                enemy(piece,target)
            ) {

                moves.push({
                    fromRow: row,
                    fromCol: col,
                    toRow: r,
                    toCol: c
                })
            }
        })
    }

    // =========================
    // BISHOP
    // =========================

    if(type === BISHOP) {

        return lineMoves(board,row,col,[
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1]
        ])
    }

    // =========================
    // ROOK
    // =========================

    if(type === ROOK) {

        return lineMoves(board,row,col,[
            [1,0],
            [-1,0],
            [0,1],
            [0,-1]
        ])
    }

    // =========================
    // QUEEN
    // =========================

    if(type === QUEEN) {

        return lineMoves(board,row,col,[
            [1,0],
            [-1,0],
            [0,1],
            [0,-1],
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1]
        ])
    }

    // =========================
    // KING
    // =========================

    if(type === KING) {

        const kingMoves = [
            [1,0],[1,1],[0,1],
            [-1,0],[-1,-1],
            [0,-1],[1,-1],[-1,1]
        ]

        kingMoves.forEach(([dx,dy]) => {

            const r = row + dx
            const c = col + dy

            if(!inside(r,c)) return

            const target = board[r][c]

            if(
                target === 0 ||
                enemy(piece,target)
            ) {

                moves.push({
                    fromRow: row,
                    fromCol: col,
                    toRow: r,
                    toCol: c
                })
            }
        })
    }

    return moves
}
// SELF EXPLANOTORY 
function isWhite(piece) {
    return piece > 0
}


function isBlack(piece) {
    return piece < 0
}
// function that checks if two pieces are enemies or friends

function enemy(piece1, piece2) {

    if(piece1 > 0 && piece2 < 0) return true
    if(piece1 < 0 && piece2 > 0) return true

    return false
}
// function to return whether an entry is legal
function inside(row, col) {

    return (
        row >= 0 &&
        row < 8 &&
        col >= 0 &&
        col < 8
    )
}

function lineMoves(board, row, col, directions) {

    const piece = board[row][col]

    const moves = []

    directions.forEach(([dx, dy]) => {

        let r = row + dx
        let c = col + dy

        while(inside(r, c)) {

            const target = board[r][c]

            if(target === 0) {

                moves.push({
                    fromRow: row,
                    fromCol: col,
                    toRow: r,
                    toCol: c
                })
            }

            else {

                if(enemy(piece, target)) {

                    moves.push({
                        fromRow: row,
                        fromCol: col,
                        toRow: r,
                        toCol: c
                    })
                }

                break
            }

            r += dx
            c += dy
        }
    })

    return moves
}
















function blockIllegalMove(row, col,moves, state){
    const piecee = state[row][col]
    let legalMoves = []

    let color = piecee>0 ? "white":"black"

    let enemyColor =
        color === "white"
        ? "black"
        : "white"

    let startX = row
    let startY = col

    let type = Math.abs(piece)
     
    moves.forEach(move => {

        let endX = move[toRow]
        let endY = move[toCol]

        let capturedType = Math.abs(state[toRow][toCol])
        let capturedColor = move.dataset.color
        let capturedHTML = move.innerHTML

        // simulate
        remove(startX,startY,true)

        if(capturedType){

            remove(endX,endY,true)
        }

        set(type,color,endX,endY,true)

        let king = loop_through("king",color)[0]

        let enemyAttacks = king_check(enemyColor)

        if(!enemyAttacks.includes(king)){

            legalMoves.push(move)
        }

        // undo simulation
        remove(endX,endY,true)

        set(type,color,startX,startY,true)

        if(capturedType){

            set(
                capturedType,
                capturedColor,
                endX,
                endY,
                true
            )

            squares[endX][endY].innerHTML = capturedHTML
        }
    })

    return legalMoves
}