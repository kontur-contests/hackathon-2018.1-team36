class Game {
    constructor(width, height) {
        this._width = width;
        this._height = height;

        this._tanks = [];

        this._obstacles = Generator.init_map();

    }

    update() {
        // for all tank recalculate
        // bullets
    }

    createTank() {
        // let id = generator();
        // return id;
    }

    currentState() {
        return "game state";
    }
}

module.exports = Game;
