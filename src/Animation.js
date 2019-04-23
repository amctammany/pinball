export default class Animation {
  constructor({ bodies, duration, method }) {
    this.duration = duration;
    this.bodies = bodies;
    this.method = method;
    this.step = 0;
    this.active = false;
  }

  advance() {
    if (this.step >= this.duration) {
      // removeAnim(this);
      // this.step = 0;
      // this.active = false;
      return;
    }
    this.step += 1;
    this.bodies.forEach(b => this.method(b, this.step));
    // this.method(this.bodies, this.step)
  }

  start(delta) {
    this.step = 0;
    this.active = true;
  }

  stop() {
    this.step = 0;
    this.active = false;
    // removeAnim(this)
  }
}
