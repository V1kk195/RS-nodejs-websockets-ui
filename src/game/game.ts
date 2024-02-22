import {
  AddShipsRequestData,
  AttackRequestData,
  AttackResponse,
  AttackResponseData,
  Ship,
  ShotStatus,
  StartGameResponse,
  StartGameResponseData,
  TurnResponse,
  TurnResponseData,
} from "./types";
import { games, turn } from "../db";
import { Command } from "../types";
import { getRival, serializeData } from "../helpers";
import { WebSocket } from "ws";

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

export const attack = (data: AttackRequestData): AttackResponse => {
  const game = games.get(data.gameId)!;
  const rivalId = getRival(data.gameId, data.indexPlayer);
  let status: ShotStatus = "miss";
  turn.playerId = rivalId;

  console.log("rival", game.players[rivalId]);

  if (game) {
    game.players[rivalId] = game?.players[rivalId].map((ship: Ship) => {
      console.log({ data });
      console.log("rival ship position", ship.position);
      const isShot = ship.position.x === data.x && ship.position.y === data.y;
      let updatedShip = ship;
      if (ship.length === 1 && isShot) {
        status = "killed";
        updatedShip = { ...ship, length: ship.length - 1 };
        turn.playerId = data.indexPlayer;
      } else if (isShot) {
        status = "shot";
        updatedShip = { ...ship, length: ship.length - 1 };
        turn.playerId = data.indexPlayer;
      }

      return updatedShip;
    });
  }

  const responseData: AttackResponseData = {
    currentPlayer: data.indexPlayer,
    position: { x: data.x, y: data.y },
    status,
  };

  return {
    type: Command.attack,
    data: serializeData(responseData),
    id: 0,
  };
};

export const sendTurn = (
  ws: WebSocket,
  clientId: number,
  gameId: number,
): void => {
  if (turn.playerId && turn.playerId !== clientId) {
    return;
  }

  const randomTurn = Math.random() ? clientId : getRival(gameId, clientId);

  turn.playerId = turn.playerId ? turn.playerId : randomTurn;

  console.log({ clientId });
  console.log({ currentPlayer: turn.playerId });
  const res: TurnResponse = {
    type: Command.turn,
    data: serializeData({ currentPlayer: turn.playerId } as TurnResponseData),
    id: 0,
  };

  ws.send(serializeData(res));
};
