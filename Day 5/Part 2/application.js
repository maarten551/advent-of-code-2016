let crypto = require("crypto");

require("fs").readFile("./input/input.txt", 'utf8', function (err, md5Prefix) {
    if (err) {
        return console.log(err);
    }

    let doorCode = {};

    for(let i = 0; Object.keys(doorCode).length < 8; i++) {
        let hashMatchResults = createHash(md5Prefix + i).match(/^0{5}(.)(.).*$/);

        if(hashMatchResults !== null
           && hashMatchResults.length >= 3
           && hashMatchResults[1] <= 7
           && !(hashMatchResults[1] in doorCode)) {
            doorCode[hashMatchResults[1]] = hashMatchResults[2];
        }
    }

    console.log(Object.keys(doorCode).sort().map(a => doorCode[a]).join(""));
});

function createHash(toHash) {
    return crypto.createHash("md5").update(toHash).digest("hex");
}