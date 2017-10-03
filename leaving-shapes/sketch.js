// Harmonic Cubes

new p5(p => {
    Settings = {
        scaleChangeSecs:            15,
        disappearDistance:          3000,
        volume:                     0.5,    // Set by slider
        numHarmonics:               8,      // Set by slider
        intonation:                 1,      // Set by slider
        speed:                      0.8,    // Set by slider
        keyChangeStyle:             0,      // Set by control
        maxPitchDeviation:          0.1,
        creationFrequency: {
            mean:                   200,
            stdDev:                 100
        },
        chromaticScaleFreqs: [
            65.41, 69.30, 73.42, 77.78,
            82.41, 87.31, 92.50, 98.00,
            103.83, 110.00, 116.54, 123.47
        ],
        xMargin:                    40
    };

    let shapes = [];
    let nextShapeCreateTime;
    let keyIndex = 0;
    let nextKeyChangeTime;

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        createKnobs();
        p.colorMode(p.HSB);
        nextShapeCreateTime = p.millis();
        nextKeyChangeTime = p.millis() + Settings.scaleChangeSecs * 1000;
    };

    p.draw = function() {
        changeKeyIfNeeded();
        p.background(0);
        p.translate(-p.width / 2, p.height / 2, 0);
        p.scale(1, -1, 1);
        drawHarmonicPaths();
        shapes.forEach(shape => {
            shape.draw();
            shape.move();
        });
        removeDistantShapes();
        createNewShapeIfTime();
    };

    function drawHarmonicPaths() {
        for (let hi = 1; hi <= Settings.numHarmonics; ++hi) {
            const freqs = Settings.chromaticScaleFreqs;
            const fundamental = freqs[keyIndex];
            const harmonicFreq = fundamental * hi;
            const highestHarmonicOfHighestKeyFreq = freqs[freqs.length - 1] * Settings.numHarmonics;
            const x = p.map(harmonicFreq, freqs[0], highestHarmonicOfHighestKeyFreq,
                Settings.xMargin, p.width - Settings.xMargin * 2);
            p.push();
            p.translate(x, 0, 0);
            p.fill(0, 0, 32);
            p.plane(2, p.height * 2);
            p.pop();
        }
    }

    function createKnobs() {
        function createLabel(text, x, y) {
            const lbl = p.createSpan(text);
            lbl.position(x, y);
            lbl.elt.className = 'label';
            return lbl;
        }

        let y = 0;
        const volume = p.createSlider(0, 1, 0.2, 0.05);
        volume.changed(() => Settings.volume = volume.value());
        volume.position(10, y += 20);
        createLabel('Volume', volume.x * 2 + volume.width, volume.y);

        const numHarmonics = p.createSlider(1, 40, Settings.numHarmonics, 1);
        numHarmonics.changed(() => Settings.numHarmonics = numHarmonics.value());
        numHarmonics.position(10, y += 20);
        createLabel('Number of Harmonics', numHarmonics.x * 2 + numHarmonics.width, numHarmonics.y);

        const intonation = p.createSlider(0, 1, 1, 0.05);
        intonation.changed(() => Settings.intonation = intonation.value());
        intonation.position(10, y += 20);
        createLabel('Intonation', intonation.x * 2 + intonation.width, intonation.y);

        const speed = p.createSlider(0, 1, Settings.speed, 0.05);
        speed.changed(() => Settings.speed = speed.value());
        speed.position(10, y += 20);
        createLabel('Generation Speed', speed.x * 2 + speed.width, speed.y);

        const keyChange = p.createSelect();
        keyChange.option("Cycle of fourths");
        keyChange.option("Incremental");
        keyChange.option("Random");
        keyChange.option("None");
        keyChange.changed(() => Settings.keyChangeStyle = keyChange.elt.selectedIndex);
        keyChange.position(10, y += 20);
        createLabel('Key Change', keyChange.x * 2 + intonation.width, keyChange.y);
    }

    p.windowResized = function() {
        resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function changeKeyIfNeeded() {
        if (p.millis() > nextKeyChangeTime) {
            nextKeyChangeTime = p.millis() + Settings.scaleChangeSecs * 1000;
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
        if (p.millis() > nextShapeCreateTime) {
            shapes.push(new Shape(p, Settings.chromaticScaleFreqs[keyIndex], p.width / 40, Settings));
            const delayMin = 100;
            const delayMax = 5000;
            const delayRange = delayMax - delayMin;
            const delay = delayMax - delayRange * Settings.speed;
            nextShapeCreateTime = p.millis() + p.randomGaussian(delay, Settings.creationFrequency.stdDev);
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
});
