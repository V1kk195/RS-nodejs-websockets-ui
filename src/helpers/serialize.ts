import { RawData } from "ws";

export const serializeData = (data: any) => {
  return JSON.stringify(data);
};

export const deserializeData = (data: RawData) => {
  const stringData = data.toString();
  return stringData ? JSON.parse(stringData) : undefined;
};
