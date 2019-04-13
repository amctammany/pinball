const isObject = o => o === Object(o);

export default class Vec2 {
  constructor(v = 0, y = 0) {
    this.x = isObject(v) ? v.x : v;
    this.y = isObject(v) ? v.y : y;
  }

  add(x, y) {
    const v = new Vec2(this.x, this.y);
    v.x += isObject(x) ? x.x : x;
    v.y += isObject(x) ? x.y : y;
    return v;
  }

  subtract(x, y) {
    const v = new Vec2(this.x, this.y);
    v.x -= isObject(x) ? x.x : x;
    v.y -= isObject(x) ? x.y : y;
    return v;
  }

  multiply(s) {
    const v = new Vec2(this.x, this.y);
    v.x *= s;
    v.y *= s;
    return v;
  }

  divide(s) {
    const v = new Vec2(this.x, this.y);
    if (s === 0) throw new Error("Cannot divide by zero.");
    v.x /= s;
    v.y /= s;
    return v;
  }

  getMagnitude() {
    // eslint-disable-next-line no-mixed-operators
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  perpendicular() {
    return new Vec2(this.y, 0 - this.x);
  }

  normalize() {
    const m = this.getMagnitude();
    if (m !== 0) {
      return new Vec2(this.x / m, this.y / m);
    }
    return new Vec2();
  }

  normal() {
    return this.perpendicular().normalize();
  }
}
