exports.TIME = 1000;
exports.FRAME_RATE = 1000.0 / 25.0;

exports.TANK_PARAMS = {
    'width': 32,
    'height': 32,
    'gun_len': 10,
    'health': 25,
    'angle': 0
};

exports.TANK_PARTS = {
    'gun': {
        'health': 15,
        'ammunition': 100,
        'reload_time': 100,

        'bullet_speed': 10,
        'bullet_dist': 100,
        'bullet_damage': 55,

        'is_fire': false,

        'player': null
    },

    'turret': {
        'health': 5,
        'max_speed': 0.1,
        'angle': 0,
        'speed': 0,

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

exports.GAME_PARAMS = {
    'width': 1000,
    'height': 1000
};
