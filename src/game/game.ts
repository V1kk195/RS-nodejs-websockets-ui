import {
  AddShipsRequestData,
  StartGameResponse,
  StartGameResponseData,
} from "./types";
import { games } from "../db";
import { Command } from "../types";
import { serializeData } from "../helpers";

export const addShips = (
  { indexPlayer, gameId, ships }: AddShipsRequestData,
  clientId: number,
): StartGameResponse | void => {
  const gameBoard = games.get(gameId);

  if (!gameBoard) {
    games.set(gameId, {
      gameId: gameId,
      players: { [indexPlayer]: ships },
    });
  } else {
    games.set(gameId, {
      ...gameBoard,
      players: { ...gameBoard?.players, [indexPlayer]: ships },
    });
  }

  const currentPlayers = games.get(gameId)!.players;

  console.log("add ships", games);

  const responseData: StartGameResponseData = {
    currentPlayerIndex: clientId,
    ships: currentPlayers[clientId],
  };

  if (Object.keys(currentPlayers).length > 1) {
    return {
      type: Command.startGame,
      data: serializeData(responseData),
      id: 0,
    };
  }
};
