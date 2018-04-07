class Bullet {
    constructor(x, y, angle, speed) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
    }

    move(dt) {
        const dx = this.speed * dt * Math.cos(this.angle);
        const dy = this.speed * dt * Math.sin(this.angle);
        this.x += dx;
        this.y += dy;
    }
}

module.exports = exports = Bullet;
