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
        'speed': 10
    },

    'right_track': {
        'health': 10,
        'speed': 10
    }
};

class Tank {
    constructor(x, y) {
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

    gun(){
        return this.tank_parts['gun'];
    }

    tower(){
        return this.tank_parts['tower'];
    }

    left_track(){
        return this.tank_parts['left_track'];
    }

    right_track(){
        return this.tank_parts['right_track'];
    }

    part(part_str){
        return this.tank_parts[part_str];
    }

    // Service methods

    is_not_part_broken(part){
        return part['health'] > 0;
    }

    is_part_broken(part){
        return part['health'] <= 0;
    }

    // Logic here

    fire(){
        let gun = this.part('gun');

        if (this.is_not_part_broken(gun) && gun['ammunition'] > 0){
            gun['ammunition'] -= 1;

            return true;
        }

        return false;
    }

    hurt(tank_part_str, damage){
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

    is_corrupted(){
        return this.health > 0;
    }

}

module.exports = Tank;
