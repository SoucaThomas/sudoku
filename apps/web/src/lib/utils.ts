import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum GameTypes {
  SUDOKU = "Sudoku",
  ONE_UP = "One Up",
}

export enum GameDifficulties {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}
