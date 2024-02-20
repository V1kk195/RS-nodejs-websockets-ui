import { Room, UpdateRoomStateResponse } from "./types";
import { Command } from "../types";
import { players, rooms } from "../db";
import { serializeData } from "../helpers";

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
  const currentPlayer = players.get(clientId)!;
  console.log(rooms);

  const room: Room = {
    roomId: rooms.length + 1,
    roomUsers: [
      {
        name: currentPlayer?.name,
        index: clientId,
      },
    ],
  };
  rooms.push(room);
  console.log(rooms);

  return updateRoom();
};
