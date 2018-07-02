// Virtual Joystick

/** Whether mouse movements move the joystick */
let movable = false;
/** The maximum stick deflection angle, in radians */
const MAX_DEFLECT = Math.PI / 8;

/** p5.js */
function setup() {
    createCanvas(400, 400, WEBGL).parent('#canvas');
}

/** p5.js */
function draw() {
    background(6, 0, 163);
    const stickLen = width * 0.45;

    ambientLight(128);
    directionalLight(255, 255, 255, 0, 0, -1);  // A white light from behind the viewer
    ambientMaterial(192);

    sphere(70);

    rotateX(-PI / 2);
    if (movable) {
        rotateX(map(mouseYRatio(), -1, 1, -MAX_DEFLECT, MAX_DEFLECT));
        rotateZ(map(mouseXRatio(), -1, 1, -MAX_DEFLECT, MAX_DEFLECT));
    }
    translate(0, -stickLen / 2, 0);
    noStroke();
    cylinder(stickLen / 5, stickLen);
}

/** Returns the mouse x position as a number between -1 and 1 */
function mouseXRatio() {
    return mouseRatio(mouseX, width / 2);
}

/** Returns the mouse y position as a number between -1 and 1 */
function mouseYRatio() {
    return -mouseRatio(mouseY, height / 2);
}

/**
 * Takes the mouse value in pixels, translates it to the center, constrains it to within the canvas dimensions, and
 * returns the position as a number between -1 and 1.
 *
 * @param mouse either mouseX or mouseY
 * @param half half of either the width or height
 * @returns the position as a number between -1 and 1
 */
function mouseRatio(mouse, half) {
    const mouseFromCenter = mouse - half;
    return constrain(mouseFromCenter, -half, half) / half;
}

/**
 * Updates the mouse position display on the web page, and allows the joystick to be moved only after the mouse
 * is moved to the center of the joystick (this prevents the stick from jumping to an extreme position
 * when the mouse pointer move is from an edge).
 */
function mouseMoved() {
    const x = mouseXRatio();
    const y = mouseYRatio();
    const activationZone = 0.2;

    if (!movable && dist(x, y, 0, 0) < activationZone) {
        movable = true;
        select('#xy').removeClass('invisible');
    }

    if (movable) {
        select('#x').html(x.toFixed(3));
        select('#y').html(y.toFixed(3));
    }
}
