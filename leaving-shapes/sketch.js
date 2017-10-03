// Leaving Shapes with Pleasing Sounds

Settings = {
    scaleChangeSecs:            30,
    disappearDistance:          3000,
    soundAdjustEveryNFrames:    20,
    volume:                     0.5,    // Set by slider
    numHarmonics:               8,      // Set by slider
    intonation:                 1,      // Set by slider
    speed:                      0.8,    // Set by slider
    keyChangeStyle:             0,      // Set by control
    creationFrequency: {
        mean:                   200,
        stdDev:                 100
    }
};

let shapes = [];
let nextShapeCreateTime;
let keyIndex = 0;
let nextKeyChangeTime;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    createKnobs();
    colorMode(HSB);
    nextShapeCreateTime = millis();
    nextKeyChangeTime = millis() + Settings.scaleChangeSecs * 1000;
}

function draw() {
    changeKeyIfNeeded();
    background(map(keyIndex, 0, 11, 0, 40));
    shapes.forEach(shape => {
        shape.draw();
        shape.move();
        if (frameCount % Settings.soundAdjustEveryNFrames === 0) {
            shape.adjustSound();
        }
    });
    removeDistantShapes();
    createNewShapeIfTime();
}

function createKnobs() {
    function createLabel(text, x, y) {
        const lbl = createSpan(text);
        lbl.position(x, y);
        lbl.elt.className = 'label';
        return lbl;
    }

    let y = 0;
    const volume = createSlider(0, 1, 0.2, 0.05);
    volume.changed(() => Settings.volume = volume.value());
    volume.position(10, y += 20);
    createLabel('Volume', volume.x * 2 + volume.width, volume.y);

    const numHarmonics = createSlider(1, 40, Settings.numHarmonics, 1);
    numHarmonics.changed(() => Settings.numHarmonics = numHarmonics.value());
    numHarmonics.position(10, y += 20);
    createLabel('Number of Harmonics', numHarmonics.x * 2 + numHarmonics.width, numHarmonics.y);

    const intonation = createSlider(0, 1, 1, 0.05);
    intonation.changed(() => Settings.intonation = intonation.value());
    intonation.position(10, y += 20);
    createLabel('Intonation', intonation.x * 2 + intonation.width, intonation.y);

    const speed = createSlider(0, 1, Settings.speed, 0.05);
    speed.changed(() => Settings.speed = speed.value());
    speed.position(10, y += 20);
    createLabel('Generation Speed', speed.x * 2 + speed.width, speed.y);

    const keyChange = createSelect();
    keyChange.option("Cycle of fourths");
    keyChange.option("Incremental");
    keyChange.option("Random");
    keyChange.option("None");
    keyChange.changed(() => Settings.keyChangeStyle = keyChange.elt.selectedIndex);
    keyChange.position(10, y += 20);
    createLabel('Key Change', keyChange.x * 2 + intonation.width, keyChange.y);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function changeKeyIfNeeded() {
    if (millis() > nextKeyChangeTime) {
        nextKeyChangeTime = millis() + Settings.scaleChangeSecs * 1000;
        switch (Settings.keyChangeStyle) {
            case 0:
                keyIndex = (keyIndex + 5) % 12;
                break;
            case 1:
                keyIndex = (keyIndex + 1) % 12;
                break;
            case 2:
                keyIndex = int(random(12));
                break;
            default:
            // Don’t change the key
        }
    }
}

function createNewShapeIfTime() {
    if (millis() > nextShapeCreateTime) {
        shapes.push(new Shape(keyIndex, min(width, height) / 20, Settings));
        const delayMin = 100;
        const delayMax = 5000;
        const delayRange = delayMax - delayMin;
        const delay = delayMax - delayRange * Settings.speed;
        nextShapeCreateTime = millis() + randomGaussian(delay, Settings.creationFrequency.stdDev);
    }
}

function removeDistantShapes() {
    let deleteIndexes = [];
    for (let i = 0; i < shapes.length; ++i) {
        const shape = shapes[i];
        if (shape.pos.mag() > Settings.disappearDistance) {
            shape.sound.osc.stop();
            deleteIndexes.push(i);
        }
    }
    for (let i = deleteIndexes.length - 1; i >= 0; --i) {
        shapes.splice(deleteIndexes[i], 1);
    }
}
