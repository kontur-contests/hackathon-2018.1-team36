let deepcopy = require("deepcopy");

let TANK_PARAMS = {
    'width': 100,
    'height': 100,
    'gun_len': 10,
};

let TANK_PARTS = {
    'gun': {
        'health': 15,
        'ammunition': 10,
        'bullet_speed': 5,
        'bullet_dist': 100
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

    is_not_broken(part){
        return part['health'] > 0;
    }

    // Logice here

    fire(){
        let gun = this.part('gun');

        if (this.is_not_broken(gun)){
            gun['ammunition'] -= 1;
        }
    }

    hurt(tank_part_str, damage){
        let part = this.part(tank_part_str);

        part['health'] = Number.max(0, part['health'] - damage);
    }

}
