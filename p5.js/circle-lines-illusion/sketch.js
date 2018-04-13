const DIAMETER = 40;
const RADIUS = DIAMETER / 2;
const DIAMETERS_PER_LINE = 3;
const DIAMETERS_BETWEEN_LINES = 2;
const LINE_LENGTH = DIAMETER * DIAMETERS_PER_LINE;
const NUM_SEGMENTS = DIAMETERS_PER_LINE + DIAMETERS_BETWEEN_LINES + DIAMETERS_PER_LINE + 1;
const MARGIN = 5;
let showGridLines = false;

function setup() {
    const c = createCanvas(MARGIN + DIAMETER * NUM_SEGMENTS + MARGIN, DIAMETER * 2);
    c.parent('#main');
}

function draw() {
    background(255);
    showGridLinesIfRequested();
    stroke(0);
    strokeWeight(3);
    noFill();

    function drawCircleLeftOrRight(direction) {
        ellipse(x + RADIUS * direction, y, DIAMETER);
    }

    function drawLine() {
        line(x, y, x + LINE_LENGTH - 1, y);
    }

    const y = height / 2;
    let x = MARGIN;
    drawLine();
    drawCircleLeftOrRight(1);

    x += LINE_LENGTH; // Move right to the end of the first line
    drawCircleLeftOrRight(-1);

    x += DIAMETERS_BETWEEN_LINES * DIAMETER; // Leave a two-diameter space between the lines
    drawLine();
    drawCircleLeftOrRight(-1);

    x += LINE_LENGTH;
    drawCircleLeftOrRight(1);
}

function keyPressed() {
    if (key === ' ')
        showGridLines = !showGridLines;
}

function showGridLinesIfRequested() {
    if (showGridLines) {
        stroke(180);
        strokeWeight(1);
        for (let i = 0; i <= NUM_SEGMENTS; ++i) {
            const x = MARGIN + i * DIAMETER;
            line(x, 0, x, height);
        }
    }
}
