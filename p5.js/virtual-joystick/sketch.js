let movable = false;

function setup() {
    const c = createCanvas(400, 400, WEBGL);
    c.parent('#main');
}

function getDisplacement(halfDistance, mouse) {
    return constrain(halfDistance - mouse, -halfDistance, halfDistance);
}

function draw() {
    background(0);
    const stickLen = width * 0.45;
    const halfHeight = height / 2;
    const halfWidth = width / 2;
    const mouseDisplacementX = getDisplacement(halfWidth, mouseX);
    const mouseDisplacementY = getDisplacement(halfHeight, mouseY);

    ambientLight(100);
    directionalLight(255, 255, 255, -width / 4, -height / 4, 0);
    ambientMaterial(255, 0, 0);

    rotateX(PI * 1.5);
    if (movable) {
        rotateX(map(mouseDisplacementY, 0, halfHeight, 0, PI / 8));
        rotateZ(map(mouseDisplacementX, -halfWidth, halfWidth, PI / 8, -PI / 8));
    }
    translate(0, -stickLen / 2, 0);
    noStroke();
    cylinder(stickLen / 6, stickLen);
}

function mouseMoved() {
    if (!movable && dist(mouseX, mouseY, width / 2, height / 2) < width / 4)
        movable = true;
}
