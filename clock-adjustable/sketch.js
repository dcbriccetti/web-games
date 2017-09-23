function setup() {
    const canvas = createCanvas(600, 600);
    canvas.parent('container');
    angleMode(DEGREES);
}

function draw() {
    background(255);
    translate(width / 2, height / 2);
    const colorful = select('#colorful').checked();
    const handColor = colorful ? color(255, 100, 100) : color(0, 0, 0);
    stroke(handColor);
    rotate(second() / 60 * 360);
    line(0, 0, width / 2, 0);
}
