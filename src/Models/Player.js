class Player {
  constructor(username, socket) {
    this.username = username;
    this.socket = socket;
    this.score = 0;
    this.cards = [];
  }
}

module.exports = Player;
