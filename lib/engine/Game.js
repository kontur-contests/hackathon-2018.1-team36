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
        let self = this;

        this._tanks.forEach(function (tank, tank_id) {
            if (tank.canPlay() && !tank.in_game) {
                tank.in_game = true;
            }
            if (!tank.in_game) return;

            // first - fire!
            if (tank.is_fire) {
                const bullet = tank.fire();
                if (bullet) {
                    self._bullets.push(bullet);
                }
            }

            // then - move
            tank.move(dt);

        });
        this._bullets.forEach(b => b.move(dt));
    }

    createTank() {
        let tank = Generator.new_tank(this._width, this._height);

        this._tanks.set(tank.tank_id, tank);

        return tank.tank_id;
    }

    currentState() {
        return {
            'tanks': this._tanks.values().map(tank => {
                return {
                    id: tank.id,
                    can_play: tank.canPlay(),
                    in_game: tank.in_game,
                    dead: tank.isDead(),
                    players: [
                        {role: 'GUN', is_playing: !tank.isGunEmpty()},
                        {role: 'TOWER', is_playing: !tank.isTurretEmpty()},
                        {role: 'LEFT_WHEEL', is_playing: !tank.isLeftTrackEmpty()},
                        {role: 'RIGHT_WHEEL', is_playing: !tank.isRightTrackEmpty()}
                    ],
                    position: {
                        x: tank.x,
                        y: tank.y,
                    }
                }
            }),
            'bullets': this._bullets,
            'obstacles': this._obstacles
        }
    }

    getTank(id) {
        return this._tanks.get(id);
    }
}

module.exports = Game;
