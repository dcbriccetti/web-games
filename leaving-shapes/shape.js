import ShapeSound from './sound.js';

export default class Shape {
    constructor(p, fundamental, length, settings) {
        this.p = p;
        this.length = length;
        const harmonicNumber = p.int(p.random(settings.numHarmonics)) + 1;
        this.hue = p.map(harmonicNumber, 1, settings.numHarmonics, 0, 255);
        this.pitchDeviation = (1 - settings.intonation) * settings.maxPitchDeviation;
        const harmonicFreq = fundamental * harmonicNumber *
            p.random(1 - this.pitchDeviation, 1 + this.pitchDeviation);
        const highestFreq = fundamental * settings.numHarmonics;
        const freqs = settings.chromaticScaleFreqs;
        const highestHarmonicOfHighestKeyFreq = freqs[freqs.length - 1] * settings.numHarmonics;
        const x = p.map(harmonicFreq, freqs[0], highestHarmonicOfHighestKeyFreq,
            settings.xMargin, p.width - settings.xMargin * 2);
        this.pos = p.createVector(x, 20, 0);
        this.velocity = p.createVector(0, 0.5, 0);
        this.velocity.mult(5);
        const pan = p.map(harmonicFreq, fundamental, highestFreq, -0.8, 0.8);
        this.sound = new ShapeSound(harmonicFreq, settings.volume, pan, this.velocity.mag());
    }

    draw() {
        const p = this.p;
        p.push();
        p.translate(this.pos.x, this.pos.y, this.pos.z);
        p.fill(this.hue, 100, p.map(this.pos.y, 0, p.height, 100, 20));
        p.box(this.length);
        p.pop();
    }

    move() {
        this.pos.add(this.velocity);
    }
}
