const Game = require('./lib/engine/Game');

const game = new Game(1000, 1000);

const tank_id = game.createTank();

const tank = game.getTank(tank_id);

console.log(game);

tank.setFire(1);

game.update(1);
game.update(1);
game.update(1);
game.update(1);
game.update(1);
game.update(1);
game.update(1);
game.update(1);
game.update(1);
game.update(1);
game.update(1);
game.update(1);

console.log(game);
