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
    name: string;
    password: string;
    public: boolean;
    type: GameTypes;
    difficulty: GameDifficulties;
    hostId: string;
}

export enum SocketActionTypes {
    create = "create room",
    createFailed = "room creation failed",
    join = "join room",
    joinFailed = "room join failed",
    leave = "leave room",
    leaveFailed = "room leave failed",
}

export interface GameRoom {
    roomId: string;
    roomName: string;
    roomPassword: string;
    roomGame: GameTypes;
    roomDifficulty: GameDifficulties;
    isRoomPublic: boolean;
    roomHost: string;
    roomUsers: string[];
}
