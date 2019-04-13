import Shape from "../Shape";
import Point from "./Point";

class Polygon extends Shape {
  constructor(props) {
    super(props);

    this.points = props.points;
  }

  addPoint({ x, y }) {
    this.points.push(new Point({ x, y }));
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
    this.points = this.points.map(pt => pt.move(dx, dy));
  }
}

export default Polygon;
