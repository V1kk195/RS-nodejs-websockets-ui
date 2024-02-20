import { UpdateRoomStateResponse } from "./types";
import { Command } from "../types";
import { rooms } from "../db";
import { serializeData } from "../helpers";

export const createRoom = () => {
  console.log("Room created");
};

export const updateRoom = (): UpdateRoomStateResponse => {
  console.log(rooms);
  return {
    type: Command.updateRoom,
    data: serializeData(rooms),
    id: 0,
  };
};
