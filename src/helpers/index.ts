import { games } from "../db";

export * from "./serialize";

export const getRival = (gameId: number, currentPlayerId: number): number => {
  const game = games.get(gameId)!;
  const rivalId = Object.keys(game?.players).filter(
    (item) => item !== currentPlayerId.toString(),
  )[0];

  return Number(rivalId);
};

export const getWinner = (gameId: number, currentPlayer: number) => {
  const game = games.get(gameId)!;
  const rival = getRival(gameId, currentPlayer);
  const currentPlayerWon = game.players[rival].every(
    (ship) => ship.length === 0,
  );
  const rivalWon = game.players[currentPlayer].every(
    (ship) => ship.length === 0,
  );

  if (currentPlayerWon) {
    return currentPlayer;
  } else if (rivalWon) {
    return rival;
  }

  return undefined;
};
