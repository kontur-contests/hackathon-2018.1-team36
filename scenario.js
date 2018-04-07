const Game = require('./lib/engine/Game');

const game = new Game(1000, 1000);

const tank1 = game.createTank(500, 500);

const tank2 = game.createTank(550, 500);

const tank = game.getTank(tank1);

function log(game) {
    const state = game.currentState();
    // console.log(JSON.stringify(state, null, 2));
    // console.log(JSON.stringify(state.bullets, null, 2));
    // console.log(state.bullets.map(b => (b.is_expired())));
    console.log('==================================================================');
    // console.log(JSON.stringify(state.bullets, null, 2));
    console.log(JSON.stringify(state.tanks, null, 2));
}

log(game);

tank.setLeftTrackMoving(1);
tank.setFire(1);

log(game);

for (let i = 0; i < 2; i++) {
    game.update(1);
    log(game);
}
