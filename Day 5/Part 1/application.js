let crypto = require("crypto");

require("fs").readFile("./input/input.txt", 'utf8', function (err, md5Prefix) {
    if (err) {
        return console.log(err);
    }

    let doorCode = "";

    for(let i = 0; doorCode.length < 8; i++) {
        let hashMatchResults = createHash(md5Prefix + i).match(/^0{5}(.).*$/);

        if(hashMatchResults !== null && hashMatchResults.length >= 2) {
            doorCode = doorCode + hashMatchResults[1];
        }
    }

    console.log(doorCode);
});

function createHash(toHash) {
    return crypto.createHash("md5").update(toHash).digest("hex");
}