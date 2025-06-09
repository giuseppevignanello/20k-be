class RoomFullException extends Error {
  constructor(message = "Room is full") {
    super(message);
    this.name = "RoomFullException";
  }
}
