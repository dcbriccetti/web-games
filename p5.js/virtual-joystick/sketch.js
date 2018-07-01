
function setup() {
    const c = createCanvas(400, 400, WEBGL);
    c.parent('#main');
}

function draw() {
    background(72, 181, 253);
    const stickLen = width * 0.4;
    push();
    rotateX(PI * 1.5 + sin(frameCount / 15) * PI / 8); // + map(height / 2 - mouseY, 0, height / 2, 0, PI / 8));
    translate(0, -stickLen / 2, 0);
    noStroke();
    fill(32, 81, 112);
    cylinder(stickLen / 6, stickLen);
    pop();
}
