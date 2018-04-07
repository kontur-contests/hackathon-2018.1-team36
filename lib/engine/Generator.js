let randomItem = require('random-item');

const Tank = require('./Tank');
const Obstacle = require('./Obstacle');

let OBSTACLE = {
    'min_width': 2,
    'width_range': 8,

    'min_height': 2,
    'height_range': 8,

    'percent_occupied': 0.2
};

class Generator {
    static random_obstacle() {
        let width = Math.random() * OBSTACLE['width_range'] + OBSTACLE['min_width'];
        let height = Math.random() * OBSTACLE['height_range'] + OBSTACLE['min_height'];

        width *= 32;
        height *= 32;

        return new Obstacle(width, height, randomItem(Object.values(Obstacle.OBST_TYPES_HEALTH)));
    }

    static init_obstacles(width, height) {
        // init obstacles first

        let field_square = width * height;
        let square_occupied = 0;

        let obstacles = [];

        let tries = 0;

        while (tries < 10) {
            let obst = this.random_obstacle();

            square_occupied += obst.square();

            if (square_occupied / field_square >= OBSTACLE['percent_occupied']) {
                break;
            }

            obstacles.push(obst);

            tries++;
        }

        // move obstacles

        let placed_obstacles = [];

        for (let obst of obstacles) {
            // try to put obstacle to field

            let tries = 0;

            while (tries < 5) {
                // pick random point (x, y) at field
                let x = Math.random() * width,
                    y = Math.random() * height;

                // obstacle at the point violates boundaries
                if (x + obst.x > width || y + obst.y > height) {
                    continue;
                }

                obst.move(x, y);

                // check intersections with placed obstacles
                let has_intersection = placed_obstacles.some(function (element, index, array) {
                    return element.has_intersection(obst);
                });

                if (has_intersection) {
                    obst.move(0, 0);

                } else {
                    placed_obstacles.push(obst);
                    break;
                }

                tries++;
            }
        }

        return placed_obstacles;
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
