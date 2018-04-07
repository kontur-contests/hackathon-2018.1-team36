const Game = require('./lib/engine/Game');

const game = new Game(1000, 1000);

const tank_id = game.createTank(500, 500);

const tank = game.getTank(tank_id);

function log(game) {
    const state = game.currentState();
    // console.log(JSON.stringify(state, null, 2));
    // console.log(JSON.stringify(state.bullets, null, 2));
    // console.log(state.bullets.map(b => (b.is_expired())));
    console.log('==================================================================');
    console.log(JSON.stringify(state.bullets, null, 2));
}

tank.setLeftTrackMoving(1);
tank.setFire(1);

for (let i = 0; i < 100; i++) {
    game.update(1);
    log(game);
}
