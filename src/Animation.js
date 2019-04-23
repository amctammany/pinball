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
    if (this.active && this.step >= this.duration) {
      if (this.singleRun) this.stop()
       //removeAnim(this);
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

  stop(removeAnim) {
    this.step = 0;
    this.active = false;
  }
}
