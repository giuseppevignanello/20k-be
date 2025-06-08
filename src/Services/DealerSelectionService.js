const Deck = require("../Models/Deck");

class DealerSelectionService {
  constructor(room) {
    this.room = room;
    this.randomDeck = [];
    this.distributedCards = [];
    this.tenOfDenariPlayer = null;
  }
  selectFirstDealer() {
    const deck = new Deck();
    this.randomDeck = deck.getRandomDeck();
    return this.distributeRandomDeck();
  }

  distributeRandomDeck() {
    const users = this.room.users;
    let playerIndex = 0;

    while (true) {
      if (this.randomDeck.length === 0) {
        break;
      }

      const card = this.randomDeck.shift();

      const currentPlayer = users[playerIndex];

      this.distributedCards.push(card);

      if (card.suit == "denari" && card.value == 10) {
        this.tenOfDenariPlayer = currentPlayer;
        break;
      }

      playerIndex = (playerIndex + 1) % users.length;
    }

    return this.buildResponse();
  }

  buildResponse() {
    const response = {
      type: "dealer-selection",
      distributedCards: this.distributedCards,
      tenOfDenariPlayer: this.tenOfDenariPlayer,
    };
    return response;
  }
}
module.exports = DealerSelectionService;
