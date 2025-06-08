const Deck = require("../Models/Deck");
const DealerSelectionService = require("../Services/DealerSelectionService");

class PreGamePhaseController {
  constructor(room) {
    this.room = room;
    this.deckModel = new Deck();
  }

  startDealerPhase() {
    const dealerSelectionService = new DealerSelectionService(this.room);
    return dealerSelectionService.selectFirstDealer();
  }

  firstThreeCardsDistribution() {
    this.room.currentDeck = this.deckModel.getRandomDeck();
    const firstThreeCards = [];
    this.room.users.forEach((user) => {
      const cards = this.room.currentDeck.splice(0, 3);
      firstThreeCards[user.username] = cards;
    });
    const response = {
      remainingDeck: this.room.currentDeck,
      firstThreeCards: firstThreeCards,
    };
    return response;
  }

  twoCardsDistribution() {
    const twoCardsDistribution = [];
    this.room.users.forEach((user) => {
      const cards = this.room.currentDeck.splice(0, 2);
      twoCardsDistribution[user.username] = cards;
    });
    const response = {
      remainingDeck: this.room.currentDeck,
      twoCardsDistribution: twoCardsDistribution,
    };
    return response;
  }
}

module.exports = PreGamePhaseController;
