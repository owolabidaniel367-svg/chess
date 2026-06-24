const captured = makeMove(board, move);

    const score = minimax(
        board,
        depth - 1,
        alpha,
        beta,
        false
    );

    undoMove(board, move, captured);
