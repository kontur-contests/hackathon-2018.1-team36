let OBST_TYPES_HEALTH = {
    'strong': 30,
    'weak': 15
};

class Obstacle{
    _x;
    _y;
    _width;
    _height;
    constructor(width, height, type){
        this._x = 0;
        this._y = 0;
        this._width = width;
        this._height = height;

        this.health = OBST_TYPES_HEALTH[type];
    }

    square(){
        return this._width * this._height;
    }

    move(x, y){
        this._x = x;
        this._y = y;
    }

    has_intersection(other){
        let has_on_x = this._x <= other.x <= this._x + this._width || this._x <= other.x + other.width <= this._x + this._width;
        let has_on_y = this._y <= other.y <= this._y + this._height|| this._y <= other.y + other.height <= this._y + this._height;

        return has_on_x || has_on_y
    }

    is_destroyed(){
        return this.health <= 0;
    }

    hurt(damage){
        this.health = Number.max(0, this.health - damage);
    }
}