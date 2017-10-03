// Leaving Shapes with Pleasing Sounds

Settings = {
    scaleChangeSecs:            30,
    disappearDistance:          3000,
    soundAdjustEveryNFrames:    20,
    volume:                     0.5,    // Set by slider
    numHarmonics:               8,      // Set by slider
    intonation:                 1,      // Set by slider
    keyChangeStyle:             0,      // Set by control
    creationFrequency: {
        mean:                   200,
        stdDev:                 100
    }
};

let shapes = [];
let nextShapeCreateTime;
let volumeSlider;
let intonationSlider;
let speedSlider;
let keyIndex = 0;
let nextKeyChangeTime;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    function createLabel(text, x, y) {
        const lbl = createSpan(text);
        lbl.position(x, y);
        lbl.elt.className = 'label';
        return lbl;
    }

    let y = 0;
    volumeSlider = createSlider(0, 1, 0.2, 0.05);
    volumeSlider.position(10, y += 20);
    createLabel('Volume', volumeSlider.x * 2 + volumeSlider.width, volumeSlider.y);

    numHarmonicsSlider = createSlider(1, 40, Settings.numHarmonics, 1);
    numHarmonicsSlider.position(10, y += 20);
    createLabel('Number of Harmonics', numHarmonicsSlider.x * 2 + numHarmonicsSlider.width, numHarmonicsSlider.y);

    intonationSlider = createSlider(0, 1, 1, 0.05);
    intonationSlider.position(10, y += 20);
    createLabel('Intonation', intonationSlider.x * 2 + intonationSlider.width, intonationSlider.y);

    speedSlider = createSlider(0, 1, 0.8, 0.05);
    speedSlider.position(10, y += 20);
    createLabel('Generation Speed', speedSlider.x * 2 + speedSlider.width, speedSlider.y);

    keyChangeSelect = createSelect();
    keyChangeSelect.option("Cycle of fourths");
    keyChangeSelect.option("Incremental");
    keyChangeSelect.option("Random");
    keyChangeSelect.option("None");
    keyChangeSelect.changed(() => {
       Settings.keyChangeStyle = keyChangeSelect.elt.selectedIndex;
    });
    keyChangeSelect.position(10, y += 20);
    createLabel('Key Change', keyChangeSelect.x * 2 + intonationSlider.width, keyChangeSelect.y);

    colorMode(HSB);
    nextShapeCreateTime = millis();
    nextKeyChangeTime = millis() + Settings.scaleChangeSecs * 1000;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    Settings.volume = volumeSlider.value();
    Settings.intonation = intonationSlider.value();
    Settings.numHarmonics = numHarmonicsSlider.value();

    if (millis() > nextKeyChangeTime) {
        nextKeyChangeTime = millis() + Settings.scaleChangeSecs * 1000;
        switch (keyChangeSelect.elt.selectedIndex) {
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
    background(map(keyIndex, 0, 11, 0, 40));
    let deleteIndexes = [];
    for (let i = 0; i < shapes.length; ++i) {
        const shape = shapes[i];
        shape.draw();
        shape.move();
        const distance = shape.distance();
        if (frameCount % Settings.soundAdjustEveryNFrames === 0) {
            shape.adjustSound();
        }
        if (distance > Settings.disappearDistance) {
            shape.sound.osc.stop();
            deleteIndexes.push(i);
        }
    }
    for (let i = deleteIndexes.length - 1; i >= 0; --i) {
        shapes.splice(deleteIndexes[i], 1);
    }

    if (millis() > nextShapeCreateTime) {
        shapes.push(new Shape(keyIndex, min(width, height) / 20, Settings));
        const delayMin = 100;
        const delayMax = 5000;
        const delayRange = delayMax - delayMin;
        const delay = delayMax - delayRange * speedSlider.value();
        nextShapeCreateTime = millis() + randomGaussian(
            delay, Settings.creationFrequency.stdDev);
    }
}
