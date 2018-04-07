const Generator = require('./Generator.js');
const HashMap = require('hashmap');
const utils = require('./utils');
const config = require('./config');

class Game {
    constructor() {
        this._width = config.GAME_PARAMS['width'];
        this._height = config.GAME_PARAMS['height'];

        this._tanks = new HashMap();

        this._obstacles = Generator.init_obstacles(this._width, this._height);

        this._bullets = [];
    }

    update(dt) {
        let self = this;
        this._bullets = this._bullets.filter(b => !b.is_expired());
        this._bullets.forEach(b => b.move(dt));

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

            self._bullets.forEach(b => {
                if (utils.isHit(tank, b)) {
                    b.hitted = true;
                    tank.hurt('tank', b.damage, b.owner);
                }
            });

            // then - move
            tank.move(dt);
            tank.x = Math.min(tank.x, self.width);
            tank.y = Math.min(tank.y, self.height);
            tank.x = Math.max(tank.x, 0);
            tank.y = Math.max(tank.y, 0);

        });
    }

    createTank(x, y) {
        let tank = Generator.new_tank(this._width, this._height, x, y);

        this._tanks.set(tank.tank_id, tank);

        return tank.tank_id;
    }

    currentState() {
        return {
            'tanks': this._tanks.values().map(tank => (
                {
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
                        angle: tank.angle
                    },
                    health: tank.health,
                    frags: tank.frags
                }
            )),
            'bullets': this._bullets.map(b => ({ x: b.x, y: b.y })),
            'obstacles': this._obstacles
        };
    }

    getTank(id) {
        return this._tanks.get(id);
    }
}

module.exports = Game;
