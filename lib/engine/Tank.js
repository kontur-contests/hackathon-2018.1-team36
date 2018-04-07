let deepcopy = require("deepcopy");

let TANK_PARTS = {
    'gun': {
        'health': 15,
        'ammunition': 10
    },

    'tower': {
        'health': 5,
        'rotate_speed': 10
    },

    'left_track': {
        'health': 10
    },

    'right_track': {
        'health': 10
    }
};

class Tank {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.tank_parts = deepcopy(TANK_PARTS);

        // this.gun = deepcopy(objects['gun']);
        //
        // this.tower = deepcopy(objects['tower']);
        //
        // this.left_track = deepcopy(objects['track']);
        // this.right_track = deepcopy(objects['track']);
    }

    is_not_broken(part){
        return this.tank_parts[part]['health'] > 0;
    }

    fire(){
        if (this.is_not_broken(this.gun)){
            this.gun['ammunition'] -= 1;
        }
    }

    hurt(tank_part, damage){
        health = this.tank_parts[tank_part]['health'];

        this.tank_parts[tank_part]['health'] = Number.max(0, health - damage);
    }

}
