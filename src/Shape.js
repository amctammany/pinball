import Vector from "./Vector";

class Shape {
  static create(props) {
    return new this(props);
  }

  constructor({
    x = 0,
    y = 0,
    fillStyle = "red",
    strokeStyle = "black",
    position,
    velocity,
    acceleration
  }) {
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.position = new Vector(x, y);
    this.velocity = new Vector(velocity);
    this.acceleration = new Vector(acceleration);
  }

  isPointInPath(ctx, x, y) {
    this.createPath(ctx);
    return ctx.isPointInPath(x, y);
  }

  seperationOnAxes(axes, pt) {
    return axes.reduce((acc, axis) => {
      const projection1 = pt.project(axis);
      const projection2 = this.project(axis);
      const overlap = projection1.getOverlap(projection2);
      console.log(overlap)
      return overlap ? acc : true;
    }, false);
  }

  update(delta, game) {
    const { x, y } = this.velocity.multiply(delta);
    this.move(x, y);
    this.velocity = this.velocity.add(this.acceleration.multiply(delta));
    this.acceleration = new Vector(0, 0);
  }

  // eslint-disable-next-line class-methods-use-this
  createPath(/* ctx */) {
    throw new Error("createPath(ctx) not implemented");
  }

  // eslint-disable-next-line class-methods-use-this
  move(/* dx, dy */) {
    throw new Error("move(dx, dy) not implemented");
  }

  // eslint-disable-next-line class-methods-use-this
  collidesWith(/* shape, */) {
    throw new Error("collidesWith(shape) not implemented");
  }

  // eslint-disable-next-line class-methods-use-this
  getAxes(/* axis */) {
    throw new Error("getAxes() not implemented");
  }

  // eslint-disable-next-line class-methods-use-this
  project(/* axis */) {
    throw new Error("project(axis) not implemented");
  }

  draw(ctx) {
    this.fill(ctx);
    this.stroke(ctx);
  }

  fill(ctx) {
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    this.createPath(ctx);
    ctx.fill();
    ctx.restore();
  }

  stroke(ctx) {
    ctx.save();
    ctx.strokeStyle = this.strokeStyle;
    this.createPath(ctx);
    ctx.stroke();
    ctx.restore();
  }
}

export default Shape;
