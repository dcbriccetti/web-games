// Leaving Shapes with Pleasing Sounds
// Watch it being created here: https://www.youtube.com/watch?v=lLLOu-fxWTU

Settings = {
    scaleChangeSecs:            30,
    disappearDistance:          3000,
    soundAdjustEveryNFrames:    20,
    creationFrequency: {
        mean:                   200,
        stdDev:                 500
    }
};

let shapes = [];
let nextShapeCreateTime;

function setup() {
    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
    colorMode(HSB);
    nextShapeCreateTime = millis();
}

function draw() {
    const scale = int((millis() / 1000 / Settings.scaleChangeSecs)) % 12;
    background(map(scale, 0, 11, 0, 40));
    let deleteIndexes = [];
    for (let i = 0; i < shapes.length; ++i) {
        const shape = shapes[i];
        shape.draw();
        shape.move();
        const distance = shape.distance();
        if (frameCount % Settings.soundAdjustEveryNFrames === 0) {
            shape.adjustSound(distance);
        }
        if (distance > Settings.disappearDistance) {
            shape.sound.silence();
            deleteIndexes.push(i);
        }
    }
    for (let i = deleteIndexes.length - 1; i >= 0; --i) {
        shapes.splice(deleteIndexes[i], 1);
    }

    if (millis() > nextShapeCreateTime) {
        shapes.push(new Shape(scale));
        nextShapeCreateTime = millis() + randomGaussian(
            Settings.creationFrequency.mean, Settings.creationFrequency.stdDev);
    }
}
