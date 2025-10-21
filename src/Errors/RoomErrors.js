class RoomNotFoundException extends Error {
  constructor() {
    super("Room does not exist");
    this.name = "RoomNotFoundException";
  }
}

class RoomFullException extends Error {
  constructor() {
    super("Room is full");
    this.name = "RoomFullException";
  }
}

module.exports = { RoomNotFoundException, RoomFullException };
