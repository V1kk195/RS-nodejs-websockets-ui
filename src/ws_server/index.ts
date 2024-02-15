import { RawData, WebSocketServer } from "ws";
import { deserializeData, serializeData } from "../helpers";
import { loginPlayer } from "../player";

export const initiateWsServer = (port: number): void => {
  const wss = new WebSocketServer({
    port,
  });

  wss.on("connection", function connection(ws, req) {
    console.log(`New client connected on `, req.socket.address());

    ws.on("error", console.error);

    ws.on("message", function message(data: RawData, isBinary) {
      const deserializedData = deserializeData(data);
      const content = deserializeData(deserializedData.data);

      if (deserializedData.type === "reg") {
        ws.send(serializeData(loginPlayer(content)));
      }

      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
