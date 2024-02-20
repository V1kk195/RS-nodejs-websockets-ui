import {
  Player,
  LoginResponse,
  PlayerDataRes,
  UpdateWinnersResponse,
} from "./types";
import { Command } from "../types";
import { serializeData } from "../helpers";
import { players, winners } from "../db";

export const loginPlayer = (data: Player, clientId: number): LoginResponse => {
  const foundPlayer = players.get(clientId);
  console.log(players);

  if (foundPlayer) {
    if (foundPlayer.password !== data.password) {
      return {
        type: Command.reg,
        data: serializeData({
          name: foundPlayer.name,
          index: clientId,
          error: true,
          errorText: "Incorrect password for user",
        } as PlayerDataRes),
        id: 0,
      };
    } else {
      return {
        type: Command.reg,
        data: serializeData({
          name: foundPlayer.name,
          index: clientId,
          error: false,
          errorText: "",
        } as PlayerDataRes),
        id: 0,
      };
    }
  } else {
    players.set(clientId, data);
  }

  console.log(players);

  return {
    type: Command.reg,
    data: serializeData({
      name: data.name,
      index: clientId,
      error: false,
      errorText: "",
    } as PlayerDataRes),
    id: 0,
  };
};

export const updateWinners = (): UpdateWinnersResponse => {
  console.log(winners);
  return {
    type: Command.updWinners,
    data: serializeData(winners),
    id: 0,
  };
};
