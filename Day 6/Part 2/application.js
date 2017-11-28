require("fs").readFile("./input/input.txt", 'utf8', function (err, repetitionCode) {
    if (err) {
        return console.log(err);
    }

    let letterCount = {};

    repetitionCode.split("\r\n").forEach(line => {
        line.split("").forEach((letter, index) => {
            if (!(index in letterCount)) {
                letterCount[index] = {};
            }

            if (!(letter in letterCount[index])) {
                letterCount[index][letter] = 0;
            }

            letterCount[index][letter]++;
        });
    });

    console.log(
        Object.values(letterCount).map(columnCountObject => Object.entries(columnCountObject)
            .sort((array1, array2) => array1[1] - array2[1])[0][0]).join(""));
});