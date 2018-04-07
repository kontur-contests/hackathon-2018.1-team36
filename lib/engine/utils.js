exports.isHit = (tank, bullet) => {
    if (tank === bullet.owner) return false;
    const a = tank.angle;
    const w = tank.width;
    const h = tank.height;
    const local_x = tank.x - bullet.x;
    const local_y = tank.y - bullet.y;
    const x = local_x * Math.cos(a) - local_y * Math.sin(a);
    const y = local_x * Math.sin(a) + local_y * Math.cos(a);

    return (Math.abs(x) <= w) && (Math.abs(y) <= h);
};
