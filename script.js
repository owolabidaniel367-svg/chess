const grid = document.getElementById("grid")
let clicked 
let KingChecked = false
const squares = []
let options = []
let pieces_played =[]
let protect_king = []
let kg = "not"
  let t = 1
  let king 
  let turn = true
  const white = document.querySelector("#analysis1")
 const black = document.querySelector("#analysis2")
 const White_Timer = document.querySelector("#White_Timer")
  const Black_Timer = document.querySelector("#Black_Timer")
 white.classList.add("turn")
black.classList.add("BlackBoard")
 White_Timer.classList.add("turn")
Black_Timer.classList.add("BlackBoard")
White_Timer.innerHTML = "5:00"
Black_Timer.innerHTML = "5:00"
for (let i = 0; i < 8; i++) {
    let rows = []
    for (let j = 0; j < 8; j++) {
        const sq  = document.createElement("div")
        sq.classList.add("square")
        sq.classList.add((i+j)%2 == 1 ? "light": "dark" )
        sq.dataset.row = i
        sq.dataset.column = j
        
        grid.appendChild(sq)
        rows.push(sq)
        sq.onclick = handleclick
    }
    squares.push(rows)
    
    
}

const pieces = {
  white:{
    pawn:"♙", rook:"♖", knight:"♘", bishop:"♗", queen:"♕", king:"♔"
  },
  black:{
    pawn:"♟", rook:"♜", knight:"♞", bishop:"♝", queen:"♛", king:"♚"
  }
};
// I inverted the row and column while setting the pieces so i just fixed it here, I dont even know //
// it wasnt inverted sorry just dumb 
function set(type,color,y,x, simulation = false){
   
    squares[y][x].dataset.type = type
     squares[y][x].dataset.color = color
   if(!simulation){
          squares[y][x].innerHTML = pieces[color][type]
   }
    
}
function remove(y,x,simulation = false){
     
    delete squares[y][x].dataset.type
    delete squares[y][x].dataset.color
     if(!simulation){
   squares[y][x].innerHTML = " "
     }
   if(squares[y][x].dataset.moved){
    delete squares[y][x].dataset.moved
    
   }
    
}

for (let i = 0; i < 8; i++) {
   set("pawn","white",6,i)
    
}

for (let i = 0; i < 8; i++) {
   set("pawn","black",1,i)
    
}

set("rook","white",7,0)
set("rook","white",7,7)
set("rook","black",0,0)
set("rook","black",0,7)
set("knight","black",0,1)
set("knight","black",0,6)
set("knight","white",7,1)
set("knight","white",7,6)
set("queen","black",0,3,);
set("queen","white",7,3,);
set("king","black",0,4,);
set("king","white",7,4,);
set("bishop","white",7,5)
set("bishop","white",7,2)
set("bishop","black",0,2)
set("bishop","black",0,5)
squares[0][4].dataset.moved = "false"
squares[7][4].dataset.moved =  "false"
squares[7][0].dataset.moved =  "false"
squares[7][7].dataset.moved =  "false"
squares[0][0].dataset.moved =  "false"
squares[0][7].dataset.moved =  "false"
//******************************* FUNCTION TO HANDLE CODE */
function handleclick(e){
   
   
    let pieceColor 
    if(e.target.dataset.color){
pieceColor = e.target.dataset.color
    }


// console.log(options)

    
        
     let x = Number(e.target.dataset.row)
    let y = Number(e.target.dataset.column)
    if(e.target.classList.contains("win")){
        UI.showWin(e.target)
    }
    if(e.target.classList.contains("castling")){
        if(e.target.dataset.column == 0){
castle(x,y,-1)
        }
        else{
          castle(x,y,1)  
        }
        
        e.target.classList.remove("castling")
        clear()
    }
    else
    {
    if (e.target.classList.contains("options")){

        
         let color = clicked.dataset.color
        let type = clicked.dataset.type
        let from_x = Number(clicked.dataset.row)
        let from_y = Number(clicked.dataset.column)
        pieces_played.push(clicked)
        movePiece(x,y,from_x,from_y,color,type)
        clear()
       
    }
  
 
  
   else{
    // If clicking empty square, ignore turn check
if(pieceColor){
    if((turn && pieceColor !== "white") || (!turn && pieceColor !== "black")){
        return
    }
    }
    


 clear()
   squares[x][y].classList.add("selected")
    showMoves(squares[x][y],x,y)
    
   
}
}
}
function clear() {
    
    squares.forEach(r=>r.forEach(s=>{s.classList.remove("selected")
       s.classList.remove("options")
       s.classList.remove("win")
       s.classList.remove("castling")
    
}))
}

function movePiece(x1,y1,x2,y2,color,type){
    console.log(protect_king)
       console.log(pieces_played)
       

    set(type,color,x1,y1)
    remove(x2,y2)
    
    turn = !turn
    UI.update()
    hightlight()
    options = []
    Iskingchecked(color)
  


}
    
function line(x, y, straight, diagonal, forcheck = false) {
    let moves = []
    let color = squares[x][y].dataset.color

    const directions = []

    if (straight) {
        directions.push([1, 0], [-1, 0], [0, 1], [0, -1])
    }

    if (diagonal) {
        directions.push([1, 1], [-1, -1], [1, -1], [-1, 1])
    }

    directions.forEach(([dx, dy]) => {
        let nx = x + dx
        let ny = y + dy

        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            let target = squares[nx][ny]

            // Same color → stop
            if (target.dataset.color === color) break

            moves.push(target)

           

            
            if (target.dataset.color && target.dataset.color !== color) break

            nx += dx
            ny += dy
        }
    })

    return moves
}
 function checkwin(board,f,g,pawn){
    
 
     if (squares[f][g].dataset.color) {
        let mate = board.dataset.color=== "white"? "black":"white"
        if(squares[f][g].dataset.color === mate){
            if (squares[f][g].dataset.type === "king") {
            squares[f][g].classList.remove("options")
                  }
            squares[f][g].classList.add("win")
            if(pawn == 1){
                 squares[f][g].classList.add("win")
                 
                  squares[f][g].classList.add("options")
                  if (squares[f][g].dataset.type === "king") {
                    squares[f][g].classList.remove("options")
                  }
            }
        }

        }
        
     }

 function castle(x,y,dx){
    let row = Number(king.dataset.row)
    let col = Number(king.dataset.column)
    let COLOR = king.dataset.color
    let TYPE = "king"

     remove(x,y)
     remove(row,col)
    set(TYPE,COLOR,x,y-dx)
    set("rook",COLOR,row,y - (2*dx))
turn = !turn
UI.update()

 }
 const UI = {
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
BlackTimer: 300,
WhiteTimer: 300,

timer: function(count){
        if(turn){
            
        this.WhiteTimer --
           White_Timer.innerHTML = this.format(this.WhiteTimer)
        }
        else{ 

            this.BlackTimer --
             Black_Timer.innerHTML = this.format(this.BlackTimer)
        }
    },
format: function(time){
    let sec = time%60
    let min = Math.floor(time/60)
    return `${min}:${sec < 10 ? "0" : ""}${sec}`
},
showWin: function(piece){
    if(piece.dataset.type !== "king"){
        if (piece.dataset.color == "black") {
            const cont = document.createElement("div")
            cont.classList.add("Container")
            white.appendChild(cont)
            cont.innerHTML = piece.innerHTML
        }
         if (piece.dataset.color == "white") {
            const cont = document.createElement("div")
            cont.classList.add("Container")
            black.appendChild(cont)
            cont.innerHTML = piece.innerHTML
            
        }
        
    }
}

 }
 
setInterval(()=>{

    UI.timer()
},1000)
// **************** THE KING CHECK CODE *******************************//
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
//********************************************************************* */
function king_check(color){
let  king_check = []
 // ******* pawn checking******************//
 let pawns = loop_through("pawn", color)

pawns.forEach(pawn => {
  let a = Number(pawn.dataset.row)
  let b = Number(pawn.dataset.column)
  let dir = color === "white" ? -1 : 1

  if (b + 1 < 8 && a + dir >= 0 && a + dir < 8) {
    king_check.push(squares[a + dir][b + 1])
  }
  if (b - 1 >= 0 && a + dir >= 0 && a + dir < 8) {
    king_check.push(squares[a + dir][b - 1])
  }
})
        
    
    // ******** knights******************************************************************************************************************************//
    
      const kn = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
      let KNIGHTS_ARRAY = loop_through("knight",color)
      KNIGHTS_ARRAY.forEach(elemet=>{
       for (let i = 0; i < kn.length; i++) {
       let o= Number(elemet.dataset.row) + kn[i][0]
       let p = Number(elemet.dataset.column)+ kn[i][1]
       if(o<8 && o>-1 && p<8 && p>-1   && squares[o][p].dataset.color !== color){
        king_check.push(squares[o][p])
       }
       }
       
    })
    
    // KING *******************************************************************************************************************************************//
     
      const m = [[1,0],[1,1],[0,1],[-1,0],[-1,-1],[0,-1],[1,-1],[-1,1]]
        let KINGS_ARRAY = loop_through("king",color)
      KINGS_ARRAY.forEach(elemet=>{
       for (let i = 0; i < m.length; i++) {
       let o= Number(elemet.dataset.row) + m[i][0]
       let p = Number(elemet.dataset.column)+ m[i][1]
       if(o<8 && o>-1 && p<8 && p>-1  && squares[o][p].dataset.color !== color ){
        king_check.push(squares[o][p])
       }
       }
    })

      

     // rook *********************?//
    
        let rook_array = loop_through("rook",color)
        rook_array.forEach(elemnt=>{
        let a = Number(elemnt.dataset.row)
        let b = Number(elemnt.dataset.column)
        king_check = king_check.concat(line(a,b,1,0,true))

     }
    )
     // Bishop*************************************//
     
        let Bishop_array = loop_through("bishop",color)
        Bishop_array.forEach(elemnt=>{
        let a = Number(elemnt.dataset.row)
        let b = Number(elemnt.dataset.column)
        king_check = king_check.concat(line(a,b,0,1,true))

     }
    )
    // ***********************queen**********************'//
     
        let  queens_array = loop_through("queen",color)
        queens_array.forEach(elemnt=>{
        let a = Number(elemnt.dataset.row)
        let b = Number(elemnt.dataset.column)
        king_check = king_check.concat(line(a,b,1,1,true))

     }
    )
 
     return king_check 
    }


     function loop_through(type,color){
       let types = []
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(squares[i][j].dataset.type == type && squares[i][j].dataset.color == color){
                        types.push(squares[i][j])
                }
                
            }
            
        }
        return types
     }

     function hightlight() {
        let White_Attack = king_check("white")
        let Black_Attack = king_check("black")
        if(turn){
            Black_Attack.forEach(elements=>{
                  if( elements.dataset.type === "king"){
                    if(elements.dataset.color === "white"){
                        check(elements)
                    }
                  }
                 
            })
        }
        else{
            White_Attack.forEach(elements=>{
                  if( elements.dataset.type === "king"){
                    if(elements.dataset.color === "black"){
                        check(elements)
                    }
                  }
                 
            })  
        }
  }
function check(king) {
    king.classList.add("Bad")
    kg  = king
    KingChecked = true
   
}
function GetMoves(board) {
    console.log(KingChecked)
    let color = board.dataset.color
    let type = board.dataset.type
    let a = Number(board.dataset.row)
    let b = Number(board.dataset.column)
    enemyColor = color=="white"? "black":"white"
    let moves = []
   

    // 🪖 PAWN
    if (type === "pawn") {
        let dir = color === "white" ? -1 : 1

        // forward move
        if (a + dir >= 0 && a + dir < 8 && !squares[a + dir][b].dataset.color) {
            moves.push(squares[a + dir][b])

            // double move
            if ((color === "white" && a === 6) || (color === "black" && a === 1)) {
                if (!squares[a + 2 * dir][b].dataset.color) {
                    moves.push(squares[a + 2 * dir][b])
                }
            }
        }

        // captures
        if (b + 1 < 8 && squares[a + dir]?.[b + 1]?.dataset.color && squares[a + dir]?.[b + 1]?.dataset.color !== color) {
            moves.push(squares[a + dir][b + 1])
        }

        if (b - 1 >= 0 && squares[a + dir]?.[b - 1]?.dataset.color && squares[a + dir]?.[b - 1]?.dataset.color !== color) {
            moves.push(squares[a + dir][b - 1])
        }
       
    }

    // 🐴 KNIGHT
    if (type === "knight") {
        const m = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]

        m.forEach(([dx, dy]) => {
            let x = a + dx
            let y = b + dy

            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (squares[x][y].dataset.color !== color) {
                    moves.push(squares[x][y])
                }
            }
        })
    }

    // 👑 KING
    if (type === "king") {
        const m = [[1,0],[1,1],[0,1],[-1,0],[-1,-1],[0,-1],[1,-1],[-1,1]]

        m.forEach(([dx, dy]) => {
            let x = a + dx
            let y = b + dy

            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (squares[x][y].dataset.color !== color) {
                    moves.push(squares[x][y])
                }
            }
        })
        let enemies = king_check(enemyColor)
            
         moves = moves.filter(move=>{   return !enemies.includes(move)

         })     
    }

    // 🏰 ROOK
    if (type === "rook") {
        moves = line(a, b, 1, 0)
    }

    // ⛪ BISHOP
    if (type === "bishop") {
        moves = line(a, b, 0, 1)
    }

    // 👑 QUEEN
    if (type === "queen") {
        moves = line(a, b, 1, 1)
    }
      
   
     if(Iskingchecked(color)){
     
        moves = kingcheckedMoves(board)
    
    }

     console.log(moves)
    
    
    return moves
}

function showMoves(board){
   clicked = board
   
    options = GetMoves(board)
    console.log(options)
    options.forEach(moves=>{
        if(moves.dataset.type !== "king"){
        moves.classList.add("options")
        if(moves.dataset.color){
             moves.classList.add("win")
             

            }

        }
    })
     
    if(board.dataset.type =="king"){
        castling_check(board)
       
    }
}
function castling_check(board){
    let a =Number(board.dataset.row)
    let b = Number(board.dataset.column)
      let counter = 0
       let counter1 = 0
       if(board.dataset.moved === "false"){
        king = board
         // near side Castling ******************************************************//
       for (let z = 1; z < 4; z++) {
        if(b+z<8 && !squares[a][b+z].dataset.type){
            counter++
        
        
       }
       }
       if(counter == 2 ){
        if (squares[a][b+3].dataset.color == squares[a][b].dataset.color) {
            if(squares[a][b+3].dataset.moved){
             squares[a][b+3].classList.add("castling")
            }
        }
       
        
       }
       // Far side castling ********************************************************//
          
       for (let z1 = 1; z1 < 5; z1++) {
        if(b-z1>-1 && !squares[a][b-z1].dataset.type){
            counter1++
        
        
       }
       }
       if(counter1 == 3 ){
        if (squares[a][b-4].dataset.color == squares[a][b].dataset.color) {
            if(squares[a][b-4].dataset.moved){
             squares[a][b-4].classList.add("castling")
            }
        }
       
        
       }
    }
    }

function kingcheckedMoves(board){
    let color = board.dataset.color 
    // get the king 
    let Kingarray = loop_through("king",color)
    let King = Kingarray[0]
    let EnemyPieces = []
    let Enemycolor = color == "white"? "black":"white"
    let attackers = []
   let validMove = []
    //get all the enemies
     for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (squares[i][j].dataset.color === Enemycolor) {
        EnemyPieces.push(squares[i][j])
      }
    }
  }

    // get the attacker && code for capturing the attacker while under check
     for (let i = 0; i < EnemyPieces.length; i++) {
    let moves = GetattackMoves(EnemyPieces[i])
    if (moves.includes(King)) {
      attackers.push(EnemyPieces[i])
    }
  }
  if(attackers.length == 1){
  

    let Moves = GetattackMoves(board)
    if(Moves.includes(attackers[0])){
        
     validMove = attackers
        
    }
   
    
  }
  
  return validMove


}
function GetattackMoves(board) {
    let color = board.dataset.color
    let type = board.dataset.type
    let a = Number(board.dataset.row)
    let b = Number(board.dataset.column)
    enemyColor = color=="white"? "black":"white"
    let moves = []

    // 🪖 PAWN
    if (type === "pawn") {
        let dir = color === "white" ? -1 : 1

        // forward move
        if (a + dir >= 0 && a + dir < 8 && !squares[a + dir][b].dataset.color) {
            moves.push(squares[a + dir][b])

            // double move
            if ((color === "white" && a === 6) || (color === "black" && a === 1)) {
                if (!squares[a + 2 * dir][b].dataset.color) {
                    moves.push(squares[a + 2 * dir][b])
                }
            }
        }

        // captures
        if (b + 1 < 8 && squares[a + dir]?.[b + 1]?.dataset.color && squares[a + dir]?.[b + 1]?.dataset.color !== color) {
            moves.push(squares[a + dir][b + 1])
        }

        if (b - 1 >= 0 && squares[a + dir]?.[b - 1]?.dataset.color && squares[a + dir]?.[b - 1]?.dataset.color !== color) {
            moves.push(squares[a + dir][b - 1])
        }
    }

    // 🐴 KNIGHT
    if (type === "knight") {
        const m = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]

        m.forEach(([dx, dy]) => {
            let x = a + dx
            let y = b + dy

            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (squares[x][y].dataset.color !== color) {
                    moves.push(squares[x][y])
                }
            }
        })
    }

    // 👑 KING
    if (type === "king") {
        const m = [[1,0],[1,1],[0,1],[-1,0],[-1,-1],[0,-1],[1,-1],[-1,1]]

        m.forEach(([dx, dy]) => {
            let x = a + dx
            let y = b + dy

            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (squares[x][y].dataset.color !== color) {
                 moves.push(squares[x][y])
                }
            }
        })
        let enemies = king_check(enemyColor)
            
         
    }

    // 🏰 ROOK
    if (type === "rook") {
        moves = line(a, b, 1, 0)
    }

    // ⛪ BISHOP
    if (type === "bishop") {
        moves = line(a, b, 0, 1)
    }

    // 👑 QUEEN
    if (type === "queen") {
        moves = line(a, b, 1, 1)
    }

    return moves
}
function intesection(array1,array2){
Intersect = []
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
           if (array1[i]==array2[j]) {
             Intersect.push(array1[i])
           }
            
        }
        
    }
    return Intersect
}
// function that checks whether the king is checked
function Iskingchecked(king){
    
    EnemyColor = king == "black"? "white":"black"
    let King = loop_through("king",king)[0]
    let enemyAttack = king_check(EnemyColor)
    if(enemyAttack.includes(King)){
        return true
    }
    else{
King.classList.remove("Bad")
    
    return false
    }
}
// function for stopping piece from moving if they can put king on check
function blockIllegalMove(piece) {

    let legalMoves = []
    let moves = GetattackMoves(piece)

    let color = piece.dataset.color
    let enemyColor = color === "white" ? "black" : "white"

    let startX = Number(piece.dataset.row)
    let startY = Number(piece.dataset.column)

    let type = piece.dataset.type

    moves.forEach(move => {

        let endX = Number(move.dataset.row)
        let endY = Number(move.dataset.column)

        // save captured piece
        let capturedType = move.dataset.type
        let capturedColor = move.dataset.color

        // simulate move
        remove(startX, startY, true)

        if (capturedType) {
            remove(endX, endY, true)
        }

        set(type, color, endX, endY, true)

        // check if king still attacked
        let king = loop_through("king", color)[0]

        let enemyAttacks = king_check(enemyColor)

        if (!enemyAttacks.includes(king)) {
            legalMoves.push(move)
        }

        // undo simulation
        remove(endX, endY, true)

        set(type, color, startX, startY, true)

        if (capturedType) {
            set(capturedType, capturedColor, endX, endY, true)
        }

    })

    return legalMoves
}