// ======================================================
// CHESS AI ENGINE (MINIMAX CORE) Yayyyyyy
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
// getSquares is where we get the move from  don't forget
// const gameState = {
//     board,

//     whiteKingMoved: false,
//     blackKingMoved: false,

//     whiteLeftRookMoved: false,
//     whiteRightRookMoved: false,

//     blackLeftRookMoved: false,
//     blackRightRookMoved: false
// };


const PAWN = 1;
const KNIGHT = 2;
const BISHOP = 3;
const ROOK = 4;
const QUEEN = 5;
const KING = 6;
const promotions = [QUEEN, ROOK, BISHOP, KNIGHT];
// piece evaluation table 
const knightTable = [
    [-5,-4,-3,-3,-3,-3,-4,-5],
    [-4,-2, 0, 0, 0, 0,-2,-4],
    [-3, 0, 1, 2, 2, 1, 0,-3],
    [-3, 1, 2, 3, 3, 2, 1,-3],
    [-3, 0, 2, 3, 3, 2, 0,-3],
    [-3, 1, 1, 2, 2, 1, 1,-3],
    [-4,-2, 0, 1, 1, 0,-2,-4],
    [-5,-4,-3,-3,-3,-3,-4,-5]
];
const pawnTable = [
    [7,7,7,7,7,7,7,7],
    [5,5,5,5,5,5,5,5],
    [1,1,2,3,3,2,1,1],
    [0,0,0,2,2,0,0,0],
    [0,0,0,-2,-2,0,0,0],
    [1,-1,-2,0,0,-2,-1,1],
    [1,2,2,-2,-2,2,2,1],
    [0,0,0,0,0,0,0,0]
];
const queenTable = [
  [-20, -10, -10,  -5,  -5, -10, -10, -20],
  [-10,   0,   0,   0,   0,   0,   0, -10],
  [-10,   0,   5,   5,   5,   5,   0, -10],
  [ -5,   0,   5,   5,   5,   5,   0,  -5],
  [  0,   0,   5,   5,   5,   5,   0,  -5],
  [-10,   5,   5,   5,   5,   5,   0, -10],
  [-10,   0,   5,   0,   0,   0,   0, -10],
  [-20, -10, -10,  -5,  -5, -10, -10, -20]
]
const rookTable = [
  [ 0,  0,  0,  5,  5,  0,  0,  0],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [ 5, 10, 10, 10, 10, 10, 10,  5],
  [ 0,  0,  0,  0,  0,  0,  0,  0]
]
const bishopTable = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];
const kingTable = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
];

// ======================================================
// INITIAL BOARD (8x8 matrix)
// ======================================================


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
// PIECE VALUES (EVALUATION FUNCTION)
// ======================================================

const pieceValue = {
    1: 100,
    2: 300,
    3: 350,
    4: 500,
    5: 900,
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
            score += p > 0 ? (value + getPositionalBonus(p, r, c) ) : (-value  - getPositionalBonus(p, r, c)) ;
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

function getPseudoMoves(gameState, row, col) {
    let board = gameState.board
    
    const piece = board[row][col];
    let side = piece>0 ? 7:0
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
                const last_square = piece > 0 ? 1 : 6;
       if(row === last_square){
        let movement  = piece>0? -1:1
        let r = movement + row


for (const p of promotions) {
    moves.push({
        fromRow: row,
        fromCol: col,
        toRow: r,
        toCol: col,
        promotion: p
    });
};


            
        }
   
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

            if (inside(r, c) && !friendly(piece, board[r][c])) {
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
       let cond = piece>0
  let Kingmoved = cond? gameState.whiteKingMoved:gameState.blackKingMoved
  let RightRookmoved = cond? gameState.whiteRightRookMoved:gameState.blackRightRookMoved
  let LeftRookmoved = cond? gameState.whiteLeftRookMoved:gameState.blackLeftRookMoved
        const dirs = [
            [1,0],[1,1],[0,1],
            [-1,0],[-1,-1],
            [0,-1],[1,-1],[-1,1]
        ];

        for (let [dx, dy] of dirs) {
            let r = row + dx, c = col + dy;

            if (inside(r, c) &&   !friendly(piece, board[r][c])) {
                moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c });
            }
        }
        // KING SIDE CASTLING
        if (piece>0){
   if (
    !gameState.whiteKingMoved &&
    !gameState.whiteRightRookMoved &&
    board[7][5] === 0 &&
    board[7][6] === 0 &&
    isSquareSafeForKing(gameState, 7, 4, "white") &&
    isSquareSafeForKing(gameState, 7, 5, "white") &&
    isSquareSafeForKing(gameState, 7, 6, "white")
) {
    moves.push({
        fromRow: 7,
        fromCol: 4,
        toRow: 7,
        toCol: 6,
        castle: "king"
    });
}
// QUEEN SIDE CASTLING 
if (
    !gameState.whiteKingMoved &&
    !gameState.whiteLeftRookMoved &&
    board[7][3] === 0 &&
    board[7][2] === 0 &&
    board[7][1] === 0 &&
    isSquareSafeForKing(gameState, 7, 4, "white") &&
    isSquareSafeForKing(gameState, 7, 3, "white") &&
    isSquareSafeForKing(gameState, 7, 2, "white")
) {
    moves.push({
        fromRow: 7,
        fromCol: 4,
        toRow: 7,
        toCol: 2,
        castle: "queen"
    });
}
    }
    else{
 // BLACK KING SIDE
if (
    !gameState.blackKingMoved &&
    !gameState.blackRightRookMoved &&
    board[0][5] === 0 &&
    board[0][6] === 0 &&
    isSquareSafeForKing(gameState, 0, 4, "black") &&
    isSquareSafeForKing(gameState, 0, 5, "black") &&
    isSquareSafeForKing(gameState, 0, 6, "black")
) {
    moves.push({
        fromRow: 0,
        fromCol: 4,
        toRow: 0,
        toCol: 6,
        castle: "king"
    });
}
// QUEEN SIDE CASTLING 
// BLACK QUEEN SIDE
if (
    !gameState.blackKingMoved &&
    !gameState.blackLeftRookMoved &&
    board[0][3] === 0 &&
    board[0][2] === 0 &&
    board[0][1] === 0 &&
    isSquareSafeForKing(gameState, 0, 4, "black") &&
    isSquareSafeForKing(gameState, 0, 3, "black") &&
    isSquareSafeForKing(gameState, 0, 2, "black")
) {
    moves.push({
        fromRow: 0,
        fromCol: 4,
        toRow: 0,
        toCol: 2,
        castle: "queen"
    });
}

    }

    
}
return moves;
}

function isSquareSafeForKing(gameState, row, col, color) {
    const board = gameState.board;

    const king = color === "white" ? KING : -KING;

    // Find the king's current position
    let kingRow = -1;
    let kingCol = -1;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === king) {
                kingRow = r;
                kingCol = c;
                break;
            }
        }

        if (kingRow !== -1) break;
    }

    // Temporarily move king to the square
    const originalKingSquare = board[kingRow][kingCol];
    const targetSquare = board[row][col];

    board[kingRow][kingCol] = 0;
    board[row][col] = king;

    const safe = !isKingInCheck(gameState, color);

    // Restore board
    board[kingRow][kingCol] = originalKingSquare;
    board[row][col] = targetSquare;

    return safe;
}
// ======================================================
// ALL MOVES FOR COLOR
// ======================================================

function getAllMoves(gameState, color) {
    let board = gameState.board

    const moves = [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            const p = board[r][c];
            if (p === 0) continue;

            if (color === "white" && p < 0) continue;
            if (color === "black" && p > 0) continue;

            moves.push(...getPseudoMoves(gameState, r, c));
        }
    }

    return moves;
}

// ======================================================
// MINIMAX CORE
// ======================================================

function minimax(gameState, depth, alpha, beta, isMaximizing) {
    let board = gameState.board
  if (depth === 0) {
        return quiescence(gameState, alpha, beta, isMaximizing);
    }

             
    const color = isMaximizing ? "white" : "black";
    const moves = getLegalMoves(gameState, color);
    moves.sort((a,b)=>scoreMove(b,gameState) - scoreMove(a,gameState))
                           
  if (moves.length === 0) {
    if (isKingInCheck(gameState, color)) {
        return isMaximizing ? -100000 + depth : 100000 - depth;
    }

    return 0;
}
    
    

    if (isMaximizing) {

        let best = -Infinity;

        for (let move of moves) {

           
     const captured = applyMove(gameState, move);

    const score = minimax(
        gameState,
        depth - 1,
        alpha,
        beta,
        false
    );

    undoMove(gameState, move, captured);

           
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

            
            const captured = applyMove(gameState, move);

    const score = minimax(
        gameState,
        depth - 1,
        alpha,
        beta,
        true
    );

    undoMove(gameState, move, captured);

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

export function getBestMove(ExgameState,color) {
    let gameState = ExgameState
    let bestMove
     let boards = gameState.board
    const moves = getLegalMoves(gameState, color);

  let bestScore = color === "white" ? -Infinity : Infinity;

for (let move of moves) {
    const captured = applyMove(gameState, move);

    const score = minimax(
        gameState,
        2,
        -Infinity,
        Infinity,
        color === "black"
    );

    undoMove(gameState, move, captured);

    if (
        color === "white"
            ? score > bestScore
            : score < bestScore
    ) {
        bestScore = score;
        bestMove = move;
    }
}

    return bestMove;
}









function isKingInCheck(gameState, color) {

    const board = gameState.board;

    const king = color === "white"
        ? KING
        : -KING;

    let kingRow = -1;
    let kingCol = -1;

    // Find king
    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            if (board[row][col] === king) {

                kingRow = row;
                kingCol = col;

                break;
            }
        }

        if (kingRow !== -1) break;
    }

    // No king found
    if (kingRow === -1) {
        return false;
    }

    const enemyColor =
        color === "white"
            ? "black"
            : "white";

    const attacks = getAttackSquares(
        gameState,
        enemyColor
    );

    return attacks.some(
        square =>
            square.row === kingRow &&
            square.col === kingCol
    );
}


// Optimized getLegalMoves
function getLegalMoves(gameState, color) {
    
    const allMoves = getAllMoves(gameState, color);
    const legal = [];
    
    for (let move of allMoves) {
        const captured = applyMove(gameState, move);
        if (!isKingInCheck(gameState, color)) {
            legal.push(move);
        }
        undoMove(gameState, move, captured); // Backtrack immediately
    }
    return legal;
}

function friendly(p1, p2) {
    return p2 !== 0 &&
           ((p1 > 0 && p2 > 0) ||
            (p1 < 0 && p2 < 0));
}
function scoreMove(move, gameState) {
    let board = gameState.board
    const victim = board[move.toRow][move.toCol];

    if (victim === 0) return 0;

    return pieceValue[Math.abs(victim)];
}
function makeMove(gameState, move) {
    let board = gameState.board
    const captured = board[move.toRow][move.toCol];

    board[move.toRow][move.toCol] =
        board[move.fromRow][move.fromCol];

    board[move.fromRow][move.fromCol] = 0;

    return captured;
}


function getPositionalBonus(piece, row, col) {
    const type = Math.abs(piece);

    switch (type) {
        case PAWN:
            return piece > 0
                ? pawnTable[row][col]
                : pawnTable[7 - row][col];

        case KNIGHT:
            return piece > 0
                ? knightTable[row][col]
                : knightTable[7 - row][col];
        case QUEEN:
          return piece > 0
                ? queenTable[row][col]
                : queenTable[7 - row][col];
        case ROOK:
             return piece > 0
                ? rookTable[row][col]
                : rookTable[7 - row][col];
        case BISHOP:
            return piece>0
            ? bishopTable[row][col]
            :bishopTable[7-row][col]
        case KING:
            return piece>0
            ? kingTable[row][col]
            :kingTable[7-row][col]
        default:
            return 0;
    }
}
// I love this function
 
function quiescence(gameState, alpha, beta, isMaximizing) {
    // Standard evaluation for the current position
    let board = gameState.board
    let standPat = evaluateGame(board);

    if (isMaximizing) {
        if (standPat >= beta) return beta;
        if (standPat > alpha) alpha = standPat;

        // Get only capturing moves
        const moves = getLegalMoves(gameState, "white").filter(m => isCapture(board, m));
        
        for (let move of moves) {
            const captured = applyMove(gameState, move);
            let score = quiescence(gameState, alpha, beta, false);
            undoMove(gameState, move, captured);

            if (score >= beta) return beta;
            if (score > alpha) alpha = score;
        }
        return alpha;
    } else {
        if (standPat <= alpha) return alpha;
        if (standPat < beta) beta = standPat;

        const moves = getLegalMoves(gameState, "black").filter(m => isCapture(board, m));

        for (let move of moves) {
            const captured = applyMove(gameState, move);
            let score = quiescence(gameState, alpha, beta, true);
            undoMove(gameState, move, captured);

            if (score <= alpha) return alpha;
            if (score < beta) beta = score;
        }
        return beta;
    }
}
function isCapture(board, move) {
    return board[move.toRow][move.toCol] !== 0;
}


function applyMove(gameState, move) {
    // chat check this function ignore the duplicate above 
    // is this wrong 
    // documenting history of last change
    let board = gameState.board 
   let history = {
    square: board[move.fromRow][move.fromCol],
    captured:0,
        whiteKingMoved :gameState.whiteKingMoved,

        
        blackKingMoved :gameState.blackKingMoved,

        whiteLeftRookMoved : gameState.whiteLeftRookMoved,
      
        whiteRightRookMoved:gameState.whiteRightRookMoved,
        
        blackLeftRookMoved:gameState.blackLeftRookMoved,
            
        blackRightRookMoved :gameState.blackRightRookMoved,
         castle : move.castle || null,
        
   }

  

    
 let square = board[move.fromRow][move.fromCol];
 let color = square>0 ? "white":"black"
 // Positions for where the rook castle too
 // check whether piece is king 
 if(Math.abs(square) === 6 && !move.castle){
    // if not a castling move, set the nessceary parameters 
    if(square>0){
        gameState.whiteKingMoved = true
    
        
    }
    else{
        gameState.blackKingMoved = true
    
    }

 }
 // check whether it is a rook 
 if(Math.abs(square) === 4 ){
    if(move.fromCol === 7){
        if(square>0){
       
        gameState.whiteRightRookMoved = true

      
        }
        else{
          gameState.blackRightRookMoved = true 
          
        }
    }
    if(move.fromCol === 0){
         if(square>0){
       
        gameState.whiteLeftRookMoved = true
       
        }
        else{
          gameState.blackLeftRookMoved = true 
       
        }
    }
 }

 // bad programming but it would work sha
  if(move.castle){
    //king castling
     if(move.castle === "king"){
        board[move.fromRow][move.fromCol+1] = piece[color]["rook"]
        board[move.fromRow][7] = 0
        if(square>0){
       gameState.whiteKingMoved = true
       gameState.whiteRightRookMoved = true
      
       
        }
        else{
            gameState.blackKingMoved = true
            gameState.blackRightRookMoved = true
            
        }
        
     }
     // Queen castling
     else{
          board[move.fromRow][3] = piece[color]["rook"]
        board[move.fromRow][0] = 0
        if(square>0){
       gameState.whiteKingMoved = true
       gameState.whiteLeftRookMoved = true
       
        }
        else{
            gameState.blackKingMoved = true
            gameState.blackLeftRookMoved = true
           
        }
        
     }
    }
  
     if (move.promotion) 
    square = square > 0
        ? move.promotion
        : -move.promotion;
   

    
   


    board[move.fromRow][move.fromCol] = 0;
    history.captured = board[move.toRow][move.toCol]
board[move.toRow][move.toCol] = square;
// check whether the captured piece is a rook 
if (Math.abs(history.captured) === ROOK) {

        // White queenside rook
        if (move.toRow === 7 && move.toCol === 0) {

            gameState.whiteLeftRookMoved = true;
        }

        // White kingside rook
        if (move.toRow === 7 && move.toCol === 7) {

            gameState.whiteRightRookMoved = true;
        }

        // Black queenside rook
        if (move.toRow === 0 && move.toCol === 0) {

            gameState.blackLeftRookMoved = true;
        }

        // Black kingside rook
        if (move.toRow === 0 && move.toCol === 7) {

            gameState.blackRightRookMoved = true;
        }
    }
return history
}

function undoMove(gameState, move, history) {

    const board = gameState.board;
    
    let square = history.square
    // MOVE PIECE BACK


    board[move.fromRow][move.fromCol] =
        history.square

    board[move.toRow][move.toCol] =
        history.captured;


// undo castling rook

    if (history.castle === "king" && square > 0 ) {

        // f1 -> h1
        board[7][7] = board[7][5];
        board[7][5] = 0;
    }

    if (history.castle === "queen" && square > 0 ) {

        // d1 -> a1
        board[7][0] = board[7][3];
        board[7][3] = 0;
    }

    if (history.castle === "king" && square<0) {

        // f8 -> h8
        board[0][7] = board[0][5];
        board[0][5] = 0;
    }

    if (history.castle === "queen" && square<0) {

        // d8 -> a8
        board[0][0] = board[0][3];
        board[0][3] = 0;
    }


   // Restore castling rights

    gameState.whiteKingMoved =
        history.whiteKingMoved;

    gameState.blackKingMoved =
        history.blackKingMoved;

    gameState.whiteLeftRookMoved =
        history.whiteLeftRookMoved;

    gameState.whiteRightRookMoved =
        history.whiteRightRookMoved;

    gameState.blackLeftRookMoved =
        history.blackLeftRookMoved;

    gameState.blackRightRookMoved =
        history.blackRightRookMoved;
}
// HEY

// ======================================================
// GET ATTACK SQUARES
// Returns every square attacked by a piece
// It does NOT care whether the move is legal.
// It does NOT generate castling.
// ======================================================

function getAttackSquares(gameState, color) {

    const board = gameState.board;
    const attacks = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {

            const p = board[row][col];

            if (p === 0) continue;

            // Only look at pieces belonging to this color
            if (color === "white" && p < 0) continue;
            if (color === "black" && p > 0) continue;

            const type = Math.abs(p);

            // ==================================================
            // PAWN
            // ==================================================

            if (type === PAWN) {

                const dir = p > 0 ? -1 : 1;

                for (const offset of [-1, 1]) {

                    const r = row + dir;
                    const c = col + offset;

                    if (!inside(r, c)) continue;

                    attacks.push({
                        row: r,
                        col: c
                    });
                }
            }

            // ==================================================
            // KNIGHT
            // ==================================================

            else if (type === KNIGHT) {

                const directions = [
                    [2, 1],
                    [2, -1],
                    [-2, 1],
                    [-2, -1],
                    [1, 2],
                    [1, -2],
                    [-1, 2],
                    [-1, -2]
                ];

                for (const [dr, dc] of directions) {

                    const r = row + dr;
                    const c = col + dc;

                    if (!inside(r, c)) continue;

                    attacks.push({
                        row: r,
                        col: c
                    });
                }
            }

            // ==================================================
            // KING
            // ==================================================

            else if (type === KING) {

                const directions = [
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [-1, 0],
                    [-1, -1],
                    [0, -1],
                    [1, -1],
                    [-1, 1]
                ];

                for (const [dr, dc] of directions) {

                    const r = row + dr;
                    const c = col + dc;

                    if (!inside(r, c)) continue;

                    attacks.push({
                        row: r,
                        col: c
                    });
                }
            }

            // ==================================================
            // BISHOP
            // ==================================================

            else if (type === BISHOP) {

                addSlidingAttacks(
                    board,
                    row,
                    col,
                    [
                        [1, 1],
                        [1, -1],
                        [-1, 1],
                        [-1, -1]
                    ],
                    attacks
                );
            }

            // ==================================================
            // ROOK
            // ==================================================

            else if (type === ROOK) {

                addSlidingAttacks(
                    board,
                    row,
                    col,
                    [
                        [1, 0],
                        [-1, 0],
                        [0, 1],
                        [0, -1]
                    ],
                    attacks
                );
            }

            // ==================================================
            // QUEEN
            // ==================================================

            else if (type === QUEEN) {

                addSlidingAttacks(
                    board,
                    row,
                    col,
                    [
                        [1, 0],
                        [-1, 0],
                        [0, 1],
                        [0, -1],

                        [1, 1],
                        [1, -1],
                        [-1, 1],
                        [-1, -1]
                    ],
                    attacks
                );
            }
        }
    }

    return attacks;
}


// ======================================================
// SLIDING PIECE ATTACKS
// Bishop / Rook / Queen
// ======================================================

function addSlidingAttacks(
    board,
    row,
    col,
    directions,
    attacks
) {

    for (const [dr, dc] of directions) {

        let r = row + dr;
        let c = col + dc;

        while (inside(r, c)) {

            // The square is attacked regardless of
            // whether there is a friendly or enemy piece there.
            attacks.push({
                row: r,
                col: c
            });

            // But the piece blocks everything behind it.
            if (board[r][c] !== 0) {
                break;
            }

            r += dr;
            c += dc;
        }
    }
}