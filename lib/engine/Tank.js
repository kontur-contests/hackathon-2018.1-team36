let deepcopy = require("deepcopy");

let TANK_PARAMS = {
    'width': 100,
    'height': 100,
    'gun_len': 10,
    'health': 25
};

let TANK_PARTS = {
    'gun': {
        'health': 15,
        'ammunition': 10,

        'bullet_speed': 5,
        'bullet_dist': 100,
        'bullet_damage': 15,

        'player': null
    },

    'turret': {
        'health': 5,
        'rotate_speed': 10,
        'relative_angle': 0,

        'player': null
    },

    'left_track': {
        'health': 10,
        'max_speed': 10,
        'speed': 0,

        'player': null
    },

    'right_track': {
        'health': 10,
        'max_speed': 10,
        'speed': 0,

        'player': null
    }
};

class Tank {
    constructor(x, y, id) {
        this.id = id;
        this.frags = 0;

        this.x = x;
        this.y = y;

        // alpha (absolute tank angle)
        this.angle = Math.random() * 2 * Math.PI;

        this.width = TANK_PARAMS['width'];
        this.height = TANK_PARAMS['height'];

        this.gun_length = TANK_PARAMS['gun_length'];

        this.health = TANK_PARAMS['health'];

        this.gun = deepcopy(TANK_PARTS.gun);
        this.turret = deepcopy(TANK_PARTS.turret);
        this.left_track = deepcopy(TANK_PARTS.left_track);
        this.right_track = deepcopy(TANK_PARTS.right_track);

    }

    // Getters

    get tank_id() {
        return this.id;
    }

    get l_track_speed() {
        return this.left_track.speed;
    }

    get r_track_speed() {
        return this.right_track.speed;
    }

    // Physics
    move(dt) {
        const alpha = this.angle;
        const l = this.width;

        const v1 = this.l_track_speed;
        const v2 = this.r_track_speed;
        const w = (v1 - v2) / l;
        const v = (v1 + v2) / 2;

        let dx = 0, dy = 0;

        if (w === 0) {
            dx = v * dt * Math.cos(alpha);
            dy = v * dt * Math.sin(alpha);
        } else {
            const beta = alpha - w * dt;
            const R = l / 2 * ((v1 + v2) / (v1 - v2));
            dx = R * (Math.cos(alpha) - Math.cos(beta));
            dy = R * (Math.sin(alpha) - Math.sin(beta));
        }

        this.x += dx;
        this.y += dy;
    }

    // Service methods

    is_not_part_broken(part) {
        return part.health > 0;
    }

    is_part_broken(part) {
        return part.health <= 0;
    }

    // Logic here

    fire() {
        if (this.is_not_part_broken(this.gun) && this.gun.ammunition > 0) {
            this.gun.ammunition -= 1;

            return true;
        }

        return false;
    }

    die() {
        this.gun.player.leaveTank(this);
        delete this.gun.player;

        this.turret.player.leaveTank(this);
        delete this.turret.player;

        this.left_track.player.leaveTank(this);
        delete this.left_track.player;

        this.right_track.player.leaveTank(this);
        delete this.right_track.player;

    }

    /**
     * Cause damage of the given tank part
     *
     * @param tank_part_str - provide 'tank' to hurt some tank part or 'tank' to hurt tank itself
     * @param damage - int value
     *
     * @returns {*}
     */
    hurt(tank_part_str, damage) {
        if (tank_part_str === 'tank' || this.is_part_broken(this[tank_part_str])) {
            // all damage to main health
            this.health = Number.max(0, this.health - damage);

        }
        else {
            // damage to tank part
            let part = this[tank_part_str];

            let new_part_health = part['health'] - damage;

            if (new_part_health < 0) {
                // part is fully destroyed after given damage - spend rest of the damage to the main health

                part['health'] = 0;

                this.health = Number.max(0, this.health + new_part_health);

            }
            else {
                part['health'] = new_part_health;
            }
        }

        // die if health of the tank is empty after the damage
        if (this.is_health_empty()) {
            this.die();
        }
    }

    is_health_empty() {
        return this.health <= 0;
    }

    // public methods

    joinTurret(player) {
        return this.turret.player = player;
    }

    joinLeftTrack(player) {
        return this.left_track.player = player;
    }

    joinRightTrack(player) {
        return this.right_track.player = player;
    }

    joinGun(player) {
        return this.gun.player = player;
    }

    isTurretEmpty() {
        return this.turret.player == null;
    }

    isLeftTrackEmpty() {
        return this.left_track.player == null;
    }

    isRightTrackEmpty() {
        return this.right_track.player == null;
    }

    isGunEmpty() {
        return this.gun.player == null;
    }

    setLeftTrackMoving(accelerate) {
        this.left_track.speed = this.left_track.max_speed * accelerate;
    }

    setRightTrackMoving(accelerate) {
        this.right_track.speed = this.right_track.max_speed * accelerate;
    }

    setTurretMoving(accelerate) {
        this.turret.speed = this.turret.max_speed * accelerate;
    }

    getFrags() {
        return this.frags;
        // TODO:
        // return number of killed tanks
    }

    setFire(accelerate) {
        // 1, 0
    }
}

module.exports = Tank;
