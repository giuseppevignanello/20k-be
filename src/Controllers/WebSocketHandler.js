const RoomController = require('./RoomController');

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

  // This is the 'sorting center' of all the entering 
  // websocket communications
  handleMessage(socket, message) {
    const roomController = new RoomController(this.roomService);
    switch (message.type) {
      case "join-room":
        roomController.joinRoom(socket, message);
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

  // TODO: move this to RoomController
  // joinRoom(socket, message) {
  //   const { roomId, username } = message;
  //   try {
  //     const result = this.roomService.addPlayerToRoom(roomId, username, socket);

  //     const { room } = result;

  //     socket.roomId = roomId;
  //     socket.username = username;

  //     socket.send(
  //       JSON.stringify({
  //         type: "room-details",
  //         roomId,
  //         players: room.players,
  //         users: room.users,
  //       })
  //     );

  //     room.updateRoom();

  //     if (room.isFull()) {
  //       const gameController = new GameController(room);
  //       this.gameControllers[roomId] = gameController;
  //       gameController.start();
  //    }
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof RoomFullException) {
  //       socket.send(JSON.stringify({ type: "room-full", message: error.message }));
  //       socket.close();
  //     } 
  //     else if (error instanceof RoomNotFoundException) {
  //       socket.send(JSON.stringify({ type: "error", message: error.message }));
  //     } 
  //     else {
  //       console.error("Unexpected error:", error);
  //       socket.send(JSON.stringify({ type: "error", message: "Unexpected server error" }));
  //     }
  //   }
  // } 
  
  

  handleSuitSelection(message) {
    const { roomId, suit } = message;
    const room = this.roomService.getRoom(roomId);
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
    const room = this.roomService.getRoom(roomId);
    const actualUserOnTurnIndex = message.userOnTurnIndex;
    const newUserOnTurnIndex = actualUserOnTurnIndex + 1;

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
