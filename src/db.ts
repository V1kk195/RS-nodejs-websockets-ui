import { Player, Winner } from "./player";
import { Game, Room } from "./gameRoom/types";

export const players: Map<number, Player> = new Map();

export const rooms: Room[] = [];

export const games: Game[] = [];

export const winners: Winner[] = [];
