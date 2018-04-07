let randomItem = require('random-item');

let OBSTACLE = {
    'min_width': 2,
    'width_range': 8,

    'min_height': 2,
    'height_range': 8,

    'percent_occupied': 0.2
};

class Generator {
    static random_obstacle(){
        let width = Math.random() * OBSTACLE['width_range'] + OBSTACLE['min_width'];
        let height = Math.random() * OBSTACLE['height_range'] + OBSTACLE['min_height'];

        return Obstacle(width, height, randomItem(OBST_TYPES_HEALTH));
    }

    static init_obstacles(width, height){
        // init obstacles first

        let field_square = width * height;
        let square_occupied = 0;

        let obstacles = [];

        while (true){
            let obst = this.random_obstacle();

            square_occupied += obst.square();

            if (square_occupied / field_square >= OBSTACLE['percent_occupied']){
                break;
            }

            obstacles.push(obst);
        }

        // move obstacles

        let placed_obstacles = [];

        for (let obst in obstacles){
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
                let has_intersection = placed_obstacles.some(function(element, index, array){
                    return element.has_intersection(obst);
                });

                if (has_intersection){
                    obst.move(0, 0);

                } else {
                    placed_obstacles.push(obst);
                    break;
                }

                tries++;
            }
        }

        // return placed obstacles
        return placed_obstacles;
    }

}
module.exports = Generator;
