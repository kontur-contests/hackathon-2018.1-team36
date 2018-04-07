const Generator = require('./Generator.js');
const HashMap = require('hashmap');

class Game {
    constructor(width, height) {
        this._width = width;
        this._height = height;

        this._tanks = new HashMap();

        this._obstacles = Generator.init_obstacles(width, height);

        this._bullets = [];
    }

    update(dt) {
        this._tanks.forEach(function (tank, _, __){
            // first - fire!
            if (tank.is_fire){
                const bullet = tank.fire();

                if (bullet){
                    this._bullets.push(bullet);
                }
            }

            // then - move
            tank.move(dt);

        })
        // for all tank recalculate
        // bullets
    }

    createTank() {
        let tank = Generator.new_tank();

        this._tanks[tank.tank_id] = tank;

        return tank.tank_id;
    }

    currentState() {
        return "game state";
    }

    getTank(id) {
        return this._tanks[id];
    }
}

module.exports = Game;
