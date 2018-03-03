function buildOctavesOfArpeggios(key) {
    const chromaticScaleFreqs = [
        65.41, 69.30, 73.42, 77.78,
        82.41, 87.31, 92.50, 98.00,
        103.83, 110.00, 116.54, 123.47
    ];
    const fundamental = chromaticScaleFreqs[key];

    function note(halfStepIndex) {
        return fundamental * Math.pow(2, halfStepIndex / 12);
    }

    const arpegTemplate = [note(0), note(4), note(7), note(10)];
    const arpeg = [];
    for (let i = 0; i <= 5; ++i) {
        const a = arpegTemplate.map(f => f * Math.pow(2, i));
        arpeg.push(...a);
    }
    return arpeg;
}

let key = 0; // 0 is C
let notes = buildOctavesOfArpeggios(key);

const osc = new p5.SinOsc();
osc.start();

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 100);
    background(0);
}

function mouseClicked() {
    // Follow the circle of fourths
    key = (key + 5) % 12;
    notes = buildOctavesOfArpeggios(key);
}

let lastFreq = 0;

function draw() {
    const ai = Math.round(map(mouseX, 0, width - 1, 0, notes.length - 1));
    const freq = notes[ai];
    if (freq !== lastFreq) {
        console.log(freq);
        lastFreq = freq;
    }
    osc.freq(freq);
    osc.amp(map(mouseY, 0, height - 1, 0.5, 0));
    noStroke();
    const hue = map(mouseX, 0, width - 1, 0, 90);
    const brightness = map(mouseY, 0, height - 1, 100, 0);
    fill(hue, 100, brightness);
    ellipse(mouseX, mouseY, 10, 10);
}
