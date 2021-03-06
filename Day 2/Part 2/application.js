var input = "UDRLRRRUULUUDULRULUDRDRURLLDUUDURLUUUDRRRLUUDRUUDDDRRRLRURLLLDDDRDDRUDDULUULDDUDRUUUDLRLLRLDUDUUUUDLDULLLDRLRLRULDDDDDLULURUDURDDLLRDLUDRRULDURDDLUDLLRRUDRUDDDLLURULRDDDRDRRLLUUDDLLLLRLRUULRDRURRRLLLLDULDDLRRRRUDRDULLLDDRRRDLRLRRRLDRULDUDDLDLUULRDDULRDRURRURLDULRUUDUUURDRLDDDURLDURLDUDURRLLLLRDDLDRUURURRRRDRRDLUULLURRDLLLDLDUUUDRDRULULRULUUDDULDUURRLRLRRDULDULDRUUDLLUDLLLLUDDULDLLDLLURLLLRUDRDLRUDLULDLLLUDRLRLUDLDRDURDDULDURLLRRRDUUDLRDDRUUDLUURLDRRRRRLDDUUDRURUDLLLRRULLRLDRUURRRRRLRLLUDDRLUDRRDUDUUUDRUDULRRULRDRRRDDRLUUUDRLLURURRLLDUDRUURDLRURLLRDUDUUDLLLUULLRULRLDLRDDDU\r\
DRRRDRUDRLDUUDLLLRLULLLUURLLRLDRLURDRDRDRLDUUULDRDDLDDDURURUDRUUURDRDURLRLUDRRRDURDRRRDULLRDRRLUUUURLRUULRRDUDDDDUURLDULUDLLLRULUDUURRDUULRRDDURLURRUDRDRLDLRLLULULURLRDLRRRUUURDDUUURDRDRUURUDLULDRDDULLLLLRLRLLUDDLULLUDDLRLRDLDULURDUDULRDDRLUDUUDUDRLLDRRLLDULLRLDURUDRLRRRDULUUUULRRLUDDDLDUUDULLUUURDRLLULRLDLLUUDLLUULUULUDLRRDDRLUUULDDRULDRLURUURDLURDDRULLLLDUDULUDURRDRLDDRRLRURLLRLLLLDURDLUULDLDDLULLLRDRRRDLLLUUDDDLDRRLUUUUUULDRULLLDUDLDLURLDUDULRRRULDLRRDRUUUUUURRDRUURLDDURDUURURULULLURLLLLUURDUDRRLRRLRLRRRRRULLDLLLRURRDULLDLLULLRDUULDUDUDULDURLRDLDRUUURLLDLLUUDURURUD\r\
UDUUUUURUDLLLRRRDRDRUDDRLLDRRLDRLLUURRULUULULRLLRUDDRLDRLUURDUDLURUULLLULLRRRULRLURRDDULLULULRUDDDUURDRLUDUURRRRUUULLRULLLDLURUDLDDLLRRRULDLLUURDRRRDRDURURLRUDLDLURDDRLLLUUDRUULLDLLLLUUDRRURLDDUDULUDLDURDLURUURDUUUURDLLLRUUURDUUUDLDUDDLUDDUDUDUDLDUDUUULDULUURDDLRRRULLUDRRDLUDULDURUURULLLLUDDDLURURLRLRDLRULRLULURRLLRDUDUDRULLRULRUDLURUDLLDUDLRDRLRDURURRULLDDLRLDDRLRDRRDLRDDLLLLDUURRULLRLLDDLDLURLRLLDULRURRRRDULRLRURURRULULDUURRDLURRDDLDLLLRULRLLURLRLLDDLRUDDDULDLDLRLURRULRRLULUDLDUDUDDLLUURDDDLULURRULDRRDDDUUURLLDRDURUDRUDLLDRUD\r\
ULRDULURRDDLULLDDLDDDRLDUURDLLDRRRDLLURDRUDDLDURUDRULRULRULULUULLLLDRLRLDRLLLLLRLRRLRLRRRDDULRRLUDLURLLRLLURDDRRDRUUUDLDLDRRRUDLRUDDRURRDUUUDUUULRLDDRDRDRULRLLDLDDLLRLUDLLLLUURLDLRUDRLRDRDRLRULRDDURRLRUDLRLRLDRUDURLRDLDULLUUULDRLRDDRDUDLLRUDDUDURRRRDLDURRUURDUULLDLRDUDDLUDDDRRRULRLULDRLDDRUURURLRRRURDURDRULLUUDURUDRDRLDLURDDDUDDURUDLRULULURRUULDRLDULRRRRDUULLRRRRLUDLRDDRLRUDLURRRDRDRLLLULLUULRDULRDLDUURRDULLRULRLRRURDDLDLLRUUDLRLDLRUUDLDDLLULDLUURRRLRDULRLRLDRLDUDURRRLLRUUDLUURRDLDDULDLULUUUUDRRULLLLLLUULDRULDLRUDDDRDRDDURUURLURRDLDDRUURULLULUUUDDLRDULDDLULDUDRU\r\
LRLRLRLLLRRLUULDDUUUURDULLLRURLDLDRURRRUUDDDULURDRRDURLRLUDLLULDRULLRRRDUUDDRDRULLDDULLLUURDLRLRUURRRLRDLDUDLLRLLURLRLLLDDDULUDUDRDLRRLUDDLRDDURRDRDUUULLUURURLRRDUURLRDLLUDURLRDRLURUURDRLULLUUUURRDDULDDDRULURUULLUDDDDLRURDLLDRURDUDRRLRLDLRRDDRRDDRUDRDLUDDDLUDLUDLRUDDUDRUDLLRURDLRUULRUURULUURLRDULDLDLLRDRDUDDDULRLDDDRDUDDRRRLRRLLRRRUUURRLDLLDRRDLULUUURUDLULDULLLDLULRLRDLDDDDDDDLRDRDUDLDLRLUDRRDRRDRUURDUDLDDLUDDDDDDRUURURUURLURLDULUDDLDDLRUUUULRDRLUDLDDLLLRLLDRRULULRLRDURRRLDDRDDRLU";

var keyboardDimension = [5, 5];
var invalidPositions = {
    1: [1, 2, 4, 5],
    2: [1, 5],
    4: [1, 5],
    5: [1, 2, 4, 5]
};

var currentPosition = [3, 3];
var instructionLines = input.split("\r");
var answer = [];

function executeMovement(letter) {
    var nextPosition;

    switch (letter) {
        case 'U':
            nextPosition = currentPosition[0] - 1;
            if (isNextPositionValid([nextPosition, currentPosition[1]])) {
                currentPosition[0] = nextPosition;
            }
            break;
        case 'D':
            nextPosition = currentPosition[0] + 1;
            if (isNextPositionValid([nextPosition, currentPosition[1]])) {
                currentPosition[0] = nextPosition;
            }
            break;
        case 'L':
            nextPosition = currentPosition[1] - 1;
            if (isNextPositionValid([currentPosition[0], nextPosition])) {
                currentPosition[1] = nextPosition;
            }
            break;
        case 'R':
            nextPosition = currentPosition[1] + 1;
            if (isNextPositionValid([currentPosition[0], nextPosition])) {
                currentPosition[1] = nextPosition;
            }
            break;
    }
}

function isNextPositionValid(position) {
    if (position[0] < 1 || position[0] > keyboardDimension[0]) {
        return false;
    }

    if (position[1] < 1 || position[1] > keyboardDimension[1]) {
        return false;
    }

    //Look if position is within a position that is invalid
    if (position[0] in invalidPositions) {
        return invalidPositions[position[0]].filter(function (number) {
                return position[1] == number
            }).length == 0;
    }

    return true;
}

/**
 * Function To translate a position to a character.
 * It's quite inefficient (thanks to the N(2/3)), but quite dynamic
 *
 * @param position
 * @returns string as character of the converted position
 */
function positionToChar(position) {
    var counter = 0;

    loop:
        for (var i = 1; i <= keyboardDimension[0]; i++) {
            for (var j = 1; j <= keyboardDimension[1]; j++) {
                if (!(i in invalidPositions) || !invalidPositions[i].some(xPosition => xPosition == j)) {
                    counter++;
                }

                if (position[0] == i && position[1] == j) {
                    //We are at the position that is given as the parameter, stop the N(2) loop
                    // with the label
                    break loop;
                }
            }
        }

    if (counter >= 10) {
        return String.fromCharCode(65 + (counter - 10));
    }

    return counter;
}

instructionLines.forEach(function (line) {
    line.split('').forEach(function (letter) {
        executeMovement(letter);
    });

    answer[answer.length] = positionToChar(currentPosition);
});

console.log(answer.join(""));