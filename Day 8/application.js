require("fs").readFile("./input/input.txt", 'utf8', function (err, commandList) {
    if (err) {
        return console.log(err);
    }

    let screen = new Screen(50, 6);

    commandList.split("\r\n").forEach(command => {
        let results = command.match(/^rect (\d+)x(\d+)$/);
        if (results) {
            return screen.drawRectangle(0, parseInt(results[2]), 0, parseInt(results[1]));
        }

        results = command.match(/^rotate [a-z]+ (x|y)=(\d+) by (\d+)$/);
        if (results) {
            if (results[1] == "x") {
                screen.rotateColumn(results[2], results[3]);
            } else {
                screen.rotateRow(results[2], results[3]);
            }
        }
    });

    console.log(screen.screenAllocation.map(widthArray => widthArray.reduce((l, r) => l + r))
                    .reduce((l, r) => l + r));
    screen.draw();
});

class Screen {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.screenAllocation = [];

        this.setup();
    }

    setup() {
        this.screenAllocation = [...Array(this.height)].map(() => {
            return [...Array(this.width)].map(() => false);
        });
    }

    drawRectangle(startHeight, endHeight, startWidth, endWidth) {
        for (let height = startHeight; height < endHeight; height++) {
            for (let width = startWidth; width < endWidth; width++) {
                this.screenAllocation[height][width] = true;
            }
        }
    }

    rotateColumn(rowIndex, steps) {
        let firstValue = this.screenAllocation[(this.height - steps)
                                               % this.height][rowIndex];
        let copyArray = [...Array(this.height)].map(
            (value, key) => this.screenAllocation[key][rowIndex]);
        for (let i = this.height - 1; i > 0; i--) {
            let getFromPosition = ((i - steps) < 0) ? this.height + (i - steps) : (i - steps);
            this.screenAllocation[i][rowIndex] = copyArray[getFromPosition % this.height];
        }

        this.screenAllocation[0][rowIndex] = firstValue;
    }

    rotateRow(columnIndex, steps) {
        let newArray = [];
        for (let i = this.width - 1; i >= 0; i--) {
            let getFromPosition = ((i - steps) < 0) ? this.width + (i - steps) : (i - steps);
            newArray[i] = this.screenAllocation[columnIndex][getFromPosition % this.width];
        }

        this.screenAllocation[columnIndex] = newArray;
    }

    draw() {
        console.log("\u001b[2J\u001b[0;0H");
        console.log(this.screenAllocation.map(line => {
            return line.map(status => (status) ? "▓" : "░").join("")
        }).join("\r\n"));
    }
}