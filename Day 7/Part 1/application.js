require("fs").readFile("./input/input.txt", 'utf8', function (err, ipv7List) {
    if (err) {
        return console.log(err);
    }

    console.log(ipv7List.split("\r\n").filter(ipv7 => new IpAddress(ipv7).containsTLS()).length);
});

class IpAddress {
    constructor(nonParsedLine) {
        this.hypernetSequences = [];
        this.nonHypernetSequences = [];

        this.parseLine(nonParsedLine);
    }

    parseLine(nonParsedLine) {
        let matchResults = nonParsedLine.match(/^([a-z]*)(\[([a-z]+)])?([a-z\[\]]*)$/);
        if (matchResults !== null) {
            this.hypernetSequences[this.hypernetSequences.length] = matchResults[1];

            if (matchResults[2]) {
                this.nonHypernetSequences[this.nonHypernetSequences.length] = matchResults[3];
            }

            if (matchResults[4]) {
                this.parseLine(matchResults[4]);
            }
        }
    }

    /**
     * @return {boolean}
     */
    containsTLS() {
        if (this.nonHypernetSequences.some(this.containsABBA)) {
            return false;
        }

        return this.hypernetSequences.some(this.containsABBA);
    }

    /**
     * @return {boolean}
     * @param {string} ipv7Part
     */
    containsABBA(ipv7Part) {
        let cache = [null, null, null, null];

        for (let i = 0; i < ipv7Part.length; i++) {
            cache[0] = cache[1];
            cache[1] = cache[2];
            cache[2] = cache[3];
            cache[3] = ipv7Part.substr(i, 1);

            if (cache[0] !== null && cache[0] === cache[3] && cache[1] === cache[2] && cache[0]
                                                                                       != cache[1]) {
                return true;
            }
        }

        return false;
    }
}