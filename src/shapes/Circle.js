import Shape from "../Shape";
import {
  circleCollidesWithCircle,
  polygonCollidesWithCircle
} from "../Collisions";

import Projection from "./Projection";
import Vector from "../Vector";

class Circle extends Shape {
  constructor(props) {
    super(props);

    this.radius = props.radius;
  }

  centroid() {
    return this.position;
  }
  getPosition() { return this.position }

  project(axis) {
    const dot = this.position.dot(axis);
    const scalars = [dot, dot + this.radius, dot - this.radius];
    return Projection.create({
      min: Math.min(...scalars),
      max: Math.max(...scalars)
    });
  }

  collidesWith(other, displacement) {
    return other.radius === undefined
      ? polygonCollidesWithCircle(other, this, displacement)
      : circleCollidesWithCircle(this, other, displacement);
  }

  move(dx, dy) {
    this.position = this.position.add(dx, dy);
  }

  moveTo(x, y) {
    this.position = new Vector(x, y);
  }

  createPath(ctx) {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
  }
}

export default Circle;
