function setup() {
    createCanvas(document.body.clientWidth, window.innerHeight, WEBGL);
}

function draw() {
    let maxOffset = min(400, width / 2, height / 2);

    function colorPart(offset) {
        return map(offset, -maxOffset, maxOffset, 0, 255)
    }

    function forRange(fn) {
        const cubeSpacing = 100;
        for (let arg = -maxOffset; arg <= maxOffset; arg += cubeSpacing) {
            fn(arg);
        }
    }

    background(64);
    translate(0, 0, -700);
    rotateX(PI / 4);
    rotateY(millis() / 2000);
    const cosOverTime = cos(millis() / 2000);
    const changingMaxRadius = createVector(map(cosOverTime, -1, 1, maxOffset, maxOffset * 2), 0, 0);

    forRange(x => forRange(y => forRange(z => {
        let pos = createVector(x, y, z);
        const shrinkNeeded = changingMaxRadius.mag() / pos.mag();
        if (shrinkNeeded < 1) {
            pos = pos.mult(shrinkNeeded);
        }
        push();
        translate(pos.x, pos.y, pos.z);
        fill(colorPart(x), colorPart(y), colorPart(z));
        box(30);
        pop();
    })))
}
