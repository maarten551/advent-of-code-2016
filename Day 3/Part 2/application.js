var fs = require("fs");
var parsedFile = {
    "column": [
        [],
        [],
        []
    ]
};

fs.readFile("./input/input.txt", 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    var correctTriangleCount = 0;

    data.split("\r\n").forEach(function (line) {
        parseTriangle(line);
    });

    parsedFile.column.forEach(function (columnValues) {
        for (var i = 0; i < columnValues.length; i += 3) {
            correctTriangleCount =
                (isValidTriangle(columnValues[i], columnValues[i + 1], columnValues[i + 2]))
                    ? correctTriangleCount + 1 : correctTriangleCount;
        }
    });

    console.log(correctTriangleCount);
});

function parseTriangle(line) {
    var parts = line.split("  ").map(part => parseInt(part.trim())).filter(part => !isNaN(part));

    for (var i = 0; i < 3; i++)
        parsedFile.column[i][parsedFile.column[i].length] = parts[i];
}

function isValidTriangle(firstPart, secondPart, thirdPart) {
    if ((firstPart + secondPart) <= thirdPart) {
        return false;
    }

    if ((firstPart + thirdPart) <= secondPart) {
        return false;
    }

    return (secondPart + thirdPart) > firstPart;
}