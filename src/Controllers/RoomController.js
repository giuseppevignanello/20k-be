const { RoomFullException, RoomNotFoundException } = require('../Errors/RoomErrors');
const GameController = require("./GameController");
const RoomValidator = require('../Validators/RoomValidator');

class RoomController {
  constructor(roomService) {
    this.roomService = roomService
  }

  createRoom(req, res) {
    const errors = RoomValidator.validateCreateRoomBody(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    const { playersNum, maxScore } = req.body;
    const roomId = this.roomService.createRoom(playersNum, maxScore);

    res.json({ roomId });
  }

  roomExists(req, res) {
    const { roomId } = req.params;
    const room = this.roomService.getRoom(roomId);
    if (!room) {
      return res.json({ exists: false });
    }
    if (room.users.length >= room.playersNum) {
      return res.json({ exists: true, full: true });
    }

    return res.json({ exists: true, full: false });
  }

  joinRoom(socket, message) {
    const { roomId, username } = message; 
    try {
      const result = this.roomService.addPlayerToRoom(roomId, username, socket); 

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

      if(room.isFull()) {
        const gameController = new GameController(room); 
        gameController.start();
      }
    } catch (error) {
      console.log(error); 
      if(error instanceof RoomFullException) {
        socket.send(JSON.stringify({type: "room-full", message: error.message}));
        socket.close();
      }      
      else if (error instanceof RoomNotFoundException) {
        socket.send(JSON.stringify({tupe:"error", message: error.message}));
      }
      else {
        socket.send(JSON.stringify({type: "error", message: "Unxpected serve error"}))
      }

    }
  }
}

module.exports = RoomController;