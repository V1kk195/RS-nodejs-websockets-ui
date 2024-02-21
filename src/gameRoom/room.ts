import {
  AddPlayerToRoomRequestData,
  AddPlayerToRoomResponse,
  Game,
  GameRoom,
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

  const room: GameRoom = {
    roomId: rooms.length + 1,
    roomUsers: [
      {
        name: currentPlayer.name,
        index: clientId,
      },
    ],
    game: {
      gameId: 0,
      players: [],
    },
  };
  rooms.push(room);
  console.log(rooms);

  return updateRoom();
};

export const addUserToRoom = (
  { indexRoom }: AddPlayerToRoomRequestData,
  clientId: number,
): AddPlayerToRoomResponse | string => {
  const room = rooms.find((item) => item.roomId === indexRoom)!;
  console.log("add user", room);

  // const isUserInRoom =
  //   room && room.roomUsers.find((item) => item.index === clientId);
  //
  // if (isUserInRoom && room?.roomUsers.length < 2) {
  //   return "You're already in this room";
  // }

  if (room.game.players.length > 1) {
    return "Maximum players in the room";
  }

  room.game.gameId = room.game.gameId || 1;
  room.game.players.push(clientId);
  console.log({ games });

  const newGame: Game = {
    idGame: room.game.gameId,
    idPlayer: clientId,
  };
  rooms.filter((item) => item.roomId !== indexRoom);

  return {
    type: Command.createGame,
    data: serializeData(newGame),
    id: 0,
  };
};
