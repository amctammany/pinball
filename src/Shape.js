import Vector from "./Vector";

class Shape {
  static create(props) {
    return new this(props);
  }

  constructor({
    x = 0,
    y = 0,
    type = "Shape",
    fillStyle = "red",
    strokeStyle = "black",
    position,
    vx = 0,
    vy = 0,
    ax = 0,
    ay = 0,
    mass = 0,
    restitution = 1,
    acceleration,
    keyListeners,
    name,
    pivot
  }) {
    this.name = name;
    this.pivot = pivot;
    this.type = type;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.restitution = restitution;
    this.position = new Vector(x, y);
    this.velocity = new Vector(vx, vy);
    this.acceleration = new Vector(ax, ay);
    this.mass = mass;
    this.invMass = mass ? 1 / mass : 0;
    this.keyListeners = keyListeners;
    // if (keyListeners) {
    // this.keyListeners = Object.entries(keyListeners).reduce(
    // (acc, [key, cb]) => {
    // acc[key] = src => cb(src);
    // return acc;
    // },
    // {}
    // );
    // }
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
      return overlap ? acc : true;
    }, false);
  }

  update(delta /* game */) {
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
