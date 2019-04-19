import Game from "./Game";

const gameData = {
  bodyTypes: [
    {
      type: "bumper-100",
      parent: "Circle",
      radius: 10,
      fillStyle: "yellow",
      strokeStyle: "red",
      strokeWidth: 3
    },
    {
      type: "flipper",
      parent: "Rectangle",
      width: 48,
      height: 16,
      fillStyle: "red",
      strokeStyle: "blue"
    }
  ],
  dome: {
    x: 150,
    y: 150,
    radius: 150,
    sides: 20
  },
  bodies: [
    { type: "bumper-100", x: 75, y: 60 },
    { type: "bumper-100", x: 150, y: 30 },
    { type: "bumper-100", x: 225, y: 60 },
    { type: "bumper-100", x: 150, y: 90 },
    { type: "flipper", x: 150, y: 480 },
    { type: "flipper", x: 50, y: 480 },

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
