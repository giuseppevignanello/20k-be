const { v4: uuidv4 } = require('uuid');

class RoomService {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(playersNum, maxScore) {
        const roomId = uuidv4();
        const room = {id: roomId, playersNum: playersNum, maxScore: maxScore, users: []}
        this.rooms.set(roomId, room); 
        return roomId;
    }

    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
}

module.exports = RoomService;