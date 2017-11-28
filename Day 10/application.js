let operations = {
    "chipInput": []
};

let entities = {
    "robots": {},
    "outputs": {}
};

require("fs").readFile("./input/input.txt", 'utf8', function (err, nonParsedOperations) {
    if (err) {
        return console.log(err);
    }

    nonParsedOperations.split("\r\n").forEach(function (operation) {
        let results = operation
            .match(/^bot (\d+) gives low to ([a-z]+) (\d+) and high to ([a-z]+) (\d+)$/);

        if (results == null) {
            operations.chipInput[operations.chipInput.length] = operation;
        } else {
            let robot = new Robot(results[1], results[2], results[3], results[4], results[5]);
            entities.robots[robot.id] = robot;

            if (results[2] == "output") {
                let output = new Output(results[3]);
                entities.outputs[output.id] = output;
            }

            if (results[4] == "output") {
                let output = new Output(results[5]);
                entities.outputs[output.id] = output;
            }
        }
    });

    operations.chipInput.forEach(function (operation) {
        let results = operation.match(/^value (\d+) goes to bot (\d+)$/);

        entities.robots[results[2]].addChip(results[1]);
    });

    console.log(
        "Part 2: " + Object.values(entities.outputs)
            .filter(o => o.id <= 2)
            .map(o => o.chips[0])
            .reduce((f, l) => f * parseInt(l), 1));
});

class Output {
    constructor(id) {
        this.id = id;
        this.chips = []
    }

    addChip(chipNumber) {
        this.chips[this.chips.length] = chipNumber;
    }
}

class Robot {
    constructor(id, toEntityTypeLow, toEntityIdLow, toEntityTypeHigh, toEntityIdHigh) {
        this.id = id;
        this.holdingChips = [null, null];
        this.toEntityTypeLow = toEntityTypeLow;
        this.toEntityIdLow = toEntityIdLow;
        this.toEntityTypeHigh = toEntityTypeHigh;
        this.toEntityIdHigh = toEntityIdHigh;
    }

    addChip(chipId) {
        if (this.holdingChips[0] == null) {
            this.holdingChips[0] = chipId;
        } else {
            this.holdingChips[1] = chipId;
            this.moveChips();
        }
    }

    moveChips() {
        //WARNING! Damn javascript was sorting strings instead of integers... (I miss my types)
        this.holdingChips = this.holdingChips.sort((a, b) => parseInt(a) - parseInt(b));
        let highChip = this.holdingChips[1];
        let lowChip = this.holdingChips[0];
        this.holdingChips = [null, null];

        //console.log("Robot " + this.id + " has chips: " + highChip + " & " + lowChip);
        if (lowChip == 17 && highChip == 61) {
            console.log("Found robot with conditions: " + this.id);
        }

        entities[(this.toEntityTypeLow == "output") ? "outputs"
            : "robots"][this.toEntityIdLow].addChip(lowChip);
        entities[(this.toEntityTypeHigh == "output") ? "outputs"
            : "robots"][this.toEntityIdHigh].addChip(highChip);
    }
}