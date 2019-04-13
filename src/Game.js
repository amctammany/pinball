class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.renderFn = this.render.bind(this);

    this.bodies = [];
  }

  init() {
    this.render();
  }

  drawBorder() {
    const borderWidth = 10;
    const { ctx } = this;

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, this.width, borderWidth); // Top
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.width - borderWidth, 0, borderWidth, this.height); // Right
    ctx.fillStyle = "red";
    ctx.fillRect(0, this.height - borderWidth, this.width, borderWidth); // Bottom
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, borderWidth, this.height); // Left
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  render() {
    this.clear();
    this.drawBorder();

    this.animFrame = window.requestAnimationFrame(this.renderFn);
  }
}

export default Game;
