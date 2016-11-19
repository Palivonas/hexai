const dimensions = {
    width: 700,
    height: 600
};

const canvas = document.getElementById('canvas');
const two = new Two(dimensions).appendTo(canvas);
const game = new Game(two);

game.start();