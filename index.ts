import { httpServer } from "./src/http_server";
import { initiateWsServer } from "./src/ws_server";

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start websocket server on the ${WS_PORT} port!`);
initiateWsServer(WS_PORT);

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
