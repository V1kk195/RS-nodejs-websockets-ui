import { Command } from "../types";

type Position = {
  x: number;
  y: number;
};

export type Ship = {
  position: Position;
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
};

export type AddShipsRequestData = {
  gameId: number;
  ships: Ship[];
  indexPlayer: number /* id of the player in the current game session */;
};

export type AddShipsRequest = {
  type: Command.addShips;
  data: AddShipsRequestData;
  id: 0;
};

export type StartGameResponseData = {
  ships: Ship[];
  currentPlayerIndex: number /* id of the player in the current game session, who have sent his ships */;
};

// Start game (only after server receives both player's ships positions)
export type StartGameResponse = {
  type: Command.startGame;
  data: string; // StartGameResponseData
  id: 0;
};

export type AttackRequestData = {
  gameId: number;
  indexPlayer: number /* id of the player in the current game session */;
} & Position;

export type AttackRequest = {
  type: Command.attack;
  data: AttackRequestData;
  id: 0;
};

export type AttackResponseData = {
  position: Position;
  currentPlayer: number /* id of the player in the current game session */;
  status: "miss" | "killed" | "shot";
};

// Attack feedback (should be sent after every shot, miss and after kill sent miss for all cells around ship too)
export type AttackResponse = {
  type: Command.attack;
  data: string; // AttackResponseData
  id: 0;
};

export type RandomAttackRequestData = {
  gameId: number;
  indexPlayer: number /* id of the player in the current game session */;
};

export type RandomAttackRequest = {
  type: Command.randomAttack;
  data: RandomAttackRequestData;
  id: 0;
};

// Info about player's turn (send after game start and every attack, miss or kill result)
export type TurnResponse = {
  type: Command.turn;
  data: {
    currentPlayer: number /* id of the player in the current game session */;
  };
  id: 0;
};

export type FinishGameResponse = {
  type: Command.finish;
  data: {
    winPlayer: number /* id of the player in the current game session */;
  };
  id: 0;
};

export type GameBoard = {
  gameId: number;
  players: Record<number, Ship[]>; // playerId: Ship
};
