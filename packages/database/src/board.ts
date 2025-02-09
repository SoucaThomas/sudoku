import { prisma, Board } from "./client";

export function getBoard(boardId: string) {
    return prisma.board.findUnique({
        where: {
            boardId,
        },
    });
}

export function updateBoard(boardId: string, board: Board) {
    const { boardId: _, ...boardData } = board;
    return prisma.board.update({
        where: {
            boardId,
        },
        data: {
            ...boardData,
        },
    });
}
