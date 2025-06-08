const Player = require("../Models/Player");
const Room = require("../Models/Room");
const GameController = require("./GameController");

class WebSocketHandler {
  constructor(wss) {
    this.wss = wss;
    this.rooms = {};
    this.gameControllers = {};
  }

  handleConnection(socket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data);
      this.handleMessage(socket, message);
    });
  }

  handleMessage(socket, message) {
    switch (message.type) {
      case "join-room":
        this.joinRoom(socket, message);
        break;
      case "suit-selected":
        this.handleSuitSelection(message);
        break;
      case "playing-decision":
        this.handlePlayingDecision(message);
      default:
        break;
    }
  }

  joinRoom(socket, message) {
    const { roomId, username } = message;

    if (!this.rooms[roomId]) {
      socket.send(
        JSON.stringify({ type: "error", message: "Room does not exist" })
      );
      return;
    }

    const room = this.rooms[roomId];
    const player = new Player(username, socket);

    if (room.addPlayer(player)) {
      socket.roomId = roomId;
      socket.username = username;

      socket.send(
        JSON.stringify({
          type: "room-details",
          roomId,
          players: room.players,
          users: room.users,
        })
      );

      room.updateRoom();

      if (room.isFull()) {
        const gameController = new GameController(room);
        this.gameControllers[roomId] = gameController;
        gameController.start();
      }
    } else {
      socket.send(
        JSON.stringify({ type: "room-full", message: "Room is full" })
      );
      socket.close();
    }
  }

  handleSuitSelection(message) {
    const { roomId, suit } = message;
    const room = this.rooms[roomId];
    const actualUserOnTurnIndex = message.userOnTurnIndex;
    const newUserOnTurnIndex = (actualUserOnTurnIndex + 1) % room.users.length;
    room.broadcast({
      type: "suit-selected",
      roomId: roomId,
      suit: suit,
      userOnTurnIndex: newUserOnTurnIndex,
    });
    const gameController = this.gameControllers[roomId];
    if (gameController) {
      gameController.distributeTwoCards();
    }
  }

  handlePlayingDecision(message) {
    const { roomId, user, playingDecision } = message;
    const room = this.rooms[roomId];
    const actualUserOnTurnIndex = message.userOnTurnIndex;
    const newUserOnTurnIndex = actualUserOnTurnIndex + 1;
    console.log("newUserOnTurnIndex", newUserOnTurnIndex);
    console.log("actualUserOnTurnIndex", actualUserOnTurnIndex);
    console.log(user, user);

    room.broadcast({
      type: "playing-decision",
      roomId: roomId,
      user: user,
      playingDecision: playingDecision,
      userOnTurnIndex: newUserOnTurnIndex,
    });
  }
}

module.exports = WebSocketHandler;
