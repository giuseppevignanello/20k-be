// backend/game.js
function createDeck() {
  const suits = ["mazze", "denari", "spade", "coppe"];
  const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const deck = [];

  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value });
    });
  });

  return deck.sort(() => Math.random() - 0.5);
}

module.exports = { createDeck };
