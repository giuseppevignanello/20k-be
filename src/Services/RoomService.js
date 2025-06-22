const Room = require('../Models/Room');
const Player = require('../Models/Player/Player');

class RoomService {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(playersNum, maxScore) {
        const room = new Room(playersNum, maxScore);
        const roomId = room.getRoomId();
        this.rooms.set(roomId, room); 
        return roomId;
    }

    getRoom(roomId) {
        return this.rooms.get(roomId);
    }

    addPlayerToRoom(roomId, username, socket) {
        const room = this.getRoom(roomId);
        if (!room) return { error: "Room does not exist" };

        const player = new Player(username, socket);

        try {
           room.addPlayer(player);
            return { room, player };
        }
        catch (error) {
            return { error: error.name }; 
        }
    }
}

module.exports = RoomService;