export default class Animation {
  constructor({ bodies, duration, method, name, singleRun = false }) {
    this.name = name;
    this.duration = duration;
    this.bodies = bodies;
    this.method = method;
    this.step = 0;
    this.active = false;
    this.singleRun = singleRun;
  }

  advance(removeAnim) {
    if (!this.active) removeAnim(this);
    if (this.step >= this.duration) {
      this.stop(removeAnim);
      return;
    }
    this.bodies.forEach(b => this.method(b, this.step));
    this.step += 1;
  }

  start(step = 0) {
    if (this.active) return;
    this.step = step;
    this.active = true;
  }

  stop(removeAnim) {
    if (!this.active) return 0; // this.step
    this.active = false;
    removeAnim(this);
    return 0; // this.duration - this.step
    this.step = 0;
    this.active = false;
  }
}
