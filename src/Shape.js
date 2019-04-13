import Vector from "./Vector";

export function polygonCollidesWithPolygon(p1, p2, displacement) {
  const mtv1 = getMTV(p1, p2, displacement, p1.getAxes());
  const mtv2 = getMTV(p1, p2, displacement, p2.getAxes());
  // var mtv1 = p1.minimumTranslationVector(p1.getAxes(), p2, displacement),
  // mtv2 = p1.minimumTranslationVector(p2.getAxes(), p2, displacement);

  if (mtv1.overlap === 0 || mtv2.overlap === 0)
    return { axis: undefined, overlap: 0 };
  return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2;
}

function getMTV(shape1, shape2, displacement = 0, axes) {
  return axes.reduce(
    ({ axis, overlap }, ax) => {
      const proj1 = shape1.project(ax);
      const proj2 = shape2.project(ax);
      const p12overlap = proj1.getOverlap(proj2);

      if (p12overlap === 0) {
        return { axis: undefined, overlap: p12overlap };
      }
      if (p12overlap < overlap) {
        return { axis: ax, overlap: p12overlap };
      }
      return { axis, overlap };
    },
    { axis: undefined, overlap: 999999 }
  );
}
export function polygonCollidesWithCircle(polygon, circle) {
  const closest = getPolygonPointClosestToPoint(polygon, circle.position);
  const axes = polygon.getAxes();
  axes.push(circle.position.subtract(closest).normalize());
  return !polygon.seperationOnAxes(axes, circle);
}

export function checkProjectionOverlap(p1, p2) {
  if (!(p1.max > p2.min && p2.max > p1.min)) {
    return 0;
  }
  let overlap;
  if (p1.max > p2.max) {
    overlap = p2.max - p1.min;
  } else {
    overlap = p1.max - p2.min;
  }
  return overlap;
}
export function getPolygonPointClosestToPoint(polygon, point) {
  let min = 9999;
  let closest;
  for (let i = 0; i < polygon.points.length; ++i) {
    const pt = polygon.points[i];
    const length = Math.sqrt(
      Math.pow(pt.x - point.x, 2),
      Math.pow(pt.y - point.y, 2)
    );
    if (length < min) {
      min = length;
      closest = pt;
    }
  }
  return closest;
}

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

  update(delta, game) {
    const { x, y } = this.velocity.multiply(delta);
    this.move(x, y);
    this.velocity = this.velocity.add(this.acceleration.multiply(delta));
    // this.position.x += this.velocity.x * delta
    // this.position.y += this.velocity.y * delta
    // this.velocity.x += this.acceleration.x * delta
    // this.velocity.y += this.acceleration.y * delta

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

  seperationOnAxes(axes, pt) {
    return axes.reduce((acc, axis) => {
      const projection1 = pt.project(axis);
      const projection2 = this.project(axis);
      const overlap = checkProjectionOverlap(projection1, projection2);
      return overlap ? acc : true;
    }, false);
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
