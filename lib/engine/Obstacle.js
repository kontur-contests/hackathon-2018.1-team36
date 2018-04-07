let TYPE_HEALTH = {
    'strong': 30,
    'weak': 15
};
class Obstacle{
    _x;
    _y;
    _width;
    _height;
    constructor(x, y, width, height, type){
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this.health = TYPE_HEALTH[type];
    }

    is_destroyed(){
        return this.health <= 0;
    }

    hurt(damage){
        this.health = Number.max(0, this.health - damage);
    }
}