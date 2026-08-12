import { Chess } from "chess.js";
import { getBestMove } from "./AI.js";

const chess = new Chess();

console.log(chess.board());

chess.move("e4");

console.log(chess.fen());


let board = [
    [-4,-2,-3,-5,-6,-3,-2,-4],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1],
    [4,2,3,5,6,3,2,4]
];


let move = getBestMove(board, "black");

console.log(move);