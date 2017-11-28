require("fs").readFile("./input/test-input.txt", 'utf8', function (err, ipv7List) {
    if (err) {
        return console.log(err);
    }

    console.log(ipv7List.split("\r\n").filter(ipv7 => new IpAddress(ipv7).containsSSL()).length);
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
            this.nonHypernetSequences[this.nonHypernetSequences.length] = matchResults[1];

            if (matchResults[2]) {
                this.hypernetSequences[this.hypernetSequences.length] = matchResults[3];
            }

            if (matchResults[4]) {
                this.parseLine(matchResults[4]);
            }
        }
    }

    /**
     * @return {boolean}
     */
    containsSSL() {
        return this.retrievePattern(this.nonHypernetSequences).some(ABA => {
            let s = ABA.split("");

            return this.retrievePattern(this.hypernetSequences).includes(s[1] + s[0] + s[1]);
        });
    }

    /**
     * @return {string[]}
     */
    retrievePattern(sequences) {
        let results = [];
        let cache = [null, null, null];

        sequences.forEach(ipv7Part => {
            for (let i = 0; i < ipv7Part.length; i++) {
                cache[0] = cache[1];
                cache[1] = cache[2];
                cache[2] = ipv7Part.substr(i, 1);

                if (cache[0] !== null && cache[0] == cache[2] && cache[0] != cache[1]) {
                    results.push(cache.join(""));
                }
            }
        });

        return results;
    }
}