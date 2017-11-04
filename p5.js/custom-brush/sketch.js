let autoRotate = false;
let manualRotationAngle = 0;
let autoHue = true;
let manualHue = 0;

function setup() {
    createCanvas(innerWidth, innerHeight);
    colorMode(HSB);
    angleMode(DEGREES);
    background(0);
}

function draw() {
    if (mouseIsPressed) {
        background(0);
    }
    noStroke();
    const hue = autoHue ? frameCount % 360 : manualHue;
    fill(hue, 100, 100);
    translate(mouseX, mouseY);
    rotate(autoRotate ? frameCount : manualRotationAngle);
    const brushWidth = 100;
    const bristleSeparation = 3;
    for (let xo = -brushWidth / 2; xo <= brushWidth / 2; xo += bristleSeparation) {
        ellipse(xo, 0, 2, 2);
    }
}

function keyPressed(event) {
    switch (event.key) {
        case 'H':
            autoHue = ! autoHue;
            break;
        case 'h':
            autoHue = false;
            manualHue += 15;
            break;
        case 'R':
            autoRotate = ! autoRotate;
            break;
        case 'r':
            autoRotate = false;
            manualRotationAngle += 15;
            break;
        default:
            break;
    }
}
