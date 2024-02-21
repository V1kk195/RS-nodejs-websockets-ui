import { games } from "../db";

export * from "./serialize";

export const getRival = (gameId: number, currentPlayerId: number): number => {
  const game = games.get(gameId)!;
  const rivalId = Object.keys(game?.players).filter(
    (item) => item !== currentPlayerId.toString(),
  )[0];

  return Number(rivalId);
};
