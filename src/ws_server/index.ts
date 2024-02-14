import { WebSocketServer } from "ws";

export const initiateWsServer = (port: number): void => {
  const wss = new WebSocketServer({
    port,
  });

  wss.on("connection", function connection(ws, req) {
    console.log(`New client connected`);

    ws.on("error", console.error);

    ws.on("message", function message(data) {
      console.log("received: %s", data);
      ws.send(JSON.stringify(`Server received your message: ${data}`));
    });

    ws.send(JSON.stringify({ message: "something" }));

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
