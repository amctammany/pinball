import Shape from "../Shape";

class Circle extends Shape {
  constructor(props) {
    super(props);

    this.x = props.x;
    this.y = props.y;
    this.radius = props.radius;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  createPath(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  }
}

export default Circle;
