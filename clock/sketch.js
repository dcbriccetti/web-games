// 3D Clock
// Inspired by The Coding Train Coding Challenge #74: Clock with p5.js, https://www.youtube.com/watch?v=E4RyStef-gY

function setup() {
    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
}

function draw() {

    function drawHourMarks(distanceFromCenter) {
        const numHours = 12;
        for (let i = 0; i < numHours; ++i) {
            push();
            rotateZ(i * TWO_PI / numHours);
            translate(-distanceFromCenter, 0, 0);
            rotateX(PI / 2); // Align with the z axis
            cylinder(10, 50);
            pop();
        }
    }

    function drawAxle() {
        push();
        rotateX(PI / 2);
        cylinder(10, 150);
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
    function agitateWorld(cyclesPerSecond, maxRotationRadians) {
        const angleOverTime = cyclesPerSecond / 1000 * millis() * PI * 2;
        rotateY(map(Math.sin(angleOverTime), -1, 1, -maxRotationRadians, maxRotationRadians));
    }

    agitateWorld(0.2, PI / 8);

    const millisecondsOfCurrentSecond = new Date().getTime() % 1000;
    const secondPlusFraction = second() + millisecondsOfCurrentSecond / 1000;
    const minutePlusFraction = minute() + secondPlusFraction / 60;
    const hourPlusFraction = hour() % 12 + minutePlusFraction / 60;

    fill(255, 203, 68);
    drawHourMarks(width * .35);
    fill(0);
    drawAxle();

    fill(31, 130, 27);
    drawHand(hourPlusFraction,  12, 9, width / 6, 0);
    fill(108, 161, 150);
    drawHand(minutePlusFraction, 60, 6, width / 3, 30);
    fill(240, 240, 86);
    drawHand(secondPlusFraction, 60, 3, width / 3, 60);
}
