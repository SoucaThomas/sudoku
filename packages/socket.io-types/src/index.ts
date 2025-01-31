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
    roomPrivate = "room is private",
    joinWithPassword = "room join with password",
    leave = "leave room",
    leaveFailed = "room leave failed",

    message = "message",

    askRooms = "ask rooms",
    roomUpdate = "room update",

    update = "update",
    updateUser = "update user",

    startStop = "start stop",
    getBoard = "get board",
    move = "move made",
    goodMove = "good move",
    badMove = "bad move",
    clear = "clear",

    win = "win",
    lose = "lose",
}

export enum Status {
    PLAYING = "Playing",
    LOST = "Lost",
    WON = "Won",
}
export interface GameRoom {
    roomId: string;
    roomName: string;
    roomPassword?: string;
    roomGame: GameTypes;
    roomDifficulty: GameDifficulties;
    isRoomPublic: boolean;
    roomHost?: User;
    roomUsers: User[];

    isPlaying: boolean;
    totalPlayTime: number;
    lastTimeStarted: Date;

    status: Status;
}

export interface Board {
    serverBoard: string[];
    clientBoard: string[];
    pencilMarks: string[][];
    solution?: string[];
    mistakes: number;
    score: number;
}

export enum MovementActions {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    ONE = "1",
    TWO = "2",
    THREE = "3",
    FOUR = "4",
    FIVE = "5",
    SIX = "6",
    SEVEN = "7",
    EIGHT = "8",
    NINE = "9",
    DELETE = "0",
}

export interface User {
    userId: string;
    userName: string;
    userAvatar?: string;
    color?: string;
}

export interface MessageType {
    user: User;
    message: string;
    time: string;
    messageType: "message" | "system";
    roomId: string;
}

export enum ColorShades {
    LIGHT = "light",
    DARK = "dark",
}
export enum Colors {
    RED = "red",
    GREEN = "green",
    BLUE = "blue",
    YELLOW = "yellow",
    CYAN = "cyan",
    MAGENTA = "magenta",
    ORANGE = "orange",
    PURPLE = "purple",
    LIME = "lime",
    PINK = "pink",
    TEAL = "teal",
}

export const ColorValues: { [key in Colors]: { [key in ColorShades]: string } } = {
    [Colors.RED]: {
        [ColorShades.LIGHT]: "#FFCCCC",
        [ColorShades.DARK]: "#990000",
    },
    [Colors.GREEN]: {
        [ColorShades.LIGHT]: "#AADDAA",
        [ColorShades.DARK]: "#006600",
    },
    [Colors.BLUE]: {
        [ColorShades.LIGHT]: "#CCCCFF",
        [ColorShades.DARK]: "#333399",
    },
    [Colors.YELLOW]: {
        [ColorShades.LIGHT]: "#DDDDAA",
        [ColorShades.DARK]: "#999900",
    },
    [Colors.CYAN]: {
        [ColorShades.LIGHT]: "#AADDDD",
        [ColorShades.DARK]: "#009999",
    },
    [Colors.MAGENTA]: {
        [ColorShades.LIGHT]: "#FFCCFF",
        [ColorShades.DARK]: "#990099",
    },
    [Colors.ORANGE]: {
        [ColorShades.LIGHT]: "#FFD9B3",
        [ColorShades.DARK]: "#CC5200",
    },
    [Colors.PURPLE]: {
        [ColorShades.LIGHT]: "#E6CCFF",
        [ColorShades.DARK]: "#4B0082",
    },
    [Colors.LIME]: {
        [ColorShades.LIGHT]: "#AADDAA",
        [ColorShades.DARK]: "#009900",
    },
    [Colors.PINK]: {
        [ColorShades.LIGHT]: "#FFCCE6",
        [ColorShades.DARK]: "#CC0066",
    },
    [Colors.TEAL]: {
        [ColorShades.LIGHT]: "#AADDDD",
        [ColorShades.DARK]: "#006666",
    },
};
