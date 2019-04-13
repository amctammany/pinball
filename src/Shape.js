class Shape {
  constructor({ fillStyle = "red", strokeStyle = "black" }) {
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
  }

  // eslint-disable-next-line class-methods-use-this
  createPath(/* ctx */) {
    throw new Error("createPath(ctx) not implemented");
  }

  // eslint-disable-next-line class-methods-use-this
  move(/* dx, dy */) {
    throw new Error("move(dx, dy) not implemented");
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
