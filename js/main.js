const gameConfig = {
    mapRadius: 10,
    hexRadius: 16,
    spacing: 4,
    turnTime: 100,
    canvas: document.getElementById('canvas'),
    Two: Two,
    hexLib: hexagonLib
};
const game = new Game(gameConfig);
game.start();