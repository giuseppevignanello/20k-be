class Player {
  constructor(username, socket) {
    this.username = username;
    this.socket = socket;
    this.isDealer = false;
    this.socketId = socket?.id;
    this.score = 0;
    this.cards = [];
  }

  setUsername(username) {
    this.username = username;
    return this;
  }

  setSocket(socket) {
    this.socket = socket;
    this.socketId = socket.id;
    return this;
  }
}

module.exports = Player;
