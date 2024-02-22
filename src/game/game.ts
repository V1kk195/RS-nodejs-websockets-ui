import {
  AddShipsRequestData,
  AttackRequestData,
  AttackResponse,
  AttackResponseData,
  Ship,
  ShipTypeLength,
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

const calculateShipIsShot = (
  { direction, position, type, length }: Ship,
  data: AttackRequestData,
): boolean => {
  if (!length) {
    return false;
  }

  const shipLength = ShipTypeLength[type];
  let shipEndX, shipEndY;

  if (!direction) {
    shipEndX = position.x + shipLength - 1;
    shipEndY = position.y;
  } else {
    shipEndX = position.x;
    shipEndY = position.y + shipLength - 1;
  }

  return (
    (data.x >= position.x &&
      data.x <= shipEndX! &&
      data.y === position.y &&
      !direction) ||
    (data.y >= position.y &&
      data.y <= shipEndY! &&
      data.x === position.x &&
      direction)
  );
};

const calculatePositionsAroundKilled = ({
  position,
  type,
  direction,
}: Ship) => {
  const positions = [];

  function isValidPosition(x: number, y: number) {
    return x >= 0 && x <= 9 && y >= 0 && y <= 9;
  }

  const length = ShipTypeLength[type];
  const x = position.x;
  const y = position.y;

  if (!direction) {
    for (let i = -1; i <= length; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i >= 0 && i < length && j === 0) {
          continue;
        }

        if (isValidPosition(x + i, y + j)) {
          positions.push({ x: x + i, y: y + j });
        }
      }
    }
  } else {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= length; j++) {
        if (i === 0 && j >= 0 && j < length) {
          continue;
        }

        if (isValidPosition(x + i, y + j)) {
          positions.push({ x: x + i, y: y + j });
        }
      }
    }
  }

  return positions;
};

export const attack = (
  data: AttackRequestData,
  send: WebSocket["send"],
): AttackResponse => {
  const game = games.get(data.gameId)!;
  const rivalId = getRival(data.gameId, data.indexPlayer);
  let status: ShotStatus = "miss";
  turn.playerId = rivalId;

  console.log("rival", game.players[rivalId]);

  if (game) {
    game.players[rivalId] = game?.players[rivalId].map((ship: Ship) => {
      const isShot = calculateShipIsShot(ship, data);
      let updatedShip = ship;

      if (ship.length === 1 && isShot) {
        status = "killed";
        updatedShip = { ...ship, length: ship.length - 1 };

        const aroundShip = calculatePositionsAroundKilled(ship);
        aroundShip.forEach((position) => {
          send(
            serializeData({
              type: Command.attack,
              data: serializeData({
                currentPlayer: data.indexPlayer,
                position: { x: position.x, y: position.y },
                status: "missed",
              }),
              id: 0,
            }),
          );
        });

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
  const randomTurn = Math.random() ? clientId : getRival(gameId, clientId);

  turn.playerId = turn.playerId ? turn.playerId : randomTurn;

  const res: TurnResponse = {
    type: Command.turn,
    data: serializeData({ currentPlayer: turn.playerId } as TurnResponseData),
    id: 0,
  };

  ws.send(serializeData(res));
};
