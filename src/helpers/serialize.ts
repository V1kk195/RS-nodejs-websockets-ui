import { RawData } from "ws";

export const serializeData = (data: any) => {
  return JSON.stringify(data);
};

export const deserializeData = (data: RawData) => {
  return JSON.parse(data.toString());
};
