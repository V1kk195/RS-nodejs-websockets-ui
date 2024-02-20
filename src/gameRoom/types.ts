import { Command } from "../types";

export type CreateGameRoomReq = {
  type: Command.createRoom;
  data: "";
  id: 0;
};

export type AddPlayerToRoomRequest = {
  type: Command.addUserToRoom;
  data: {
    indexRoom: number;
  };
  id: 0;
};

export type Game = {
  idGame: number;
  idPlayer: number; // \* id for player in the game session, who have sent add_user_to_room request, not enemy *\
};

export type AddPlayerToRoomResponse = {
  type: Command.createGame; //send for both players in the room
  data: Game;
  id: 0;
};

export type Room = {
  roomId: number;
  roomUsers: [
    {
      name: string;
      index: number;
    },
  ];
};

export type UpdateRoomStateResponse = {
  type: Command.updateRoom;
  data: string; // Room[]
  id: 0;
};