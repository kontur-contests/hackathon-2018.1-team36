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
        'bullet_damage': 15
    },

    'tower': {
        'health': 5,
        'rotate_speed': 10,
        'relative_angle': 0
    },

    'left_track': {
        'health': 10,
        'max_speed': 10,
        'speed': 0
    },

    'right_track': {
        'health': 10,
        'max_speed': 10,
        'speed': 0
    }
};

class Tank {
    constructor(x, y, id) {
        this.id = id;
        this.x = x;
        this.y = y;

        // alpha (absolute tank angle)
        this.angle = Math.random() * 2 * Math.PI;

        this.width = TANK_PARAMS['width'];
        this.height = TANK_PARAMS['height'];

        this.gun_length = TANK_PARAMS['gun_length'];

        this.health = TANK_PARAMS['health'];
        this.tank_parts = deepcopy(TANK_PARTS);
    }

    // Getters

    gun() {
        return this.tank_parts['gun'];
    }

    tower() {
        return this.tank_parts['tower'];
    }

    left_track() {
        return this.tank_parts['left_track'];
    }

    get l_track_speed() {
        return this.tank_parts.left_track.speed;
    }

    right_track() {
        return this.tank_parts['right_track'];
    }

    get r_track_speed() {
        return this.tank_parts.right_track.speed;
    }

    part(part_str) {
        return this.tank_parts[part_str];
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

    // Player actions
    leftTrack(accelerate) {
        this.tank_parts.left_track.speed =
            this.tank_parts.left_track.max_speed * accelerate;
    }

    rightTrack(accelerate) {
        this.tank_parts.right_track.speed =
            this.tank_parts.right_track.max_speed * accelerate;
    }

    // Service methods

    is_not_part_broken(part) {
        return part['health'] > 0;
    }

    is_part_broken(part) {
        return part['health'] <= 0;
    }

    // Logic here

    fire() {
        let gun = this.part('gun');

        if (this.is_not_part_broken(gun) && gun['ammunition'] > 0){
            gun['ammunition'] -= 1;

            return true;
        }

        return false;
    }

    hurt(tank_part_str, damage) {
        if (this.is_part_broken(part) || tank_part_str === 'tank'){
            // all damage to main health
            this.health = Number.max(0, this.health - damage);

        }
        else {
            let new_part_health = part['health'] - damage;

            if (new_part_health < 0){
                // part is fully destroyed, spend rest of the damage to the main health

                part['health'] = 0;

                this.health = Number.max(0, this.health + new_part_health);

            }
            else {
                part['health'] = new_part_health;
            }
        }

    }

    is_corrupted() {
        return this.health > 0;
    }

    // public methods
    joinTurret(player){}
    joinLeftTrack(player){}
    joinRightTrack(player){}
    joinGun(player){}
    isTurretEmpty(){}
    isLeftTrackEmpty(){}
    isRightTrackEmpty(){}
    isGunEmpty(){}

    fireGun() {} // ouch!
    leftTrack(accelerate) {} // -1, 0, 1
    rightTrack(accelerate) {} // -1, 0, 1
    turret(accelerate) {} // -1, 0, 1

    die() {
        // foreach players in tank call player.leaveTank(this)
    }

    getFrags() {
        // return number of killed tanks
    }
}

module.exports = Tank;
