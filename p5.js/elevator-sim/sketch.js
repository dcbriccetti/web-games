const FLOOR1 = 200;
const FLOOR2 = -200;
const CAR = {width: 50, height: 100, depth: 50};
const DOOR = {width: CAR.width / 2, height: CAR.height, depth: 5};
let carY = FLOOR1;
let doorOpen = 0;  // 0…1 = closed…open

function setup() {
    createCanvas(400, 600, WEBGL);
}

function draw() {
    background(240);
    translate(0, carY, 0);
    drawCar();
    drawDoors();

    if (millis() > 5000) {
        if (carY > FLOOR2)
            carY -= 2;  // Raise car
        else if (doorOpen < 1)
            doorOpen += 0.01;  // Open doors
    }
}

function drawCar() {
    stroke('silver');
    strokeWeight(2);
    fill('rgba(75%, 75%, 100%, 0.2)');
    box(CAR.width, CAR.height, CAR.depth);
}

function drawDoors() {
    strokeWeight(1);
    fill('rgba(75%, 100%, 75%, 0.5)');

    // Bring doors to front of car
    translate(0, 0, CAR.depth / 2 - DOOR.depth);
    const doorTravel = CAR.width / 2;
    const xDoorDisplacement = CAR.width / 4 + doorTravel * doorOpen;

    [1, -1].forEach(sign => {
        push();
        translate(sign * xDoorDisplacement, 0, 0);
        box(DOOR.width, DOOR.height, DOOR.depth);
        pop();
    });
}
