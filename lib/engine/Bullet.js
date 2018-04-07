class Bullet {
    constructor(owner, x, y, angle, speed, max_dist, damage) {
        this.id = Math.random().toString(18).substring(2, 15);
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.max_dist = max_dist;
        this.curr_dist = 0;
        this.hitted = false;
    }

    move(dt) {
        const dx = this.speed * dt * Math.cos(this.angle);
        const dy = this.speed * dt * Math.sin(this.angle);
        this.x += dx;
        this.y += dy;

        this.curr_dist += Math.sqrt(dx ** 2 + dy ** 2);
    }

    is_expired() {
        return this.hitted || this.curr_dist > this.max_dist;
    }

}

module.exports = exports = Bullet;
