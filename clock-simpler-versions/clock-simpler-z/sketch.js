// This version adds color mouse-controlled rotation

State = {
    hourMarkThickness:      10,
    minuteMarkThickness:    5,
    markHeight:             10,
    axleThickness:          10,
    axleLength:             200,
    mouseHasMoved:          false // Whether the mouse has moved since the program started
};

function setup() {
    State.colors = { // Set this here because the color function isn’t available before
        ticks: color(59, 71, 248),
        hour:  color(51, 136, 217),
        min:   color(69, 233, 240),
        sec:   color(51, 217, 144)
    };

    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
}

function draw() {
    /**
     * Draws tick marks along the circumference of the clock.
     * @param radius the radius of the circle along which the marks are drawn
     */
    function drawTickMarks(radius) {
        fill(State.colors.ticks);

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

    /**
     * Draws a clock hand.
     * @param position the position (seconds, minutes, or hours). A real number.
     * @param maxUnits 60 or 12
     * @param radius the radius of the cylinder forming the hand
     * @param length the length of the cylinder
     * @param color the color of the cylinder
     * @param z where the hand is positioned along the z axis
     */
    function drawHand(position, maxUnits, radius, length, color, z) {
        push();
        fill(color);
        rotateZ(-position / maxUnits * TWO_PI);
        translate(0, -length / 2, z);
        cylinder(radius, length);
        pop();
    }

    function rotateClockWithMouse(maxRotationRadians) {
        function angleFromMouse(mousePos) {
            return map(mousePos, 0, width - 1, -maxRotationRadians, maxRotationRadians);
        }
        rotateY(angleFromMouse(mouseX));
        rotateX(angleFromMouse(mouseY));
    }

    if (State.mouseHasMoved) { // Only rotate to mouse position if mouse has been moved since we started
        rotateClockWithMouse(PI / 4);
    }

    drawTickMarks(width * 0.35);
    drawAxle();

    const msAfterCurrentSecond = new Date().getTime() % 1000;
    const secondPlusFraction = second() + msAfterCurrentSecond / 1000;
    const minutePlusFraction = minute() + secondPlusFraction / 60;
    const hourPlusFraction = hour() % 12 + minutePlusFraction / 60;

    drawHand(hourPlusFraction,   12, 9, width / 6, State.colors.hour, 0);
    drawHand(minutePlusFraction, 60, 6, width / 3, State.colors.min, 30);
    drawHand(secondPlusFraction, 60, 3, width / 3, State.colors.sec, 60);
}

function mouseMoved() {
    State.mouseHasMoved = true;
}