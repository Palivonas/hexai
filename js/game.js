class Game {
    constructor(config) {
        this.mapRadius = config.mapRadius;
        this.hexRadius = config.hexRadius;
        this.hexWidth = Math.sqrt(3) * this.hexRadius + config.spacing;
        this.hexHeight = config.hexRadius * 1.47 + config.spacing;
        this.turnTime = config.turnTime;
        this.canvas = config.canvas;
        this.Two = config.Two;
        this.hexLib = config.hexLib;

        this.canvasSize = this.hexWidth * (this.mapRadius * 2 + 1);

        this.two = new this.Two({
            width: this.canvasSize,
            height: this.canvasSize
        }).appendTo(canvas);
    }

    makeHex(x, y) {
        const hex = new this.Two.Polygon(x, y, this.hexRadius, 6);
        hex.rotation = Math.PI / 6;
        return hex;
    }

    initMapData() {
        this.cellsMap = new Map();
        this.cellsList = [];
        for (let q = -this.mapRadius; q <= this.mapRadius; q++) {
            const r1 = Math.max(-this.mapRadius, -q - this.mapRadius);
            const r2 = Math.min(this.mapRadius, -q + this.mapRadius);
            const rMap = new Map();
            this.cellsMap.set(q, rMap);
            for (let r = r1; r <= r2; r++) {
                const location = this.hexLib.Hex(q, r, -q-r);
                const cell = new Cell(location);
                rMap.set(r, cell);
                this.cellsList.push(cell);
            }
        }
        for (const cell of this.cellsList) {
            const neighbors = [];
            for (let direction = 0; direction < 6; ++direction) {
                const location = this.hexLib.hex_neighbor(cell.location, direction);
                if (this.cellsMap.has(location.q) && this.cellsMap.get(location.q).has(location.r)) {
                    neighbors.push(this.cellsMap.get(location.q).get(location.r)); // TODO use this.getCell()
                }
            }
            cell.setNeighbors(neighbors);
        }
    }

    initMapShapes () {
        this.shapes = [];
        this.hexGroup = new this.Two.Group();
        for (const cell of this.cellsList) {
            const hex = cell.location;
            const x = this.hexWidth * (hex.q + hex.r/2);
            const y = this.hexHeight * hex.r;
            const shape =  this.makeHex(x, y);
            cell.setHex(shape);
            this.hexGroup.add(shape);
        }
        this.two.add(this.hexGroup);
        const drawingOffset = this.canvasSize / 2;
        this.hexGroup.translation.set(drawingOffset, drawingOffset);
    }

    getCell (q, r) {
        if (this.cellsMap.has(q) && this.cellsMap.get(q).has(r)) {
            return this.cellsMap.get(q).get(r);
        }
        return null;
    }

    start() {
        this.initMapData();
        this.initMapShapes();
        this.initPlayers();
        this.running = true;
        this.gameLoop();
    }

    stop() {
        this.running = false;
    }

    initPlayers () {
        this.players = [
            new Player("Centa", "rgb(82, 141, 224)", this.getCell(1, 7)),
            new Player("TheRauck", "rgb(37, 183, 60)", this.getCell(-10, 1)),
            new Player("Undertaker", "rgb(193, 52, 52)", this.getCell(8, -13))
        ];
    }

    gameLoop() {
        if (!this.running)
            return;
        this.update();
        this.draw();
        setTimeout(this.gameLoop.bind(this), this.turnTime);
    }

    update() {
        for (const player of this.players) {
            Bot.makeTurn(player);
        }
    }

    draw() {
        for (const cell of this.cellsList) {
            cell.hex.fill = cell.getColor();
        }
        this.two.update();
    }
}

class Cell {
    constructor(location) {
        this.location = location;
        this.hex = null;
    }

    setHex (hex) {
        this.hex = hex;
    }

    setNeighbors (neighbors) {
        this.neighbors = neighbors;
    }

    setOwner (owner) {
        this.owner = owner;
    }

    getColor() {
        if (this.owner)
            return this.owner.color;
        if (this.color)
            return this.color;
        return "#ddd";
    }
}

class Player {
    constructor (name, color, startCell) {
        this.name = name;
        this.color = color;
        this.cells = [];
        if (startCell) {
            this.addCell(startCell);
            startCell.resource = 100;
        }
    }

    addCell (cell) {
        this.cells.push(cell);
        cell.owner = this;
    }
}

class Bot {
    static makeTurn (player) {
        const targets = new Set();
        for (const cell of player.cells) {
            cell.neighbors
                .filter(n => n.owner !== player)
                .forEach(target => {
                    targets.add(target);
                })
        };
        const target = randItem(Array.from(targets));
        if (target) {
            player.addCell(target);
        }
    }
}

const randItem = (list) => {
    if (!list || list.length === 0) {
        return null;
    }
    return list[randInt(list.length)];
}

const randInt = (min, max) => {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}