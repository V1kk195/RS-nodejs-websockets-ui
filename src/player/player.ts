import { Player, LoginResponse, PlayerDataRes } from "./types";
import { Command } from "../types";
import { serializeData } from "../helpers";
import { players } from "../db";

export const loginPlayer = (data: Player): LoginResponse => {
  const foundPlayer = players.findIndex((item) => item.name === data.name);
  console.log(players);

  let newPlayerIndex;

  if (foundPlayer > -1) {
    if (players[foundPlayer].password !== data.password) {
      return {
        type: Command.reg,
        data: serializeData({
          name: data.name,
          index: foundPlayer,
          error: true,
          errorText: "Incorrect password for user",
        } as PlayerDataRes),
        id: 0,
      };
    } else {
      return {
        type: Command.reg,
        data: serializeData({
          name: data.name,
          index: foundPlayer,
          error: false,
          errorText: "",
        } as PlayerDataRes),
        id: 0,
      };
    }
  } else {
    newPlayerIndex = players.push(data);
  }

  console.log(players);

  return {
    type: Command.reg,
    data: serializeData({
      name: data.name,
      index: newPlayerIndex,
      error: false,
      errorText: "",
    } as PlayerDataRes),
    id: 0,
  };
};
