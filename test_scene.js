const Generator = require('./lib/engine/Generator');
const Obstacle = require('./lib/engine/Obstacle');


Generator.init_obstacles(1000, 1000);
// let o1 = new Obstacle(64, 96), o2 = new Obstacle(32, 96);
//
// o1.move(369, 706);
// o2.move(584, 612);
//
// o1.has_intersection(o2);

function log(game) {
    const state = game.currentState();
    // console.log(JSON.stringify(state, null, 2));
    // console.log(JSON.stringify(state.bullets, null, 2));
    // console.log(state.bullets.map(b => (b.is_expired())));
    console.log('==================================================================');
    // console.log(JSON.stringify(state.bullets, null, 2));
    console.log(JSON.stringify(state.tanks[0].position, null, 2));
}
