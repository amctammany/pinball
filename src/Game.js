import Rectangle from "./shapes/Rectangle";
import Circle from "./shapes/Circle";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.renderFn = this.render.bind(this);

    const borderWidth = 10;
    this.borders = [
      new Rectangle({
        x: 0,
        y: 0,
        width: this.width,
        height: borderWidth,
        fillStyle: "black"
      }), // top
      new Rectangle({
        x: 0,
        y: 0,
        width: borderWidth,
        height: this.height,
        fillStyle: "black"
      }), // left
      new Rectangle({
        x: 0,
        y: this.height - borderWidth,
        width: this.width,
        height: borderWidth,
        fillStyle: "black"
      }), // bottom
      new Rectangle({
        x: this.width - borderWidth,
        y: 0,
        width: borderWidth,
        height: this.height,
        fillStyle: "black"
      }) // right
    ];

    this.bodies = [
      new Rectangle({
        x: 100,
        y: 50,
        width: 40,
        height: 50,
        fillStyle: "green"
      }),
      new Rectangle({
        x: 400,
        y: 150,
        width: 20,
        height: 80,
        fillStyle: "red"
      }),
      new Rectangle({
        x: 200,
        y: 250,
        width: 30,
        height: 20,
        fillStyle: "blue"
      }),
      new Rectangle({
        x: 190,
        y: 200,
        width: 20,
        height: 20,
        fillStyle: "yellow"
      }),

      new Circle({
        x: 50,
        y: 80,
        radius: 10,
        fillStyle: "blue"
      }),
      new Circle({
        x: 150,
        y: 380,
        radius: 20,
        fillStyle: "green"
      }),
      new Circle({
        x: 350,
        y: 280,
        radius: 30,
        fillStyle: "red"
      })
    ];
  }

  init() {
    this.render();
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
    this.drawBorder();
    this.drawBodies();

    this.animFrame = window.requestAnimationFrame(this.renderFn);
  }
}

export default Game;
