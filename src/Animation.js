export default class Animation {
  constructor({ bodies, duration, method }) {
    this.duration = duration;
    this.bodies = bodies;
    this.method = method;
    this.step = 0;
  }

  advance(removeAnim) {
    if (this.step >= this.duration) {
      removeAnim(this);
      this.step = 0;
      return;
    }
    this.step += 1;
    this.bodies.forEach(b => this.method(b, this.step));
    // this.method(this.bodies, this.step)
  }

  start(delta) {
    this.startTime = delta;
    this.elapsedTime = undefined;
    this.running = true;
  }

  stop() {}
}
