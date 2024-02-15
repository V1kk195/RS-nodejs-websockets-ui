import { Command } from "../types";

export type Player = {
  name: string;
  password: string;
};

export type LoginRequest = {
  type: Command.reg;
  data: Player;
  id: 0;
};

export type PlayerDataRes = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type LoginResponse = {
  type: Command.reg;
  data: string;
  id: 0;
};

export type UpdateWinner = {
  type: Command.updWinners;
  data: [
    {
      name: string;
      wins: number;
    },
  ];
  id: 0;
};
