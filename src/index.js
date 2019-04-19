import Game from "./Game";

const gameData = {
  bodies: [
    //{
      //type: "Rectangle",
      //x: 110,
      //y: 90,
      //width: 40,
      //height: 50,
      //fillStyle: "green"
    //},
    //{
      //type: "Rectangle",
      //x: 220,
      //y: 80,
      //width: 10,
      //height: 10,
      //fillStyle: "green",
    //mass: 12,
    //},
  //{
      //type: "Rectangle",
      //x: 320,
      //y: 180,
      //width: 40,
      //height: 20,
    //mass: 12,
      //fillStyle: "red"
    //},
  {
      type: "Rectangle",
      x: 120,
      y: 280,
      width: 100,
      height: 10,
    mass: 20,
      fillStyle: "yellow",
    },
    {
      type: 'Circle',
      x: 100,
      y: 230,
      radius: 20,
      fillStyle: 'blue',
      mass: 20,
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
