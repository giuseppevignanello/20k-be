const Player = require('./Player');

class Dealer extends Player {
  constructor() {
    super();
    this.name = 'Dealer';
    this.isDealer = true;
  }
}

module.exports = Dealer;
