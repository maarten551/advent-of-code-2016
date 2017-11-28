var fs = require("fs");
fs.readFile("./input/input.txt", 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    var checksumCount = 0;

    data.split("\r\n").forEach(function (room) {
        var parsedRule = new ParsedRoom(room.match(/([a-z-]*?)-(\d*)\[([a-z]*)]/));

        if (parsedRule.isRoomValid()) {
            checksumCount += parseInt(parsedRule.sectorId);
        }
    });

    console.log(checksumCount);
});

class ParsedRoom {
    constructor(parsedRegex) {
        this.name = parsedRegex[1];
        this.sectorId = parsedRegex[2];
        this.checksum = parsedRegex[3];
    }

    /**
     * @return {boolean}
     */
    isRoomValid() {
        var validationResults = {
            byLetter: {},
            byCount: {}
        };

        //Filter out the duplicate elements (only the duplicates, the first duplicate stays)
        this.name.split('').filter((elem, pos, arr) => {
           return arr.indexOf(elem) == pos && elem !== "-";
        }).forEach((letter) => this.iterateName(letter, validationResults));

        return this.checksum == this.buildChecksum(validationResults);
    }

    buildChecksum(validationResults) {
        var checksum = "";

        Object.keys(validationResults.byCount).reverse().every(arrayKey => {
            validationResults.byCount[arrayKey].sort().every(letter => {
                checksum += letter;
                return checksum.length < 5;
            });

            return checksum.length < 5;
        });

        return checksum;
    }

    /**
     * @param nameLetter
     * @param validationResults
     */
    iterateName(nameLetter, validationResults) {
        var letterCount = this.name.split('')
            .filter(letter => letter === nameLetter).length;

        if (!(letterCount in validationResults.byCount)) {
            validationResults.byCount[letterCount] = [];
        }

        var byCount = validationResults.byCount[letterCount];
        byCount[byCount.length] = nameLetter;

        validationResults.byLetter[nameLetter] = letterCount;
    }
}