import {
  AddPlayerToRoomRequestData,
  AddPlayerToRoomResponse,
  Game,
  Room,
  UpdateRoomStateResponse,
} from "./types";
import { Command } from "../types";
import { games, players, rooms } from "../db";
import { serializeData } from "../helpers";

const getCurrentPlayer = (clientId: number) => {
  return players.get(clientId)!;
};

export const updateRoom = (): UpdateRoomStateResponse => {
  console.log(rooms);
  return {
    type: Command.updateRoom,
    data: serializeData(rooms),
    id: 0,
  };
};

export const createRoom = (clientId: number): UpdateRoomStateResponse => {
  console.log("Room created");
  const currentPlayer = getCurrentPlayer(clientId);
  console.log(rooms);

  const room: Room = {
    roomId: rooms.length + 1,
    roomUsers: [
      {
        name: currentPlayer.name,
        index: clientId,
      },
    ],
  };
  rooms.push(room);
  console.log(rooms);

  return updateRoom();
};

export const addUserToRoom = (
  { indexRoom }: AddPlayerToRoomRequestData,
  clientId: number,
): AddPlayerToRoomResponse | string => {
  const room = rooms.find((item) => item.roomId === indexRoom);
  console.log(room);

  if (room && room.roomUsers.find((item) => item.index === clientId)) {
    return "You're already in this room";
  }

  const newGame: Game = {
    idGame: games.length + 1,
    idPlayer: clientId,
  };
  games.push(newGame);
  console.log({ games });

  rooms.filter((item) => item.roomId !== indexRoom);

  return {
    type: Command.createGame,
    data: serializeData(newGame),
    id: 0,
  };
};
