import Shapes from "./shapes";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.renderFn = this.render.bind(this);
    this.addEventListeners()
  }

  init({ bodies }) {
    this.bodies = bodies.map(body => Shapes[body.type].create(body));
    // this.makeBorders();
    this.render();
  }
  addEventListeners() {
    this.canvas.addEventListener('mousedown', ({offsetX: x, offsetY: y}) => {
      const shapesUnderCursor = this.bodies.filter(b => b.isPointInPath(this.ctx, x, y))
      console.log(shapesUnderCursor)
      this.shapesMoving = shapesUnderCursor
      this.dragging = {x, y}
    })
    this.canvas.addEventListener('mousemove', ({offsetX: x, offsetY: y}) => {
      if (!this.dragging) return
      const dx = x - this.dragging.x;
      const dy = y - this.dragging.y
      console.log(dx, dy)
      this.shapesMoving.forEach(s => s.move(dx, dy))

      this.dragging = {x, y}
    })

    this.canvas.addEventListener('mouseup', e => {
      this.dragging = false;
      this.shapesMoving = null
      console.log(e)
    })
  }

  addBody(...bodies) {
    bodies.forEach(body => {
      this.bodies.push(Shapes[body.type].create(body));
    });
  }

  addBodies(bodies) {
    this.bodies.push(...bodies);
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
    this.addBodies(this.borders);
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

  detectCollisions(delta) {
    this.bodies.forEach(b1 => {
      this.bodies.forEach(b2 => {
        if (b1 === b2) return;
        const mtv = b1.collidesWith(b2);
        if (mtv.overlap > 0) {
          console.log("collision");
          console.log(b1);
          console.log(b2);
        }
      });
    });
  }

  integrate(delta) {
    this.bodies.forEach(body => {
      body.update(delta);
    });
  }

  update(delta) {
    this.detectCollisions(delta);
    this.integrate(delta);
  }

  render() {
    this.clear();
    this.update(0.01);
    // if (this.borders) this.drawBorder();
    if (this.bodies) this.drawBodies();

    this.animFrame = window.requestAnimationFrame(this.renderFn);
  }
}

export default Game;
