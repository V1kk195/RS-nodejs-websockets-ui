import { Player, Winner } from "./player";
import { Game, GameRoom } from "./gameRoom/types";

export const players: Map<number, Player> = new Map();

export const rooms: GameRoom[] = [];

export const games: Game[] = [];

export const winners: Winner[] = [];
