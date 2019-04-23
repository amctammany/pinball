import Shapes from "./shapes";
import Animation from "./Animation";
import Vector from "./Vector";
import { checkMTVAxisDirection, resolveCollision } from "./Collisions";
import { isFunction } from "./utility";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.renderFn = this.render.bind(this);
    this.animFn = this.animate.bind(this);
    // this.addEventListeners();
    this.paused = false;
    this.keyListeners = { up: {}, down: {} };

    this.state = {};
    this.outputs = {};

    this.namedBodies = {};
    this.activeAnimations = [];

    this.removeAnim = this.removeAnimation.bind(this);
  }

  init({
    animations,
    bodies,
    buttons,
    outputs,
    inputs,
    bodyTypes,
    dome,
    keyListeners
  }) {
    this.addBodyTypes(bodyTypes);
    this.keyListeners = this.addKeyListeners(keyListeners);
    this.interactionCache = bodyTypes.reduce((acc, bt) => {
      acc[bt.type] = bt.collisionHandlers || {};
      return acc;
    }, {});
    this.bodies = bodies.map(body => {
      const b = this.createBody(body);
      // game b.velocity = Vector.random(-180, 180);

      return b;
    });
    this.addAnimations(animations);
    buttons.forEach(({ elementId, cb }) => this.registerButton(elementId, cb));
    inputs.forEach(({ elementId, stateKey, defaultValue }) =>
      this.registerInput(elementId, stateKey, defaultValue)
    );
    outputs.forEach(({ elementId, stateKey, defaultValue }) =>
      this.registerOutput(elementId, stateKey, defaultValue)
    );

    if (dome) this.addBodies(Shapes.createDomePolygons(dome));
    this.render();

    this.animInterval = window.setInterval(this.animFn, 20);
    document.body.addEventListener("keydown", e => {
      const listeners = (this.keyListeners[e.key.toUpperCase()] || {}).down;
      if (listeners) listeners.forEach(l => l(this, e));
    });
    document.body.addEventListener("keyup", e => {
      const listeners = (this.keyListeners[e.key.toUpperCase()] || {}).up;
      if (listeners) listeners.forEach(l => l(this, e));
    });
    document.body.addEventListener("keypress", e => {
      const listeners = (this.keyListeners[e.key.toUpperCase()] || {}).press;
      if (listeners) listeners.forEach(l => l(this, e));
    });
  }

  addKeyListeners(keyListeners = {}, bound) {
    return Object.entries(keyListeners).reduce((acc, [k, v]) => {
      const upperK = k.toUpperCase();
      acc[upperK] = Object.entries(v).reduce((ac, [event, fn]) => {
        const f = bound ? fn(bound) : fn;
        ac[event] = !ac.hasOwnProperty(event) ? [f] : [...ac[event], f];
        return ac;
      }, acc[upperK] || {});
      return acc;
    }, this.keyListeners);
  }

  registerOutput(elementId, stateKey, defaultValue) {
    this.outputs[stateKey] = elementId;
  }

  registerButton(elementId, cb) {
    const node = document.getElementById(elementId);

    node.addEventListener("click", e => cb(game));
  }

  registerInput(elementId, stateKey, defaultValue) {
    const node = document.getElementById(elementId);

    node.addEventListener("input", ({ target: { value } }) =>
      this.changeState(stateKey, value)
    );
  }

  updateOutput(elementId, value) {
    const node = document.getElementById(elementId);

    node.innerHTML = value;
  }

  changeState(key, value) {
    if (isFunction(key)) {
    }

    this.state[key] = value;

    if (this.outputs[key]) this.updateOutput(this.outputs[key], value);
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
      // const dx = x - this.dragging.x;
      // const dy = y - this.dragging.y;
      this.shapesMoving.forEach(s => s.moveTo(x, y));

      this.dragging = { x, y };
    });

    this.canvas.addEventListener("mouseup", () => {
      this.dragging = false;
      this.shapesMoving = null;
    });
  }

  addAnimations(animations) {
    this.animations = Object.entries(animations).reduce(
      (acc, [name, { bodies, duration, method, singleRun }]) => {
        acc[name] = new Animation({
          bodies: bodies.map(b => this.namedBodies[b]),
          duration,
          name,
          singleRun,
          method
        });
        return acc;
      },
      {}
    );
  }

  addBodyTypes(bodyTypes) {
    this.bodyTypes = bodyTypes.reduce((acc, bt) => {
      acc[bt.type] = props => Shapes[bt.parent].create({ ...bt, ...props });
      return acc;
    }, {});
  }

  createBody(body) {
    const o = this.bodyTypes.hasOwnProperty(body.type)
      ? this.bodyTypes[body.type](body)
      : Shapes[body.type].create(body);
    if (o.name) this.namedBodies[o.name] = o;
    if (o.hasOwnProperty("keyListeners"))
      this.addKeyListeners(o.keyListeners, o);
    return o;
  }

  addBody(...bodies) {
    bodies.forEach(body => {
      this.bodies.push(this.createBody(body));
    });
  }

  addBodies(bodies) {
    this.bodies.push(...bodies);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawBodies() {
    this.bodies.forEach(body => body.draw(this.ctx));
  }

  detectCollisions(/* delta */) {
    this.bodies.forEach(b1 => {
      const cache = this.interactionCache[b1.type] || {};
      this.bodies.forEach(b2 => {
        if (b1 === b2) return;
        const collision = b1.collidesWith(b2);
        if (collision.axis || collision.overlap > 0) {
          const mtv = checkMTVAxisDirection(collision, b1, b2);
          resolveCollision(mtv, b1, b2);
          if (cache[b2.type]) {
            const r = cache[b2.type](this, b1, b2);
          } else if (
            !!this.interactionCache[b2.type] &&
            !!this.interactionCache[b2.type][b1.type]
          ) {
            const r = this.interactionCache[b2.type][b1.type](this, b2, b1);
          }
        }
      });
    });
  }

  integrate(delta) {
    this.bodies.forEach(body => {
      body.update(delta);
    });
  }

  detectBoundaries() {
    this.bodies.forEach(body => {
      const { x, y } = body.centroid();
      if (x < 0 || x > this.width) body.velocity.x *= -1;
      if (y < 0 || y > this.height) body.velocity.y *= -1;
    });
  }

  animate(delta) {
    this.activeAnimations.forEach(anim => {
      anim.advance(this.removeAnim);
    });
  }

  startAnimation(animName, step = 0) {
    const anim = this.animations[animName];

    if (anim.active) return;
    anim.start(step);
    if (this.activeAnimations.indexOf(anim) < 0)
      this.activeAnimations.push(anim);
  }

  removeAnimation(anim) {
    this.activeAnimations = this.activeAnimations.filter(a => a !== anim);
  }

  stopAnimation(animName) {
    const anim = this.animations[animName];
    if (!anim) return 0;
    return anim.stop();
  }

  update(delta) {
    // this.animFn(delta)
    this.detectBoundaries(delta);
    this.detectCollisions(delta);
    this.integrate(delta);
  }

  toggle() {
    if (this.paused) {
      this.animInterval = window.setInterval(this.animFn, 20);
    } else {
      window.clearInterval(this.animInterval);
      this.animInterval = null;
    }
    this.paused = !this.paused;
  }

  render() {
    if (this.paused) return window.setTimeout(this.renderFn, 200);
    this.clear();
    this.update(0.01);
    // if (this.borders) this.drawBorder();
    if (this.bodies) this.drawBodies();

    this.animFrame = window.requestAnimationFrame(this.renderFn);
  }
}

export default Game;
