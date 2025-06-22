const PreGamePhaseController = require("./PreGamePhaseController");

class GameController {
  constructor(room) {
    this.room = room;
    this.preGamePhaseController = new PreGamePhaseController(this.room);
  }

  start() {
    this.handleDealerSelection();
    const firstThreeCardsDistributionResponse =
      this.preGamePhaseController.firstThreeCardsDistribution();
    const firstThreeCardsDistribution =
      firstThreeCardsDistributionResponse.firstThreeCards;
    this.room.remainingDeck = firstThreeCardsDistributionResponse.remainingDeck;
  

    this.room.users.forEach((user, index) => {
      const playerCards = {
        type: "initial-cards",
        cards: firstThreeCardsDistribution[user.username],
      };

      user.socket.send(JSON.stringify(playerCards));
    });
  }

  // TODO: move to Service
  handleDealerSelection() {
    const dealerAndDistributedCards = this.preGamePhaseController.startDealerPhase();
    this.broadcastDealerAndDistributedCards(dealerAndDistributedCards)
  }

  broadcastDealerAndDistributedCards(dealerAndDistributedCards) {
    const response = {
      type: "dealer-selection",
      dealer: {
        username: dealerAndDistributedCards.dealer.username,
        socketId: dealerAndDistributedCards.dealer.socket.id,
      },
      distributedCards: dealerAndDistributedCards.distributedCards,
    }

    this.room.broadcast(response);
  }

  distributeTwoCards() {
    const twoCardsDistributionResponse =
      this.preGamePhaseController.twoCardsDistribution();
    const twoCardsDistribution =
      twoCardsDistributionResponse.twoCardsDistribution;
    this.room.users.forEach((user, index) => {
      const playerCards = {
        type: "two-cards",
        cards: twoCardsDistribution[user.username],
      };

      user.socket.send(JSON.stringify(playerCards));
    });
  }
}

module.exports = GameController;
