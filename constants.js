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


// otthe sha
function minimax(board, depth, isMaximizing) {

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

            best = Math.max(best, minimax(newBoard, depth - 1, false));
        }

        return best;

    } else {

        let best = Infinity;

        for (let move of moves) {

            const newBoard = cloneBoard(board);
            applyMove(newBoard, move);

            best = Math.min(best, minimax(newBoard, depth - 1, true));
        }

        return best;
    }
}
