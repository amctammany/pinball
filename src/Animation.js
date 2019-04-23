export default class Animation {
  constructor({ bodies, duration, method, name, singleRun = false}) {
    this.name = name
    this.duration = duration;
    this.bodies = bodies;
    this.method = method;
    this.step = 0;
    this.active = false;
    this.singleRun = singleRun
  }

  advance(removeAnim) {
    if (!this.active) removeAnim(this)
    if (this.step > this.duration) {
      if (this.singleRun) {
       return removeAnim(this);
      }
       //removeAnim(this);
      return;
    }
    this.step += 1;
    this.bodies.forEach(b => this.method(b, this.step));
  }

  start(delta) {
    if (this.active) return
    this.step = 0;
    this.active = true;
  }

  stop() {
    this.step = 0;
    this.active = false;
  }
}
