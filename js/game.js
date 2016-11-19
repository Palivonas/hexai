class Game {
    constructor (twoInstance) {
        this.turnTime = 100;
        this.starParameters = [18.2, 21, 6];
        this.starRotation = 17;
        this.hexWidth = 40;

        this.edgeLength = 5;

        this.two = twoInstance;
        this.cells = [];


        // const rows = this.edgeLength * 2 - 1;
        // for (let y = 0; y < rows; ++y) {
        //     let cellsInRow = this.edgeLength + (this.edgeLength / 2 - Math.abs(y - this.edgeLength / 2));
        //     if (y > this.edgeLength / 2) {
        //         cellsInRow += 2;
        //     }

        //     const offsetX = Math.floor((rows - cellsInRow) / 2);
        //     for (let x = 0; x < cellsInRow; ++x) {
        //         this.cells.push(this.makeHex(x + offsetX, y));
        //         this.draw();
        //     }
        //     this.bbd;
        // }

        const qOffsets = {};
        qOffsets[-3] = 1;
        qOffsets[-2] = 1;
        qOffsets[-1] = 2;
        qOffsets[0] = 2;
        qOffsets[1] = 3;
        qOffsets[2] = 3;
        qOffsets[3] = 4;
        qOffsets[4] = 4;
        qOffsets[5] = 5;

        this.hexes = [];
        this.hexGroup = new Two.Group();
        this.textGroup = new Two.Group();
        var n_hex = null; 
        var row = 0, col = 0;
        for (var q = -this.edgeLength; q <= this.edgeLength; q++) {
            var r1 = Math.max(-this.edgeLength, -q - this.edgeLength);
            var r2 = Math.min(this.edgeLength, -q + this.edgeLength);
            col = q + this.edgeLength;
            this.hexes[ col ] = [];


            for (var r = r1; r <= r2; r++) {
                row = r - r1;
                // temp_q = q + (r + this.edgeLength);
                let offset = 0;
                if (qOffsets.hasOwnProperty(r)) {
                    offset = qOffsets[r];
                }
                this.cells.push(this.makeHex(q + offset, r));
                this.hexes[ col ][ row ] = [[q, r], [col, row]];
            }
        }
        this.hexGroup.add(this.cells);
        this.hexGroup.translation.set(250, 210);
        this.textGroup.translation.set(250, 210);
        two.add(this.hexGroup);
        two.add(this.textGroup);
    }

    makeHex (q, r) {
        const width = this.hexWidth;
        let x = q;
        let y = r;
        if (y % 2 == 0) {
            x += 0.5;
        }
        x = x * width;
        y = y * width * 0.87;
        const star = this.two.makeStar(x, y, ...this.starParameters);
        star.rotation = this.starRotation;

        const text = new Two.Text(q + ", " + r, x, y);
        this.two.add(text);
        this.textGroup.add(text);
        return star;
    }

    start () {
        this.running = true;
        this.gameLoop();
    }

    stop () {
        this.running = false;
    }

    gameLoop () {
        if (!this.running)
            return;
        this.update();
        this.draw();
        setTimeout("game.gameLoop()", this.turnTime); //TODO fix this hardcoded crap
    }

    update () {
        if (this.customUpdate)
            this.customUpdate(this.two, this);
    }

    draw () {
        this.two.update();
    }
}