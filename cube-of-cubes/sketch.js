let speedSlider;
let boxSizeSlider;
let rotAngle = 0;

function setup() {
    createCanvas(document.body.clientWidth, window.innerHeight, WEBGL);

    function createLabel(text, x, y) {
        const lbl = createSpan(text);
        lbl.position(x, y);
        lbl.elt.className = 'label';
        return lbl;
    }

    speedSlider = createSlider(1, 60, 5, 1);
    speedSlider.position(10, 20);
    createLabel('RPM', speedSlider.x * 2 + speedSlider.width, speedSlider.y);

    boxSizeSlider = createSlider(50, 400, 100, 1);
    boxSizeSlider.position(10, 50);
    createLabel("Size", boxSizeSlider.x * 2 + boxSizeSlider.width, boxSizeSlider.y);
}

function draw() {
    let maxOffset = width / 2;

    function colorPart(offset) {
        return map(offset, -maxOffset, maxOffset, 0, 255)
    }

    function forRange(fn) {
        const cubeSpacing = boxSizeSlider.value() * 1.2;
        for (let arg = -maxOffset; arg <= maxOffset; arg += cubeSpacing) {
            fn(arg);
        }
    }

    function setNextRotationChange() {
        const rpm = speedSlider.value();
        const rps = rpm / 60.0;
        const rpFrame = rps / (frameCount === 1 ? 1 : frameRate());
        rotAngle = (rotAngle + rpFrame * TWO_PI) % TWO_PI;
    }

    translate(0, 0, -1500);
    rotateX(PI / 4);
    rotateY(rotAngle);
    setNextRotationChange();

    const edgeLength = boxSizeSlider.value();
    forRange(x => forRange(y => forRange(z => {
        push();
        translate(x, y, z);
        fill(colorPart(x), colorPart(y), colorPart(z));
        box(edgeLength);
        pop();
    })))
}
