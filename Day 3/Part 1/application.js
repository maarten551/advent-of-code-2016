var fs = require("fs");
fs.readFile("./input/input.txt", 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    var counter = 0;

    data.split("\r\n").forEach(function (line) {
        counter = (isValidTriangle(line)) ? counter+1 : counter;
    });

    console.log(counter);
});

function isValidTriangle(line) {
    var parts = line.split("  ").map(part => parseInt(part.trim())).filter(part => !isNaN(part));

    if ((parts[0] + parts[1]) <= parts[2]) {
        return false;
    }

    if ((parts[0] + parts[2]) <= parts[1]) {
        return false;
    }

    return (parts[1] + parts[2]) > parts[0];
}