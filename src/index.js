import Game from "./Game";

const gameData = {
  bodies: [
    {
      type: "Rectangle",
      x: 110,
      y: 90,
      width: 40,
      height: 50,
      fillStyle: "green"
    },
    {
      type: "Rectangle",
      x: 220,
      y: 80,
      width: 10,
      height: 10,
      fillStyle: "green"
    },
  {
      type: "Rectangle",
      x: 320,
      y: 180,
      width: 40,
      height: 20,
      fillStyle: "red"
    },
  {
      type: "Rectangle",
      x: 120,
      y: 280,
      width: 100,
      height: 10,
      fillStyle: "yellow"
    },
    {
      type: 'Circle',
      x: 100,
      y: 230,
      radius: 20,
      fillStyle: 'blue',
    },


    // {
    // type: "Rectangle",
    // x: 100,
    // y: 50,
    // width: 40,
    // height: 50,
    // fillStyle: "green"
    // },
    // {
    // type: "Circle",
    // x: 50,
    // y: 80,
    // radius: 10,
    // fillStyle: "blue"
    // }
  ]
};

const canvas = document.getElementById("canvas");

const game = new Game(canvas);
game.init(gameData);

window.game = game;

export default game;
