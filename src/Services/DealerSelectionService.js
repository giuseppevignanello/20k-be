const Deck = require("../Models/Deck");
const Dealer = require("../Models/Player/Dealer");

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
    this.distributeRandomDeck();
    return getFirstDealerAndDistributedCards();
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
        this.tenOfDenariPlayer = new Dealer()
          .setUsername(currentPlayer.username)
          .setSocket(currentPlayer.socket); 
        break;
      }

      playerIndex = (playerIndex + 1) % users.length;
    }
  }

  getFirstDealerAndDistributedCards() {
    // TODO: change with a code error
    if (!this.tenOfDenariPlayer) {
      throw new Error("No player has the Ten of Denari card.");
    }

    return { dealer : this.tenOfDenariPlayer, distributedCards: this.distributedCards };
  }
}
module.exports = DealerSelectionService;
