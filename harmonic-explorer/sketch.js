// Harmonic Cubes

import Shape from './shape.js';

new p5(p => {
    const Settings = {
        scaleChangeSecs:            15,
        disappearDistance:          3000,
        volume:                     0.2,    // Set by slider
        vibratoDepth:               0.1,    // Set by slider
        vibratoFreq:                5,      // Set by slider
        numHarmonics:               8,      // Set by slider
        intonation:                 1,      // Set by slider
        speed:                      0.8,    // Set by slider
        keyChangeStyle:             0,      // Set by control
        waveType:                   0,      // Set by control
        vibratoWaveType:            0,      // Set by control
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
        keyNames:                   'C D♭ D E♭ E F G♭ G A♭ A B♭ B'.split(' '),
        xMargin:                    40,
        waves:                      ['sine', 'triangle', 'sawtooth', 'square']
    };

    /**
     * Calculates the x coordinate from a harmonic frequency, considering the entire
     * range of frequencies produced in the program.
     * @param harmonicFreq the frequency from which the x coordinate is to be calculated
     * @returns the x coordinate
     */
    function getHarmonicX(harmonicFreq) {
        const freqs = Settings.chromaticScaleFreqs;
        const lowestKeyFundamental = freqs[0];
        const highestKeyFundamental = freqs[freqs.length - 1];
        const highestHarmonicOfHighestKey =
            highestKeyFundamental * Settings.numHarmonics;

        return p.map(harmonicFreq, lowestKeyFundamental, highestHarmonicOfHighestKey,
            Settings.xMargin, p.width - Settings.xMargin * 2);
    }

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
            p.push();
            p.translate(getHarmonicX(harmonicFreq), 0, 0);
            p.fill(0, 0, 32);
            p.plane(2, p.height * 2);
            p.pop();
        }
    }

    function createKnobs() {
        const volume = p.select('#volume');
        volume.value(Settings.volume);
        volume.changed(() => Settings.volume = volume.value());

        function addWaveTypes(select) {
            Settings.waves.forEach(wave => {
                select.option(wave.charAt(0).toUpperCase() + wave.slice(1));
            })
        }
        const wave = p.createSelect(); // Using select resulted in a p5 error
        addWaveTypes(wave);
        wave.parent('#waveParent');
        wave.changed(() => Settings.waveType = wave.elt.selectedIndex);

        const vibratoDepth = p.select('#vibratoDepth');
        vibratoDepth.value(Settings.vibratoDepth);
        vibratoDepth.changed(() => Settings.vibratoDepth = vibratoDepth.value());
        const numHarmonics = p.select('#numHarmonics');

        const vibratoFreq = p.select('#vibratoFreq');
        vibratoFreq.value(Settings.vibratoFreq);
        vibratoFreq.changed(() => Settings.vibratoFreq = vibratoFreq.value());

        const vibratoWave = p.createSelect(); // Using select resulted in a p5 error
        addWaveTypes(vibratoWave);
        vibratoWave.parent('#vibratoWaveParent');
        vibratoWave.changed(() => Settings.vibratoWaveType = vibratoWave.elt.selectedIndex);

        numHarmonics.value(Settings.numHarmonics);
        numHarmonics.changed(() => Settings.numHarmonics = numHarmonics.value());

        const intonation = p.select('#intonation');
        intonation.value(Settings.intonation);
        intonation.changed(() => Settings.intonation = intonation.value());

        const speed = p.select('#speed');
        speed.value(Settings.speed);
        speed.changed(() => Settings.speed = speed.value());

        const keyChange = p.createSelect(); // Using select resulted in a p5 error
        keyChange.option("Cycle of fourths");
        keyChange.option("Incremental");
        keyChange.option("Random");
        keyChange.option("None");
        keyChange.parent('#keyChangeParent');
        keyChange.changed(() => Settings.keyChangeStyle = keyChange.elt.selectedIndex);

        displayKey();
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
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
                    keyIndex = p.int(p.random(12));
                    break;
                default:
                // Don’t change the key
            }
            displayKey();
        }
    }

    function displayKey() {
        p.select('#key').elt.textContent = Settings.keyNames[keyIndex];
    }

    function createNewShapeIfTime() {
        if (p.millis() > nextShapeCreateTime) {
            shapes.push(new Shape(p, getHarmonicX,
                Settings.chromaticScaleFreqs[keyIndex], p.width / 40, Settings));
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
                shape.sound.stop();
                deleteIndexes.push(i);
            }
        }
        for (let i = deleteIndexes.length - 1; i >= 0; --i) {
            shapes.splice(deleteIndexes[i], 1);
        }
    }
});
