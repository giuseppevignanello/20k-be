const Room = require('../Models/Room');
const { RoomNotFoundException, RoomFullException } = require('../Errors/RoomErrors')

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
    const room = this.rooms.get(roomId);
    if (!room) throw new RoomNotFoundException();

    if (room.users.length >= room.maxPlayers) {
        throw new RoomFullException();
    }

    const player = { username, socket}; 
    room.users.push(player);
    room.clients.add(socket);

    return { room, player };
}
}

module.exports = RoomService;