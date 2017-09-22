// A very basic clock with only hands, and no color

function setup() {
    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
}

function draw() {
    function drawHand(position, maxUnits, length) {
        push();
        fill(0);
        rotateZ(-position / maxUnits * TWO_PI);
        translate(0, -length / 2);
        cylinder(5, length);
        pop();
    }

    drawHand(hour() % 12, 12, width / 6);
    drawHand(minute(), 60, width / 3);
    drawHand(second(), 60, width / 3);
}
