class Bullet {
    constructor(x, y, angle, speed, max_dist, damage) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.max_dist = max_dist;

        this.curr_dist = 0;
    }

    move(dt) {
        const dx = this.speed * dt * Math.cos(this.angle);
        const dy = this.speed * dt * Math.sin(this.angle);
        this.x += dx;
        this.y += dy;

        this.curr_dist += Math.sqrt(dx ** 2 + dy ** 2);
    }

    is_expired(){
        return this.curr_dist < this.max_dist;
    }
}

module.exports = exports = Bullet;
