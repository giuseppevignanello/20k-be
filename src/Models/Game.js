class Game {
  constructor(room) {
    this.room = room;
    this.deck = this.generateDeck();
  }

  generateDeck() {
    return [];
  }
}

module.exports = Game;
