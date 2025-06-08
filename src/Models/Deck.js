class Deck {
  constructor() {
    this.suits = ["mazze", "denari", "spade", "coppe"];
    this.values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    this.orderedDeck = [];
    this.createOrderedDeck();
  }

  createOrderedDeck() {
    this.suits.forEach((suit) => {
      this.values.forEach((value) => {
        this.orderedDeck.push({ suit, value });
      });
    });
  }

  getRandomDeck() {
    const randomizedDeck = [...this.orderedDeck];
    randomizedDeck.sort(() => Math.random() - 0.5);
    return randomizedDeck;
  }
}

module.exports = Deck;
