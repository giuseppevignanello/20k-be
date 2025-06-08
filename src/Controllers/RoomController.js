const RoomValidator = require('../Validators/RoomValidator');

class RoomController {
  constructor(roomService, webSocketHandler) {
    this.roomService = roomService
    this.webSocketHandler = webSocketHandler;
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
}

module.exports = RoomController;