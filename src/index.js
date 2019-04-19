import Game from "./Game";

const gameData = {
  bodies: [
    {
      type: 'Polygon',
      points: [[20, 450], [20, 480], [40, 450] ],
      fillStyle: 'red',
      strokeStyle: 'blue',
    },
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
