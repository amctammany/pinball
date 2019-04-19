import Shapes from "./shapes";
import Vector from "./Vector";
import { checkMTVAxisDirection, resolveCollision } from "./Collisions";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.renderFn = this.render.bind(this);
    this.addEventListeners();
    this.paused = false;

  }

  init({ bodies }) {
    this.bodies = bodies.map(body => {
      const b = Shapes[body.type].create(body);
      b.velocity = Vector.random(-480, 480);

      return b;
    });
    // this.makeBorders();
    this.render();
  }

  addEventListeners() {
    this.canvas.addEventListener("mousedown", ({ offsetX: x, offsetY: y }) => {
      const shapesUnderCursor = this.bodies.filter(b =>
        b.isPointInPath(this.ctx, x, y)
      );
      this.shapesMoving = shapesUnderCursor;
      this.dragging = { x, y };
    });
    this.canvas.addEventListener("mousemove", ({ offsetX: x, offsetY: y }) => {
      if (!this.dragging) return;
      const dx = x - this.dragging.x;
      const dy = y - this.dragging.y;
      this.shapesMoving.forEach(s => s.moveTo(x, y));

      this.dragging = { x, y };
    });

    this.canvas.addEventListener("mouseup", e => {
      this.dragging = false;
      this.shapesMoving = null;
    });
  }

  addBody(...bodies) {
    bodies.forEach(body => {
      this.bodies.push(Shapes[body.type].create(body));
    });
  }

  addBodies(bodies) {
    this.bodies.push(...bodies);
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
        const collision = b1.collidesWith(b2);
        if (collision.axis || collision.overlap > 0) {
        const mtv = checkMTVAxisDirection(collision, b1, b2);
          return resolveCollision(mtv, b1, b2)
          const vN = b1.velocity.normalize();
          const vM = b1.velocity.getMagnitude();

          const perpendicular = mtv.axis.perpendicular();
            //? mtv.axis.perpendicular()
            //: new Vector(vN.y * -1, vN.x);
          const vdotl = vN.dot(perpendicular);
          const ldotl = perpendicular.dot(perpendicular);
          const ratio = vdotl / ldotl;

          const newV = new Vector(
            2 * ratio * perpendicular.x - vN.x,
            2 * ratio * perpendicular.y - vN.y
          );
          b1.velocity = newV.multiply(vM * -1.0);
          b2.velocity = newV.multiply(vM * 1.0);
        }
      });
    });
  }

  integrate(delta) {
    this.bodies.forEach(body => {
      body.update(delta);
    });
  }

  detectBoundaries(delta) {
    this.bodies.forEach(body => {
      const { x, y } = body.centroid();
      if (x < 0 || x > this.width) body.velocity.x *= -1;
      if (y < 0 || y > this.height) body.velocity.y *= -1;
    });
  }

  update(delta) {
    this.detectBoundaries(delta);
    this.detectCollisions(delta);
    this.integrate(delta);
  }

  toggle() {
    this.paused = !this.paused;
  }
  render() {
    if (this.paused) return window.setTimeout(this.renderFn, 200)
    this.clear();
    this.update(0.01);
    // if (this.borders) this.drawBorder();
    if (this.bodies) this.drawBodies();

    this.animFrame = window.requestAnimationFrame(this.renderFn);
  }
}

export default Game;
