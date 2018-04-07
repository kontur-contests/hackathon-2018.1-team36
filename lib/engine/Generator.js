let randomItem = require('random-item');

const Tank = require('./Tank');
const Obstacle = require('./Obstacle');

let OBSTACLE = {
    'min_size': 1,
    'size_range': 2,
    'gcd': 32,

    'percent_occupied': 0.35
};

class Generator {
    static random_obstacle() {
        let width = Math.round(Math.random() * OBSTACLE.size_range) + OBSTACLE.min_size,
            height = Math.round(Math.random() * OBSTACLE.size_range) + OBSTACLE.min_size;

        width *= 32;
        height *= 32;

        return new Obstacle(width, height, randomItem(Object.values(Obstacle.OBST_TYPES_HEALTH)));
    }

    static init_obstacles(width, height) {
        let field_square = width * height;
        let square_occupied = 0;

        let obstacles = [];
        let tries = 0;

        while (tries < 100){
            if (square_occupied / field_square >= OBSTACLE.percent_occupied) {
                break;
            }

            let obst = this.random_obstacle();
            let obst_tries = 0;

            while (obst_tries < 5) {
                // pick random point (x, y) at field
                let x = Math.random() * width,
                    y = Math.random() * height;

                // obstacle at the point violates boundaries
                if (x + obst.x > width || y + obst.y > height) {
                    break;
                }

                obst.move(x, y);

                // check intersections with placed obstacles
                let has_intersection = placed_obstacles.some(function (element, index, array) {
                    return element.has_intersection(obst);
                });

                if (!has_intersection) {
                    obstacles.push(obst);

                    square_occupied += obst.square();

                    break;
                }

                obst_tries++;
            }

            tries++;
        }

        return obstacles;
    }

    static new_tank(field_width, field_height, x, y) {
        // TODO: check if overlap with obstacles
        let tank_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        let _x = x || Math.random() * field_width;
        let _y = y || Math.random() * field_height;

        return new Tank(tank_id, _x, _y);
    }
}

module.exports = Generator;
