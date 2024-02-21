import { Player, Winner } from "./player";
import { GameRoom } from "./gameRoom/types";
import { GameBoard } from "./game";

export const players: Map<number, Player> = new Map();

export const rooms: GameRoom[] = [];

export const games: Map<number, GameBoard> = new Map();

export const winners: Winner[] = [];
