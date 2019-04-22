import Game from "./Game";

const gameData = {
  keyListeners: {
    P: (game, event) => game.toggle()
  },
  bodyTypes: [
    {
      restitution: 2,
      type: "bumper-100",
      parent: "Circle",
      radius: 10,
      fillStyle: "yellow",
      strokeStyle: "red",
      strokeWidth: 3,
      collisionHandlers: {
        ball: (game, root, other) =>
          game.changeState("score", score => score + 10)
      },
      keyListeners: {
        S: source => (game, event) => {
          source.move(-10, 0);
        }
      }
    },
    {
      type: "flipper",
      parent: "Rectangle",
      width: 48,
      height: 16,
      fillStyle: "red",
      strokeStyle: "blue"
    },
    {
      type: "ball",
      parent: "Circle",
      radius: 7,
      fillStyle: "gray",
      strokeStyle: "black",
      strokeWidth: 10,
      mass: 1
    }
  ],
  dome: {
    x: 150,
    y: 150,
    radius: 150,
    sides: 20
  },
  bodies: [
    {
      type: "ball",
      x: 250,
      y: 550,
      vx: 0,
      vy: -200,
      keyListeners: {
        A: source => (game, event) => {
          source.velocity = source.velocity.multiply(-1);
        }
      }
    },
    { type: "bumper-100", x: 75, y: 110 },
    {
      type: "bumper-100",
      x: 150,
      y: 60
    },
    { type: "bumper-100", x: 225, y: 110 },
    { type: "bumper-100", x: 150, y: 160 },
    {
      type: "flipper",
      x: 150,
      y: 480,
      keyListeners: {
        X: source => (game, event) => {
          source.rotate({ x: 190, y: 490 }, Math.PI / 4);
        }
      }
    },
    {
      type: "flipper",
      x: 50,
      y: 480,
      keyListeners: {
        Z: source => (game, event) => {
          source.rotate({ x: 60, y: 490 }, Math.PI / -4);
        }
      }
    },

    {
      type: "Polygon",
      points: [[20, 450], [20, 480], [40, 450]],
      fillStyle: "red",
      strokeStyle: "blue"
    }
  ],
  buttons: [{ elementId: "toggleButton", cb: game => game.toggle() }],
  inputs: [{ elementId: "deltaInput", stateKey: "delta", defaultValue: 1 }],
  outputs: [
    { elementId: "deltaLabel", stateKey: "delta", defaultValue: 1 },
    { elementId: "scoreLabel", stateKey: "score", defaultValue: 0 }
  ]
};

const canvas = document.getElementById("canvas");

const game = new Game(canvas);
game.init(gameData);

window.game = game;

export default game;
