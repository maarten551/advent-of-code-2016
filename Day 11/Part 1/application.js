let entityIdentifierCounter = 0;

require("fs").readFile("./input/input.txt", 'utf8', function (err, input) {
    if (err) {
        return console.log(err);
    }

    let environment = new Environment(0, 1);

    input.split("\r\n").forEach((s, i) => {
        environment.floors[i + 1] = parseStringToFloor(i + 1, s)
    });

    environment.bruteForceBestOption();
});

/**
 * @param {int} floorId
 * @param {string} nonParsedFloor
 * @return {Floor}
 */
function parseStringToFloor(floorId, nonParsedFloor) {
    let floor = new Floor(entityIdentifierCounter++, floorId);
    let chipParseResults = nonParsedFloor.match(/[a-z-]+(?= microchip)/g);
    let generatorParseResults = nonParsedFloor.match(/([a-z]+)(?= generator)/g);

    if (chipParseResults != null) {
        chipParseResults.forEach(chipName => {
            floor.addMoveAble(new MicroChip(entityIdentifierCounter++, chipName.split("-")[0]));
        });
    }

    if (generatorParseResults != null) {
        generatorParseResults.forEach(generatorName => {
            floor.addMoveAble(new Generator(entityIdentifierCounter++, generatorName));
        });
    }

    return floor;
}

class MoveAble {
    constructor(id, name) {
        this.floorNumber = id;
        this.name = name;
    }

    /**
     * @param {Floor} fromFloor
     * @param {Floor} toFloor
     */
    switchFloors(fromFloor, toFloor) {
        fromFloor.removeMoveAble(this);
        toFloor.addMoveAble(this);
    }
}

class Generator extends MoveAble {
    constructor(id, name) {
        super(id, name);
    }
}

class MicroChip extends MoveAble {
    constructor(id, name) {
        super(id, name);
    }
}

class Floor {
    constructor(id, floorNumber) {
        this.id = id;
        this.floorNumber = floorNumber;
        this.generators = [];
        this.microchips = [];
    }

    addMoveAble(moveAbleItem) {
        if (moveAbleItem instanceof Generator) {
            this.generators[this.generators.length] = moveAbleItem;
        } else {
            this.microchips[this.microchips.length] = moveAbleItem;
        }
    }

    removeMoveAble(moveAbleItem) {
        if (moveAbleItem instanceof Generator) {
            this.generators = this.generators.filter(generator => generator !== moveAbleItem);
        } else {
            this.microchips = this.microchips.filter(microchip => microchip !== moveAbleItem);
        }
    }

    isCurrentSetupPossible() {
        return this.microchips.every(
            m => this.generators.some(g => m.name == g.name) || this.generators.length == 0);
    }

    isEmpty() {
        if (this.generators.length > 0) {
            return false;
        }

        return this.microchips.length == 0;
    }

    getMoveAbleIdentifiersInOrder() {
        return [
            ...this.generators.map(generator => generator.floorNumber),
            ...this.microchips.map(microchip => microchip.floorNumber)
        ].sort();
    }

    /**
     * @return {Floor}
     */
    clone() {
        let floor = new Floor();

        floor.generators = Object.assign([], this.generators);
        floor.microchips = Object.assign([], this.microchips);
        floor.floorNumber = this.floorNumber;
        floor.id = this.id;

        return floor;
    }

    toString() {
        let generatorString = this.generators.reduce((l, r) => l + r.name, "G");
        let microchipsString = this.microchips.reduce((l, r) => l + r.name, "M");

        return "(" + generatorString + ", " + microchipsString + ")";
    }
}

class Environment {
    constructor(currentAmountOfSteps, elevatorLevel) {
        this.currentAmountOfSteps = currentAmountOfSteps;
        this.floors = {};
        this.elevatorLevel = elevatorLevel;
        this.checkedPositions = [];
    }

    bruteForceBestOption() {
        let queue = [];

        this.iterateCurrentEnvironment(queue);

        while (queue.length > 0) {
            let environment = queue.shift();
            //console.log(environment.currentAmountOfSteps);

            //environment.check();

            if (!environment.hasPositionBeenAdded()) {
                environment.addToCheckedPositions();
                if (environment.isMissionComplete()) {
                    console.log("Success: " + environment.currentAmountOfSteps);
                    console.log(environment.checkedPositions.length);
                    break;
                }

                environment.iterateCurrentEnvironment(queue);
            }
        }
    }

    isMissionComplete() {
        for (let i = 1; i < Object.keys(this.floors).length; i++) {
            if (!this.floors[i].isEmpty()) {
                return false;
            }
        }

        return true;
    }

    /**
     * TODO: Increase performance by better indexing
     */
    addToCheckedPositions() {
        let indexSequence = [this.elevatorLevel];
        let currentArray = this.checkedPositions;

        Object.values(this.floors).forEach(floor => {
            indexSequence = [...indexSequence, floor.id, ...floor.getMoveAbleIdentifiersInOrder()];
        });

        while (indexSequence.length > 0) {
            let currentIndex = indexSequence.shift();

            if (!(currentIndex in currentArray)) {
                currentArray[currentIndex] = [];
            }

            currentArray = currentArray[currentIndex];
        }

        currentArray.push(null); //Represents the end of the sequence
    }

    /**
     * TODO: Increase performance by better indexing
     */
    hasPositionBeenAdded() {
        let indexSequence = [this.elevatorLevel];
        let currentArray = this.checkedPositions;

        Object.values(this.floors).forEach(floor => {
            indexSequence = [...indexSequence, floor.id, ...floor.getMoveAbleIdentifiersInOrder()];
        });

        if (indexSequence.every(index => {
                if (!(index in currentArray)) {
                    return false;
                }

                currentArray = currentArray[index];
                return true;
            })) {
            return currentArray.includes(null);
        }

        return false;
    }

    /**
     * @param {Environment[]} queue
     */
    iterateCurrentEnvironment(queue) {
        /** @type {Floor} */
        let currentFloor = this.floors[this.elevatorLevel];

        for (let i = -1; i <= 1; i += 2) {
            if ((this.elevatorLevel + i) in this.floors) {
                /** @type {Floor} */
                let nextFloor = this.floors[this.elevatorLevel + i];

                for (let i = 0; i < currentFloor.generators.length; i++) {
                    this.createNewPossibleEnvironment(queue, currentFloor, nextFloor,
                                                      currentFloor.generators[i], null);
                    for (let j = i + 1; j < currentFloor.generators.length; j++) {
                        this.createNewPossibleEnvironment(queue, currentFloor, nextFloor,
                                                          currentFloor.generators[i],
                                                          currentFloor.generators[j]);
                    }

                    for (let j = 0; j < currentFloor.microchips.length; j++) {
                        this.createNewPossibleEnvironment(queue, currentFloor, nextFloor,
                                                          currentFloor.generators[i],
                                                          currentFloor.microchips[j]);
                    }
                }

                for (let i = 0; i < currentFloor.microchips.length; i++) {
                    this.createNewPossibleEnvironment(queue, currentFloor, nextFloor,
                                                      currentFloor.microchips[i], null);
                    for (let j = i + 1; j < currentFloor.microchips.length; j++) {
                        this.createNewPossibleEnvironment(queue, currentFloor, nextFloor,
                                                          currentFloor.microchips[i],
                                                          currentFloor.microchips[j]);
                    }
                }
            }
        }
    }

    /**
     * @param {Environment[]} queue
     * @param {Floor} fromFloor
     * @param {Floor} toFloor
     * @param {MoveAble} firstItem
     * @param {MoveAble} secondItem
     */
    createNewPossibleEnvironment(queue, fromFloor, toFloor, firstItem, secondItem) {
        let environment = this.clone();
        environment.currentAmountOfSteps++;
        environment.elevatorLevel = toFloor.floorNumber;

        fromFloor = environment.floors[fromFloor.floorNumber];
        toFloor = environment.floors[toFloor.floorNumber];

        firstItem.switchFloors(fromFloor, toFloor);

        if (secondItem != null) {
            secondItem.switchFloors(fromFloor, toFloor);
        }
        if (fromFloor.isCurrentSetupPossible() && toFloor.isCurrentSetupPossible()) {
            //noinspection JSUnresolvedFunction
            queue.push(environment);
        }
    }

    clone() {
        let environment = new Environment(this.currentAmountOfSteps, this.elevatorLevel);
        environment.checkedPositions = this.checkedPositions;

        Object.entries(this.floors).forEach(o => environment.floors[o[0]] = o[1].clone());

        return environment;
    }

    toString() {
        return this.elevatorLevel + Object.values(this.floors).map(floor => floor.toString())
                .join("");
    }
}