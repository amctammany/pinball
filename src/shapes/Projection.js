class Projection {
  static create({ min, max }) {
    return new this(min, max);
  }

  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  overlaps(proj) {
    return this.max > proj.min && proj.max > this.min;
  }

  getOverlap(proj) {
    if (!this.overlaps(proj)) return 0;
    if (this.max > proj.max) {
      return proj.max - this.min;
    }
    return this.max - proj.min;
  }
}

export default Projection;
