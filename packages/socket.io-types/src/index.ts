export enum GameTypes {
    SUDOKU = "Sudoku",
    ONE_UP = "One Up",
}

export enum GameDifficulties {
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
}

export interface CreateRoomData {
    roomName: string;
    roomPassword?: string;
    roomGame: GameTypes;
    roomDifficulty: GameDifficulties;
    isRoomPublic: boolean;
    roomHost: User;
}

export enum SocketActionTypes {
    create = "create room",
    createFailed = "room creation failed",
    join = "join room",
    joinFailed = "room join failed",
    newJoined = "new user joined",
    leave = "leave room",
    leaveFailed = "room leave failed",
}

export interface GameRoom {
    roomId: string;
    roomName: string;
    roomPassword?: string;
    roomGame: GameTypes;
    roomDifficulty: GameDifficulties;
    isRoomPublic: boolean;
    roomHost: User;
    roomUsers: User[];
}

export interface User {
    userId: string;
    userName: string;
}
