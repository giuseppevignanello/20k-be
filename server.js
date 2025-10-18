const express = require("express");
const { WebSocketServer } = require("ws");
const cors = require("cors");
const WebSocketHandler = require("./src/Controllers/WebSocketHandler");
const RoomController = require("./src/Controllers/RoomController");
const RoomService = require("./src/Services/RoomService");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ noServer: true });
const webSocketHandler = new WebSocketHandler(wss, roomService);
const roomService = new RoomService();
const roomController = new RoomController(roomService, webSocketHandler);

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", (socket) => {
  webSocketHandler.handleConnection(socket);
});

app.post("/create-room", roomController.createRoom.bind(roomController));
app.get("/room-exists/:roomId", roomController.roomExists.bind(roomController));
