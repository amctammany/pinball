import { isObject } from "./utility";

export default class Vec2 {
  static random(...range) {
    const min = Math.min(...range);
    const max = Math.max(...range);
    return new this({
      x: Math.random() * (max - min + 1) + min,
      y: Math.random() * (max - min + 1) + min
    });
  }

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

  rotate(pivot, angle) {
    const cA = Math.cos(angle);
    const sA = Math.sin(angle);
    const x = this.x - pivot.x;
    const y = this.y - pivot.y;

    return new Vec2(x * cA - y * sA + pivot.x, y * cA + x * sA + pivot.y);
  }
}
