Introduction
======

Welcome to Part 1 of my "Let's Make a Game -- Pinball" series.
In [our last article](http://amctammany.com/posts/ch-0) we trudged through setting up our project to use Webpack/Babel.
After the installation and configuration was completed, [the project](https://github.com/amctammany/pinball/tree/ch0)
 was a blank canvas and could be used as a starting point for any JavaScript projects, not just limited to making a game engine.

Today is going to be about turning our blank canvas into an *actual* canvas.
To start, we need to clean up `app.js`.  This file will be used to bootstrap our actual game.
Speaking of, let's go ahead and create our game file.
We will be needed a couple other files later on so lets create them now.

```bash
touch src/Game.js

touch src/Shape.js
mkdir src/shapes
touch src/shapes/Circle.js src/shapes/Rectangle.js
```

HTML Canvas
======

Seeing how this entire series is about making a game engine using HTML Canvas, it's high time we actually added one to our page.
While we can create and add a `<canvas>` using JavaScript, I prefer to directly insert it in `template.html`.
This helps clearly differentiate between game logic and the view by keeping them in different files.
Separation of concerns is a major issue in any growing codebase and we will try to cleanly distinguish each part throughout this series.

To add a canvas, insert this tag at the end of `<body>` in `src/template.html`.
Here we are using a fallback in case of older browsers.
Canvas is supported in ...

```html
<canvas id="gameCanvas" width=500 height=500>
  You're browser does not support canvas.
</canvas>
```

Like other HTML elements, `<canvas>` can be styled using CSS.
However, modifying the size of a `<canvas>` with CSS will not automatically change the size within the `CanvasRenderingContext2D`.
To avoid this headache, we will begin by manually specifying the width and height directly in HTML.


HTML Canvas and the Rendering Context
----

To access the Canvas API, we first need a reference to a `<canvas>`.
With that, we can get a context object responsible for drawing to the element by calling `getContext('2d')`.
Other rendering APIs are available such as WebGL but are out of the scope of this lesson.
Canvas's coordinate system originates at the top left corner and increases as it travels right and down


```js

const canvas = document.getElementById("canvas");
const { width, height } = canvas;
const ctx = canvas.getContext("2d");
const dSize = 15;

// Top Left
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, dSize, dSize);
// Top Right
ctx.fillStyle = "red";
ctx.fillRect(width - dSize, 0, dSize, dSize);
// Bottom Right
ctx.fillStyle = "green";
ctx.fillRect(width - dSize, height - dSize, dSize, dSize);
// Bottom Left
ctx.fillStyle = "black";
ctx.fillRect(0, height - dSize, dSize, dSize);
```

Here we quickly demonstrate where the origin is and how to render to boxes at the corners.
The Canvas API is a full-fledged rendering system and diving into every function is counterproductive towards our goal of making a game.
I will comment on any canvas-related methods and techniques that are not obvious but I encourage y'all to read the [specification](http://w3.org/...), lots of great stuff in there.


Let's Draw Something!
======

It's time to make a game!
Well, as much as you can consider shapes bouncing around walls a game.
While the level of fun to be had is minimal, this "game" introduces a concept at the core of every game engine, **the game loop**.  

The game loop is responsible for several things.
In my opinion, the most (and only) important aspect is providing a sense of time.
In a nutshell, the game loop calculates the next state of the game given the current state and any inputs.
Anything beyond that, such as rendering, is a ... 

Here is the basic structure of our `Game` class.

```js
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = this.canvas.getContext("2d");

    this.renderFn = this.render.bind(this);
  }

  init() {}

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

```

Self explanatory right?
The only *tricky* bit is at the end of the `render()` method.
The difficulty arises from developers misunderstanding `this` in JavaScript.
When we initially call `render`, the function is correctly bound to our Game object.
However, when we call `requestAnimationFrame`, the next execution of `render` will be `window`.
We eliminated this issue by explicitly defining a `renderFn` in our constructor that is permanently bound to the game object.


Shape Abstraction
-----

So far, all of the rendering has been hardcoded, let's change that.
Open up `src/Shape.js` and add the following abstract parent class.
Most of these methods will be overriden but are all essential for the rendering of a shape.
These abstractions will be useful later when we implement collision detection in our engine.

```js
class Shape {
  constructor({ fillStyle = "red", strokeStyle = "black" }) {
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
  }

  createPath(ctx) {
    throw "createPath(ctx) not implemented";
  }

  move(dx, dy) {
    throw "move(ctx) not implemented";
  }

  fill(ctx) {
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    this.createPath(ctx);
    ctx.fill();
    ctx.restore();
  }

  stroke(ctx) {
    ctx.save();
    ctx.strokeStyle = this.strokeStyle;
    this.createPath(ctx);
    ctx.stroke();
    ctx.restore();
  }
}

export default Shape;

```
