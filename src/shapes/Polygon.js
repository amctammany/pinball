import Vector from "../Vector";
import Shape, {
  getPolygonPointClosestToPoint,
  polygonCollidesWithCircle,
  polygonCollidesWithPolygon
} from "../Shape";
import Projection from "./Projection";

class Polygon extends Shape {
  constructor(props) {
    super(props);

    this.points = props.points.map(p => new Vector(p));
  }

  addPoint({ x, y }) {
    this.points.push(new Vector({ x, y }));
  }

  getAxes() {
    return this.points.map((p, i) =>
      this.points[i + 1 === this.points.length ? 0 : i + 1].subtract(p).normal()
    );
  }

  project(axis) {
    const scalars = this.points.map(p => p.dot(axis));
    return Projection.create({
      min: Math.min(...scalars),
      max: Math.max(...scalars)
    });
  }

  collidesWith(other) {
    return other.radius === undefined
      ? polygonCollidesWithPolygon(this, other)
      : polygonCollidesWithCircle(this, other);
  }

  createPath(ctx) {
    ctx.beginPath();
    this.points.forEach(({ x, y }, i) => {
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
  }

  move(dx, dy) {
    this.points = this.points.map(pt => pt.add(dx, dy));
  }
}

export default Polygon;
