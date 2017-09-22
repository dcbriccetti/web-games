// This version adds smooth motion and different hand thicknesses

function setup() {
    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
}

function draw() {
    function drawHand(position, maxUnits, radius, length, z) {
        push();
        fill(0);
        rotateZ(-position / maxUnits * TWO_PI);
        translate(0, -length / 2, z);
        cylinder(radius, length);
        pop();
    }

    const msAfterCurrentSecond = new Date().getTime() % 1000;
    const secondPlusFraction = second() + msAfterCurrentSecond / 1000;
    const minutePlusFraction = minute() + secondPlusFraction / 60;
    const hourPlusFraction = hour() % 12 + minutePlusFraction / 60;

    drawHand(hourPlusFraction,   12, 9, width / 6, 0);
    drawHand(minutePlusFraction, 60, 6, width / 3, 30);
    drawHand(secondPlusFraction, 60, 3, width / 3, 60);
}
