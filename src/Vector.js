class Vector {
  constructor(v, y) {
    this.x = isObject(v) ? v.x : v;
    this.y = isObject(v) ? v.y : y;
  }

  zero() {
    this.x = 0;
    this.y = 0;
    return this;
  }

  getMagnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  setMagnitude(m) {
    const uv = this.normalize();
    this.x = uv.x * m;
    this.y = uv.y * m;
    return this;
  }

  multiply(s) {
    return new Vector(this.x * s, this.y * s);
  }

  imultiply(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  iadd(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  isubtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  normalize() {
    const m = this.getMagnitude();
    return new Vector(this.x / m, this.y / m);
  }

  perpendicular() {
    const v = new Vector();
    v.x = this.y;
    v.y = 0 - this.x;
    return v;
  }

  reflect(axis) {
    var dotProductRatio;
    var vdotl;
    var ldotl;
    const v = new Vector();
    var vdotl = this.dot(axis);
    var ldotl = axis.dot(axis);
    var dotProductRatio = vdotl / ldotl;

    v.x = 2 * dotProductRatio * axis.x - this.x;
    v.y = 2 * dotProductRatio * axis.y - this.y;

    return v;
  }
}

module.exports = Vector;