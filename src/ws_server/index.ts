import { RawData, WebSocketServer, WebSocket } from "ws";
import { deserializeData, getWinner, serializeData } from "../helpers";
import { loginPlayer, updateWinners } from "../player";
import { Command } from "../types";
import { addUserToRoom, createRoom, updateRoom } from "../gameRoom/room";
import { IncomingMessage } from "node:http";
import { addShips, attack, finishGame, sendTurn } from "../game/game";
import { AddShipsRequestData, AttackRequestData } from "../game";

type WebsocketWithId = WebSocket & { id: number };

let index = 0;
const websockets = new Map();

const sendTo =
  (clientId: number) =>
  (data: any): void => {
    if (
      websockets.get(clientId) &&
      websockets.get(clientId).readyState === WebSocket.OPEN
    )
      websockets.get(clientId).send(data);
  };

// const getSendToAll =
//   (wss: WebSocketServer, isBinary: boolean) => (data: string) => {
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(data, { binary: isBinary });
//       }
//     });
//   };

export const initiateWsServer = (port: number): void => {
  const wss = new WebSocketServer({
    port,
  });

  wss.on(
    "connection",
    function connection(ws: WebsocketWithId, req: IncomingMessage) {
      index++;
      const clientId = index;
      ws.id = clientId;
      websockets.set(clientId, ws);
      console.log(`New client ${clientId} connected on `, req.socket.address());
      const send = sendTo(clientId);

      ws.on("error", console.error);

      ws.on("message", function message(data: RawData, isBinary: boolean) {
        const deserializedData = deserializeData(data);
        const content = deserializeData(deserializedData.data);
        const messageType = deserializedData.type;

        if (messageType === Command.reg) {
          send(serializeData(loginPlayer(content, clientId)));
          send(serializeData(updateRoom()));
          send(serializeData(updateWinners()));
        }

        if (messageType === Command.createRoom) {
          send(serializeData(createRoom(clientId)));
        }

        if (messageType === Command.addUserToRoom) {
          (wss.clients as Set<WebsocketWithId>).forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(serializeData(addUserToRoom(content, client.id)), {
                binary: isBinary,
              });
            }
          });
        }

        if (messageType === Command.addShips) {
          (wss.clients as Set<WebsocketWithId>).forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              const data = addShips(content, client.id);
              client.send(serializeData(data), {
                binary: isBinary,
              });

              if (data) {
                sendTurn(
                  client,
                  client.id,
                  (content as AddShipsRequestData).gameId,
                );
              }
            }
          });
        }

        if (messageType === Command.attack) {
          send(serializeData(attack(content, send)));

          const winner = getWinner(
            (content as AttackRequestData).gameId,
            clientId,
          );

          (wss.clients as Set<WebsocketWithId>).forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              if (winner) {
                client.send(serializeData(finishGame(winner)));
                client.send(serializeData(updateWinners()));
              } else {
                sendTurn(
                  client,
                  client.id,
                  (content as AttackRequestData).gameId,
                );
              }
            }
          });
        }

        if (messageType === Command.randomAttack) {
          console.log("random attack");

          (wss.clients as Set<WebsocketWithId>).forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              sendTurn(
                client,
                client.id,
                (content as AttackRequestData).gameId,
              );
            }
          });
        }
      });

      ws.on("close", () => {
        websockets.delete(clientId);
        console.log(`Client ${clientId} disconnected`);
      });
    },
  );
};
