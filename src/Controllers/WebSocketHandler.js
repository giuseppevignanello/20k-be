const Player = require("../Models/Player/Player");
const Room = require("../Models/Room");
const GameController = require("./GameController");

class WebSocketHandler {
  constructor(wss, roomService) {
    this.wss = wss;
    this.roomService = roomService;
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

    const result = this.roomService.addPlayerToRoom(roomId, username, socket);

    // TODO: changhe with a errore code
    if (result.error === "Room does not exist") {
      socket.send(JSON.stringify({ type: "error", message: result.error }));
      return;
    }

    if (result.error === "Room is full") {
      socket.send(JSON.stringify({ type: "room-full", message: result.error }));
      socket.close();
      return;
    }

    const { room } = result;

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
