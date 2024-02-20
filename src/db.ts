import { Player, Winner } from "./player";
import { Room } from "./gameRoom/types";

export const players: Map<number, Player> = new Map();

export const rooms: Room[] = [];

export const winners: Winner[] = [];
