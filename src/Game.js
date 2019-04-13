import Shapes from "./shapes";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.renderFn = this.render.bind(this);
  }

  init({ bodies }) {
    this.bodies = bodies.map(body => Shapes[body.type].create(body));
    this.makeBorders();
    this.render();
  }

  makeBorders() {
    const borderWidth = 10;
    const { Rectangle } = Shapes;
    this.borders = [
      Rectangle.create({
        x: 0,
        y: 0,
        width: this.width,
        height: borderWidth,
        fillStyle: "black"
      }), // top
      Rectangle.create({
        x: 0,
        y: 0,
        width: borderWidth,
        height: this.height,
        fillStyle: "black"
      }), // left
      Rectangle.create({
        x: 0,
        y: this.height - borderWidth,
        width: this.width,
        height: borderWidth,
        fillStyle: "black"
      }), // bottom
      Rectangle.create({
        x: this.width - borderWidth,
        y: 0,
        width: borderWidth,
        height: this.height,
        fillStyle: "black"
      }) // right
    ];
  }

  drawBorder() {
    this.borders.forEach(border => border.draw(this.ctx));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawBodies() {
    this.bodies.forEach(body => body.draw(this.ctx));
  }

  render() {
    this.clear();
    if (this.borders) this.drawBorder();
    if (this.bodies) this.drawBodies();

    this.animFrame = window.requestAnimationFrame(this.renderFn);
  }
}

export default Game;
