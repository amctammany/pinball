class Shape {
  constructor({ fillStyle = "red", strokeStyle = "black" }) {
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
  }

  createPath(ctx) {
    throw "createPath(ctx) not implemented";
  }

  move(dx, dy) {
    throw "move(ctx) not implemented";
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
