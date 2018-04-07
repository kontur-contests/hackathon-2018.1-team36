const Generator = require('./Generator.js');

class Game {
    constructor(width, height) {
        this._width = width;
        this._height = height;

        this._tanks = {};

        this._obstacles = Generator.init_obstacles();

        this._bullets = [];
    }

    update() {
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
}

module.exports = Game;
