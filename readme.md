Run `npm install` and open index.html to see a few not-very-smart (but not *completely* random) bots compete in a field of hexagons.

![App screenshot](https://i.imgur.com/2Y4HYY9.png)

## Game rules
Every cell gains one resource points per move if it has less than 100 points.
Every player (bot) can transfer some amount of resource from one cell to another per move.
To capture a cell that belongs to another player, the amount of resource transfered needs to be higher than the target cell.
The resource difference between source and target cells is dicarded after the move.

This is probably missing some details, but the basic idea should be clear. I should've written the rules down much earlier, will need to read code to be sure now -_-

## More AI bots
Someday I will write one or more smarter bot implementations. Or challange a friend to write one as well and watch them battle. Now it's just a nicely-looking hexagon animation. Well, and a piece of code to show to employers.
