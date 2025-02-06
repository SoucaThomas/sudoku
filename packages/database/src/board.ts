import { prisma, Board } from "./client";

export function getBoard(boardId: string) {
    // if (!/^[0-9a-fA-F]{24}$/.test(boardId)) {
    //     return;
    // }
    return prisma.board.findUnique({
        where: {
            boardId,
        },
    });
}

export function updateBoard(boardId: string, board: Board) {
    // if (!/^[0-9a-fA-F]{24}$/.test(boardId)) {
    //     return;
    // }
    const { boardId: _, ...boardData } = board; // Destructure and remove boardId from the board object
    return prisma.board.update({
        where: {
            boardId,
        },
        data: {
            ...boardData, // Pass only the rest of the properties
        },
    });
}
