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

    const color = from.dataset.color;
    const type = from.dataset.type;

    // ---- handle castling: move the rook first, king moves via movePiece below ----
    if (move.castle) {
        const row = move.fromRow; // 7 for white, 0 for black

        if (move.castle === "king") {
            // rook goes from h-file (col 7) to f-file (col 5)
            const rookFrom = squares[row][7];
            movePiece(row, 7, row, 5, rookFrom.dataset.color, rookFrom.dataset.type);
        } else {
            // queen side: rook goes from a-file (col 0) to d-file (col 3)
            const rookFrom = squares[row][0];
            movePiece(row, 0, row, 3, rookFrom.dataset.color, rookFrom.dataset.type);
        }
    }

    // king (or any normal piece) move — origin first, destination second
    movePiece(
        move.fromRow,
        move.fromCol,
        move.toRow,
        move.toCol,
        color,
        type
    );
   const stringify = {
    1: "pawn",
    2: "knight",
    3: "bishop",
    4: "rook",
    5 :"queen",
    6: "king"
   }



   
    // ---- handle promotion ----
    if (move.promotion) {
        
        // translate to your UI's string type, then update the square + gameState
        const promotedType = stringify[Math.abs(move.promotion)];
        set(promotedType, color, move.toRow, move.toCol);
        squares[move.toRow][move.toCol].dataset.type = promotedType;
        // update visuals (symbol/innerHTML) to match, however your UI renders pieces
    }
}