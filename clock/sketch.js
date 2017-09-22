// 3D Clock
// Inspired by The Coding Train Coding Challenge #74: Clock with p5.js, https://www.youtube.com/watch?v=E4RyStef-gY

let oscSecs;
let oscMins;

function setup() {
    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
    oscSecs = new p5.Oscillator();
    oscSecs.setType('sine');
    oscSecs.freq(880);
    oscSecs.start();
    oscMins = new p5.Oscillator();
    oscMins.setType('sine');
    oscMins.freq(440);
    oscMins.start();
}

function draw() {

    function drawTickMarks(distanceFromCenter, msAngle) {
        const numMarks = 60;
        for (let i = 0; i < numMarks; ++i) {
            push();
            const angle = i * TWO_PI / numMarks;
            const angleTurnedOneQuarter = (angle + TWO_PI / 4) % TWO_PI;
            rotateZ(angle);
            translate(-distanceFromCenter, 0, 0);
            rotateX(PI / 2); // Align with the z axis
            const raiseExtent = PI / 30;
            const markThickness = i % 5 === 0 ? 10 : 5;
            const tickDistanceFromMsPos = Math.abs(msAngle - angleTurnedOneQuarter);
            const limitedTickDistanceFromMsPos = Math.min(raiseExtent, tickDistanceFromMsPos);
            const markHeight = map(limitedTickDistanceFromMsPos, 0, raiseExtent, 50, 10);
            cylinder(markThickness, markHeight);
            pop();
        }
    }

    function drawAxle() {
        push();
        rotateX(PI / 2);
        cylinder(10, 200);
        pop();
    }

    /**
     * Draws a clock hand.
     * @param position the position (seconds, minutes, or hours. A real number.
     * @param maxUnits 60 or 12
     * @param radius the radius of the cylinder forming the hand
     * @param length the length of the cylinder
     * @param z where the hand is positioned along the z axis
     */
    function drawHand(position, maxUnits, radius, length, z) {
        push();
        rotateZ(-map(position, 0, maxUnits, 0, TWO_PI));
        translate(0, -length / 2, z);
        cylinder(radius, length);
        pop();
    }

    /** Moves the entire clock on the y axis sinusoidally, in the manner of a washing machine agitator */
    function agitateClock(cyclesPerSecond, maxRotationRadians) {
        const angleOverTime = cyclesPerSecond / 1000 * millis() * PI * 2;
        rotateY(map(Math.sin(angleOverTime), -1, 1, -maxRotationRadians, maxRotationRadians));
    }

    agitateClock(0.1, PI / 8);

    const millisecondsOfCurrentSecond = new Date().getTime() % 1000;
    oscSecs.amp(map(millisecondsOfCurrentSecond, 0, 1000, 1, 0));
    const secondPlusFraction = second() + millisecondsOfCurrentSecond / 1000;
    const minutesFraction = secondPlusFraction / 60;
    oscMins.amp(map(Math.min(1 / 12, minutesFraction), 0, 1 / 12, 1, 0));
    const minutePlusFraction = minute() + minutesFraction;
    const hourPlusFraction = hour() % 12 + minutePlusFraction / 60;

    fill(59, 71, 248);
    const msAngle = map(millisecondsOfCurrentSecond, 0, 1000, PI * 2, 0);
    drawTickMarks(width * .35, msAngle);
    fill(0);
    drawAxle();

    fill(51, 136, 217);
    drawHand(hourPlusFraction, 12, 9, width / 6, 0);
    fill(69, 233, 240);
    drawHand(minutePlusFraction, 60, 6, width / 3, 30);
    fill(51, 217, 144);
    drawHand(secondPlusFraction, 60, 3, width / 3, 60);
}
