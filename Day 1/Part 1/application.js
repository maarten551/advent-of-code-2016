var input = "L2, L5, L5, R5, L2, L4, R1, R1, L4, R2, R1, L1, L4, R1, L4, L4, R5, R3, R1, L1, R1, L5, L1, R5, L4, R2, L5, L3, L3, R3, L3, R4, R4, L2, L5, R1, R2, L2, L1, R3, R4, L193, R3, L5, R45, L1, R4, R79, L5, L5, R5, R1, L4, R3, R3, L4, R185, L5, L3, L1, R5, L2, R1, R3, R2, L3, L4, L2, R2, L3, L2, L2, L3, L5, R3, R4, L5, R1, R2, L2, R4, R3, L4, L3, L1, R3, R2, R1, R1, L3, R4, L5, R2, R1, R3, L3, L2, L2, R2, R1, R2, R3, L3, L3, R4, L4, R4, R4, R4, L3, L1, L2, R5, R2, R2, R2, L4, L3, L4, R4, L5, L4, R2, L4, L4, R4, R1, R5, L2, L4, L5, L3, L2, L4, L4, R3, L3, L4, R1, L2, R3, L2, R1, R2, R5, L4, L2, L1, L3, R2, R3, L2, L1, L5, L2, L1, R4";
var commandos = String.split(input, ", ");

var currentDirection = 0;
var currentPosition = [0, 0];

commandos.forEach(commando => parseCommando(commando));

console.log("Answer: " + (Math.abs(currentPosition[0]) + Math.abs(currentPosition[1])));

function parseCommando(commando) {
	var directionAdjustment = (commando.substr(0, 1) == "L") ? -90 : 90;
	var amountOfSteps = parseInt(commando.substr(1, commando.length-1));
	currentDirection = parseInt(correctDirection(parseInt(currentDirection + parseInt(directionAdjustment))));
	
	if (currentDirection % 180 == 0)
		currentPosition[0] += (currentDirection == 0) ? amountOfSteps : -amountOfSteps;
	else
		currentPosition[1] += (currentDirection == 90) ? amountOfSteps : -amountOfSteps;
}

function correctDirection(direction) {
	direction = parseInt(direction)
	if (direction >= 360)
		return correctDirection(direction - 360);
	
	if (direction < 0)
		return correctDirection(360 + direction);
	
	return direction;
}