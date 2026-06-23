//================================= 
// CHESS GAME
//=================================
if(Number(window.screen.width) < 1530){
    alert("Yeah em, I actually didnt design this game for this screen resolution. Please go to the three dots at the side of your browser and reduce the size. You can also use landscape view(If you are using mobile). Thanks :)")
}

const gameBar = document.getElementById("GameoverBar")
const gamecont = document.getElementById("gamebody")
const btn = document.querySelector("#button")
// btn.onclick = UI.Reset()
const msg = document.getElementById("message")
const msg2 = document.getElementById("button")
const grid = document.getElementById("grid")
let Gameover = false

import { getBestMove,
    piece
 } from "./AI.js";
let aiThinking = false; 
let clicked
let king
let turn = true
let pawnloc = [1,2]
let seconds = 600
const squares = []
let options = []
//===========================================================
// Set up the pawn promotion bar
//===========================================================
const whiteprompiece = ["♖", "♘", "♗","♕"]
const blackprompiece = ["♜", "♞", "♝", "♛"]
const names = ["rook","knight","bishop","queen"]
const whitprom = document.getElementById("whiteprom")
for (let index = 0; index < 4; index++) {
 const contn = document.createElement("div")
 contn.classList.add("prompiece")
  contn.dataset.info_colour = "white"
  contn.dataset.info_piece = names[index]
  contn.classList.add("whiteprompic")
 contn.innerHTML = whiteprompiece[index]
 contn.onclick = write
 whitprom.appendChild(contn)

}
const blackprom = document.getElementById("blackprom")
for (let index = 0; index < 4; index++) {
 const contn = document.createElement("div")
 contn.classList.add("prompiece")
 contn.classList.add("blackprompic")
 contn.dataset.info_colour = "black"
 contn.dataset.info_piece = names[index]
 contn.innerHTML = blackprompiece[index]
 contn.onclick = write
 blackprom.appendChild(contn)

}


// ==========================================================
// UI ELEMENTS
// ==========================================================

const white = document.querySelector("#analysis1")
const black = document.querySelector("#analysis2")

const White_Timer = document.querySelector("#White_Timer")
const Black_Timer = document.querySelector("#Black_Timer")

white.classList.add("turn")
black.classList.add("BlackBoard")

White_Timer.classList.add("turn")
Black_Timer.classList.add("BlackBoard")


// ==========================================================
// CREATE BOARD
// ==========================================================

function setBoard(){
  for (let i = 0; i < 8; i++) {

    let rows = []

    for (let j = 0; j < 8; j++) {

        const sq = document.createElement("div")

        sq.classList.add("square")
        sq.classList.add((i + j) % 2 == 1 ? "light" : "dark")

        sq.dataset.row = i
        sq.dataset.column = j

        sq.onclick = handleclick

        grid.appendChild(sq)

        rows.push(sq)
    }

    squares.push(rows)
}
}

// ==========================================================
// PIECES
// ==========================================================

const pieces = {

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
// SET PIECE
// ==========================================================
export function getSquares() {
    return squares
}
function set(type, color, x, y, simulation = false) {

    if (
        !Number.isInteger(x) ||
        !Number.isInteger(y) ||
        !pieces?.[color]?.[type] ||
        !squares?.[x]?.[y]
    ) {
        console.error("BAD SET CALL:", { type, color, x, y });
        return;
    }

    squares[x][y].dataset.type = type;
    squares[x][y].dataset.color = color;

    if (!simulation) {
        squares[x][y].innerHTML = pieces[color][type];
    }
}
// ==========================================================
// REMOVE PIECE
// ==========================================================

function remove(y,x,simulation=false){

    delete squares[y][x].dataset.type
    delete squares[y][x].dataset.color

    if(!simulation){

        squares[y][x].innerHTML = " "

        if(squares[y][x].dataset.moved){
            delete squares[y][x].dataset.moved
        }
    }
}

// ==========================================================
// INITIAL BOARD SETUP Yayyyy
// ==========================================================
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

squares[7][4].dataset.moved = "false"
squares[0][4].dataset.moved = "false"

squares[7][0].dataset.moved = "false"
squares[7][7].dataset.moved = "false"

squares[0][0].dataset.moved = "false"
squares[0][7].dataset.moved = "false"

// ==========================================================
// HANDLE CLICK
// ==========================================================
}
function handleclick(e){

    let x = Number(e.target.dataset.row)
    let y = Number(e.target.dataset.column)

    let pieceColor = e.target.dataset.color
   

    // ======================================================
    // CASTLING
    // ======================================================

    if(e.target.classList.contains("castling")){

        if(e.target.dataset.column == 0){

            castle(x,y,-1)
        }

        else{

            castle(x,y,1)
        }

        clear()

        return
    }

    // ======================================================
    // MOVE PIECE
    // ======================================================

    if(e.target.classList.contains("options")){

        let color = clicked.dataset.color
        let type = clicked.dataset.type

        let fromX = Number(clicked.dataset.row)
        let fromY = Number(clicked.dataset.column)

        movePiece(x,y,fromX,fromY,color,type)

        clear()

        return
    }

    // ======================================================
    // TURN CHECK
    // ======================================================

    if(pieceColor){

        if(turn && pieceColor !== "white") return

        if(!turn && pieceColor !== "black") return
    }

    clear()

    squares[x][y].classList.add("selected")

    showMoves(squares[x][y])
}

// ==========================================================
// CLEAR HIGHLIGHTS
// ==========================================================

function clear(){

    squares.forEach(row => {

        row.forEach(square => {

            square.classList.remove("selected")
            square.classList.remove("options")
            square.classList.remove("win")
            square.classList.remove("castling")
        })
    })
}

// ==========================================================
// MOVE PIECE
// ==========================================================

function movePiece(x1,y1,x2,y2,color,type){

    // save captured piece
    let capturedPiece = null

    if(squares[x1][y1].dataset.color){

        capturedPiece = {

            type: squares[x1][y1].dataset.type,
            color: squares[x1][y1].dataset.color,
            symbol: squares[x1][y1].innerHTML
        }
    }

    // move piece
    set(type,color,x1,y1)

    // mark moved
    squares[x1][y1].dataset.moved = "true"

    remove(x2,y2)

    // show captured piece
    if(capturedPiece){

        UI.showWin(capturedPiece)
       
    }
    
    // switch turn
if (squares[x1][y1].dataset.type === "pawn") {

    pawnloc[0] = x1;
    pawnloc[1] = y1;

    if (CheckPawnPromote(squares[x1][y1])) {
          
        return;
    }
}

turn = !turn;

UI.update();

highlightCheck();
getallmoves();
triggerAI(); 

}

// ==========================================================
// LINE MOVEMENT
// ==========================================================
function triggerAI() {

    if (turn) return;
    if (aiThinking) return;

    aiThinking = true;

    setTimeout(() => {

        const boardState = getBoardState();
        const bestMove = getBestMove(boardState);

        if (bestMove) {
            applyAIMove(bestMove);
        }

        aiThinking = false;

    }, 300);
}
function line(x,y,straight,diagonal){

    let moves = []

    let color = squares[x][y].dataset.color

    const directions = []

    if(straight){

        directions.push(
            [1,0],
            [-1,0],
            [0,1],
            [0,-1]
        )
    }

    if(diagonal){

        directions.push(
            [1,1],
            [-1,-1],
            [1,-1],
            [-1,1]
        )
    }

    directions.forEach(([dx,dy]) => {

        let nx = x + dx
        let ny = y + dy

        while(

            nx >= 0 &&
            nx < 8 &&
            ny >= 0 &&
            ny < 8
        ){

            let target = squares[nx][ny]

            if(target.dataset.color === color){

                break
            }

            moves.push(target)

            if(
                target.dataset.color &&
                target.dataset.color !== color
            ){

                break
            }

            nx += dx
            ny += dy
        }
    })

    return moves
}

// ==========================================================
// GET MOVES
// ==========================================================

function GetMoves(board){

    let color = board.dataset.color
    let type = board.dataset.type

    let a = Number(board.dataset.row)
    let b = Number(board.dataset.column)

    let enemyColor = color === "white" ? "black" : "white"

    let moves = []

    // ======================================================
    // PAWN
    // ======================================================

    if(type === "pawn"){

        let dir = color === "white" ? -1 : 1

        // forward
        if(
            a + dir >= 0 &&
            a + dir < 8 &&
            !squares[a + dir][b].dataset.color
        ){

            moves.push(squares[a + dir][b])

            // double move
            if(
                (
                    color === "white" &&
                    a === 6
                ) ||
                (
                    color === "black" &&
                    a === 1
                )
            ){

                if(!squares[a + (2 * dir)][b].dataset.color){

                    moves.push(squares[a + (2 * dir)][b])
                }
            }
        }

        // capture right
        if(
            squares[a + dir]?.[b + 1]?.dataset.color &&
            squares[a + dir][b + 1].dataset.color !== color
        ){

            moves.push(squares[a + dir][b + 1])
        }

        // capture left
        if(
            squares[a + dir]?.[b - 1]?.dataset.color &&
            squares[a + dir][b - 1].dataset.color !== color
        ){

            moves.push(squares[a + dir][b - 1])
        }
    }

    // ======================================================
    // KNIGHT
    // ======================================================

    if(type === "knight"){

        const knightMoves = [
            [2,1],[2,-1],
            [-2,1],[-2,-1],
            [1,2],[1,-2],
            [-1,2],[-1,-2]
        ]

        knightMoves.forEach(([dx,dy]) => {

            let x = a + dx
            let y = b + dy

            if(
                x >= 0 &&
                x < 8 &&
                y >= 0 &&
                y < 8
            ){

                if(squares[x][y].dataset.color !== color){

                    moves.push(squares[x][y])
                }
            }
        })
    }

    // ======================================================
    // KING
    // ======================================================

    if(type === "king"){

        const kingMoves = [
            [1,0],[1,1],[0,1],
            [-1,0],[-1,-1],
            [0,-1],[1,-1],[-1,1]
        ]

        kingMoves.forEach(([dx,dy]) => {

            let x = a + dx
            let y = b + dy

            if(
                x >= 0 &&
                x < 8 &&
                y >= 0 &&
                y < 8
            ){

                if(squares[x][y].dataset.color !== color){

                    moves.push(squares[x][y])
                }
            }
        })

        // remove attacked squares
        let enemyAttacks = king_check(enemyColor)

        moves = moves.filter(move => {

            return !enemyAttacks.includes(move)
        })
    }

    // rook
    if(type === "rook"){

        moves = line(a,b,true,false)
    }

    // bishop
    if(type === "bishop"){

        moves = line(a,b,false,true)
    }

    // queen
    if(type === "queen"){

        moves = line(a,b,true,true)
    }

    // filter illegal moves
    moves = blockIllegalMove(board,moves)

    return moves
}

// ==========================================================
// SHOW MOVES
// ==========================================================

function showMoves(board){

    clicked = board

    options = GetMoves(board)

    options.forEach(move => {

        move.classList.add("options")

        if(move.dataset.color){

            move.classList.add("win")
        }
    })

    if(board.dataset.type === "king"){

        castling_check(board)
    }
}

// ==========================================================
// GET ATTACK MOVES
// ==========================================================
function applyAIMove(move) {

    if (!move) return;

    if (
        move.fromRow == null ||
        move.fromCol == null ||
        move.toRow == null ||
        move.toCol == null
    ) {
        console.error("Bad AI move:", move);
        return;
    }

    const from = squares[move.fromRow]?.[move.fromCol];
    const to = squares[move.toRow]?.[move.toCol];

    if (!from || !to) {
        console.error("AI out-of-bounds move:", move);
        return;
    }

    movePiece(
        move.toRow,
        move.toCol,
        move.fromRow,
        move.fromCol,
        from.dataset.color,
        from.dataset.type
    );
}
function GetattackMoves(board){

    let color = board.dataset.color
    let type = board.dataset.type

    let a = Number(board.dataset.row)
    let b = Number(board.dataset.column)

    let moves = []

    // pawn attacks
    if(type === "pawn"){

        let dir = color === "white" ? -1 : 1

        if(a + dir >= 0 && b + 1 < 8){

            moves.push(squares[a + dir][b + 1])
        }

        if(a + dir >= 0 && b - 1 >= 0){

            moves.push(squares[a + dir][b - 1])
        }
    }

    // knight
    if(type === "knight"){

        const knightMoves = [
            [2,1],[2,-1],
            [-2,1],[-2,-1],
            [1,2],[1,-2],
            [-1,2],[-1,-2]
        ]

        knightMoves.forEach(([dx,dy]) => {

            let x = a + dx
            let y = b + dy

            if(
                x >= 0 &&
                x < 8 &&
                y >= 0 &&
                y < 8
            ){

                moves.push(squares[x][y])
            }
        })
    }

    // king
    if(type === "king"){

        const kingMoves = [
            [1,0],[1,1],[0,1],
            [-1,0],[-1,-1],
            [0,-1],[1,-1],[-1,1]
        ]

        kingMoves.forEach(([dx,dy]) => {

            let x = a + dx
            let y = b + dy

            if(
                x >= 0 &&
                x < 8 &&
                y >= 0 &&
                y < 8
            ){

                moves.push(squares[x][y])
            }
        })
    }

    // rook
    if(type === "rook"){

        moves = line(a,b,true,false)
    }

    // bishop
    if(type === "bishop"){

        moves = line(a,b,false,true)
    }

    // queen
    if(type === "queen"){

        moves = line(a,b,true,true)
    }

    return moves
}

// ==========================================================
// GET ATTACKS
// ==========================================================

function king_check(color){

    let attacks = []

    for(let i = 0; i < 8; i++){

        for(let j = 0; j < 8; j++){

            let piece = squares[i][j]

            if(piece.dataset.color === color){

                attacks = attacks.concat(
                    GetattackMoves(piece)
                )
            }
        }
    }

    return attacks
}

// ==========================================================
// KING CHECK
// ==========================================================

function Iskingchecked(color){

    let enemyColor =
        color === "white"
        ? "black"
        : "white"

    let king = loop_through("king",color)[0]

    let attacks = king_check(enemyColor)

    return attacks.includes(king)
}

// ==========================================================
// FILTER ILLEGAL MOVES
// ==========================================================
function getBoardState() {
    return squares.map(row =>
        row.map(square => {
            const t = square.dataset.type;
            const c = square.dataset.color;

            if (!t || !c) return 0;
            return piece[c][t];
        })
    );
    
}
function blockIllegalMove(piece,moves){

    let legalMoves = []

    let color = piece.dataset.color

    let enemyColor =
        color === "white"
        ? "black"
        : "white"

    let startX = Number(piece.dataset.row)
    let startY = Number(piece.dataset.column)

    let type = piece.dataset.type

    moves.forEach(move => {

        let endX = Number(move.dataset.row)
        let endY = Number(move.dataset.column)

        let capturedType = move.dataset.type
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

// ==========================================================
// LOOP THROUGH PIECES
// ==========================================================

function loop_through(type,color){

    let result = []

    for(let i = 0; i < 8; i++){

        for(let j = 0; j < 8; j++){

            if(
                squares[i][j].dataset.type === type &&
                squares[i][j].dataset.color === color
            ){

                result.push(squares[i][j])
            }
        }
    }

    return result
}

// ==========================================================
// CHECK HIGHLIGHT
// ==========================================================

function highlightCheck(){

    squares.forEach(row => {

        row.forEach(square => {

            square.classList.remove("Bad")
        })
    })

    let whiteKing = loop_through("king","white")[0]
    let blackKing = loop_through("king","black")[0]

    if(Iskingchecked("white")){

        whiteKing.classList.add("Bad")
    }

    if(Iskingchecked("black")){

        blackKing.classList.add("Bad")
    }
}

// ==========================================================
// CASTLING CHECK
// ==========================================================

function castling_check(board){

    let a = Number(board.dataset.row)
    let b = Number(board.dataset.column)

    let color = board.dataset.color

    let enemyColor =
        color === "white"
        ? "black"
        : "white"

    let enemyAttacks = king_check(enemyColor)

    if(board.dataset.moved !== "false") return

    if(enemyAttacks.includes(board)) return

    king = board

    // king side
    if(

        !squares[a][b+1].dataset.type &&
        !squares[a][b+2].dataset.type &&

        squares[a][b+3].dataset.type === "rook" &&
        squares[a][b+3].dataset.moved === "false" &&

        !enemyAttacks.includes(squares[a][b+1]) &&
        !enemyAttacks.includes(squares[a][b+2])

    ){

        squares[a][b+3].classList.add("castling")
    }

    // queen side
    if(

        !squares[a][b-1].dataset.type &&
        !squares[a][b-2].dataset.type &&
        !squares[a][b-3].dataset.type &&

        squares[a][b-4].dataset.type === "rook" &&
        squares[a][b-4].dataset.moved === "false" &&

        !enemyAttacks.includes(squares[a][b-1]) &&
        !enemyAttacks.includes(squares[a][b-2])

    ){

        squares[a][b-4].classList.add("castling")
    }
}

// ==========================================================
// CASTLE
// ==========================================================

function castle(x,y,dx){

    let row = Number(king.dataset.row)

    let color = king.dataset.color

    remove(x,y)
    remove(row,4)

    set("king",color,x,y-dx)
    set("rook",color,row,y-(2*dx))

    turn = !turn

    UI.update()

    highlightCheck()
     triggerAI(); 
}

// ==========================================================
// UI OBJECT
// ==========================================================
let message
const UI = {
    

    BlackTimer:  seconds,
    WhiteTimer:  seconds,


  EndGame: function(message){
    

     UI.Message(message)
     for (let i = 0; i < 8; i++) {
     for (let j = 0; j < 8; j++) {
      squares[i][j].onclick = null
         
     }
      btn.onclick = UI.Startgame
     }
     Gameover = true
    document.removeEventListener('keydown',logic)
    },
    Message: function(message,message2="Play Again!"){
       msg.innerHTML = message
       msg2.innerHTML = message2
        gameBar.style.visibility = "visible"
     gamecont.style.filter = "blur(8px)"
    },
   

    update: function(){

        if(turn){

            white.classList.remove("WhiteBoard")
            white.classList.add("turn")

            black.classList.remove("turn")
            black.classList.add("BlackBoard")

            White_Timer.classList.remove("WhiteBoard")
            White_Timer.classList.add("turn")

            Black_Timer.classList.remove("turn")
            Black_Timer.classList.add("BlackBoard")
        }

        else{

            black.classList.remove("BlackBoard")
            black.classList.add("turn")

            white.classList.remove("turn")
            white.classList.add("WhiteBoard")

            Black_Timer.classList.remove("BlackBoard")
            Black_Timer.classList.add("turn")

            White_Timer.classList.remove("turn")
            White_Timer.classList.add("WhiteBoard")
        }
    },
    pause: function(){
   UI.Message("Paused!","Continue")
   stopTimer()
    btn.onclick = UI.pausegame

    },

    timer: function(){

        if(turn){

            this.WhiteTimer--

            White_Timer.innerHTML =
                this.format(this.WhiteTimer)
        }

        else{

            this.BlackTimer--

            Black_Timer.innerHTML =
                this.format(this.BlackTimer)
        }
        if(this.BlackTimer <= 0 || this.WhiteTimer <= 0){
            message = turn? "White lost by time":"Black lost by time"
          this.EndGame(message)
          stopTimer()
        }
    },

    format: function(time){

        let sec = time % 60
        let min = Math.floor(time / 60)

        return `${min}:${sec < 10 ? "0" : ""}${sec}`
    },
    pausegame: function(){
          startTimer()
            // Hide game over screen
    gameBar.style.visibility = "hidden";

    // Remove blur
    gamecont.style.filter = "blur(0px)";
     for (let i = 0; i < 8; i++) {

        for (let j = 0; j < 8; j++) {

            squares[i][j].onclick =
                handleclick;
        }
    }
    },
    
Startgame: function() {
  stopTimer();

    // Reset timers first
    UI.BlackTimer =  seconds
    UI.WhiteTimer = seconds

    // Reset board
    clearpiece();
    setPiece();
    clear()
turn = true
    // Hide game over screen
    gameBar.style.visibility = "hidden";

    // Remove blur
    gamecont.style.filter = "blur(0px)";

    // Update timer display
    White_Timer.innerHTML =
        UI.format(UI.WhiteTimer);

    Black_Timer.innerHTML =
        UI.format(UI.BlackTimer);

    // Re-enable clicks
    for (let i = 0; i < 8; i++) {

        for (let j = 0; j < 8; j++) {

            squares[i][j].onclick =
                handleclick;
        }
        const cont = document.querySelectorAll(".Container")
        cont.forEach(contain=>{
          contain.remove()
        })
    }

    // Restart timer cleanly
    Gameover = false
    startTimer();
document.addEventListener('keydown',logic ); 
},

    showWin: function(piece){

        if(piece.type !== "king"){

            const cont = document.createElement("div")

            cont.classList.add("Container")

            cont.innerHTML = piece.symbol

            if(piece.color === "black"){

                white.appendChild(cont)
            }

            else{

                black.appendChild(cont)
            }
        }
    }
}

// ==========================================================
// TIMER
// ==========================================================


let timer = null;

function startTimer() {

    if (timer !== null) return;

    timer = setInterval(() => {
        UI.timer();
    }, 1000);
}

function stopTimer() {

    clearInterval(timer);
    timer = null;
}
setBoard()
setPiece()
startTimer()

White_Timer.innerHTML =  UI.format(UI.WhiteTimer)
Black_Timer.innerHTML =  UI.format(UI.BlackTimer)

function clearpiece() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
    delete squares[i][j].dataset.color
    delete squares[i][j].dataset.type
    delete squares[i][j].dataset.moved
    squares[i][j].innerHTML = " "
      squares[i][j].classList.remove("Bad")
    }
    
  }
}
function CheckPawnPromote(pawn){
let color = pawn.dataset.color
let x = Number(pawn.dataset.row)
let y = Number(pawn.dataset.column)
if(pawn.dataset.type==="pawn"){
if(color==="white"){
  if(x===0){
    showboard(color)
    return true
  }
}
else{
   if(x===7){
    showboard(color)
    return true
  }
} }
return false
}
function showboard(color){
  if (color === "white") {
    whitprom.style.visibility = "visible"
    
  }
  else{
    blackprom.style.visibility = "visible"
  }
}
function write(e) {


 set(e.target.dataset.info_piece,
    e.target.dataset.info_colour,
    pawnloc[0],
    pawnloc[1])
     whitprom.style.visibility = "hidden"
    blackprom.style.visibility = "hidden"
    turn = !turn
    UI.update()
    highlightCheck()
     getallmoves()
     triggerAI();  
    }
    function getallmoves(){
       let color = turn ? "white" : "black";
        let moves = []
        for (let i = 0; i < 8; i++) {
           for (let j = 0; j < 8; j++) {
           if(squares[i][j].dataset.color === color){
  moves = moves.concat(GetMoves(squares[i][j]))
           }
            
           }

            
        }
       if (moves.length === 0) {

    if (Iskingchecked(color)) {

        message = color === "black"
            ? "Checkmate! <br> White won"
            : "Checkmate! <br> Black won";

    } else {

        message = "Stalemate!";
    }

    UI.EndGame(message);
}
    }



let isPaused = false;

    
document.addEventListener('keydown',logic );


function logic(event)  {
  if (event.code === 'Space') {
    event.preventDefault();
    isPaused = !isPaused;
    
    if (isPaused) {
     
      UI.pause()// Put your pause logic here (e.g., video.pause())
    } else {
     
      UI.pausegame()
    }
  }
}