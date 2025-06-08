const PreGamePhaseController = require("./PreGamePhaseController");

class GameController {
  constructor(room) {
    this.room = room;
    this.preGamePhaseController = new PreGamePhaseController(this.room);
  }

  start() {
    const dealerResponse = this.preGamePhaseController.startDealerPhase();
    const firstThreeCardsDistributionResponse =
      this.preGamePhaseController.firstThreeCardsDistribution();
    const firstThreeCardsDistribution =
      firstThreeCardsDistributionResponse.firstThreeCards;
    this.room.remainingDeck = firstThreeCardsDistributionResponse.remainingDeck;
    this.room.broadcast(dealerResponse);

    this.room.users.forEach((user, index) => {
      const playerCards = {
        type: "initial-cards",
        cards: firstThreeCardsDistribution[user.username],
      };

      user.socket.send(JSON.stringify(playerCards));
    });
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
