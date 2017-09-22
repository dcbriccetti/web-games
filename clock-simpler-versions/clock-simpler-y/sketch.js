// This version adds tick marks, and an axle, and a State object

State = {
    hourMarkThickness:      10,
    minuteMarkThickness:    5,
    markHeight:             10,
    axleThickness:          10,
    axleLength:             200,
};

function setup() {
    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
}

function draw() {
    /**
     * Draws tick marks along the circumference of the clock.
     * @param radius the radius of the circle along which the marks are drawn
     */
    function drawTickMarks(radius) {
        fill(0);

        for (let tickIndex = 0; tickIndex < 60; ++tickIndex) {
            push();
            rotateZ(tickIndex * TWO_PI / 60);
            translate(radius, 0, 0);
            rotateX(PI / 2); // Align with the z axis
            const markThickness = tickIndex % (60 / 12) === 0 ?
                State.hourMarkThickness : State.minuteMarkThickness;
            cylinder(markThickness, State.markHeight);
            pop();
        }
    }

    function drawAxle() {
        push();
        rotateX(PI / 2); // Align with the z axis
        cylinder(State.axleThickness, State.axleLength);
        pop();
    }

    function drawHand(position, maxUnits, radius, length, z) {
        push();
        fill(0);
        rotateZ(-position / maxUnits * TWO_PI);
        translate(0, -length / 2, z);
        cylinder(radius, length);
        pop();
    }

    drawTickMarks(width * 0.35);
    drawAxle();

    const msAfterCurrentSecond = new Date().getTime() % 1000;
    const secondPlusFraction = second() + msAfterCurrentSecond / 1000;
    const minutePlusFraction = minute() + secondPlusFraction / 60;
    const hourPlusFraction = hour() % 12 + minutePlusFraction / 60;

    drawHand(hourPlusFraction, 12, 9, width / 6, 0);
    drawHand(minutePlusFraction, 60, 6, width / 3, 30);
    drawHand(secondPlusFraction, 60, 3, width / 3, 60);
}
