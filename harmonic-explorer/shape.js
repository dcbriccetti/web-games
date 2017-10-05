import ShapeSound from './sound.js';

export default class Shape {
    constructor(p, getHarmonicX, fundamental, length, settings) {
        this.p = p;
        this.length = length;
        const harmonicNumber = p.int(p.random(settings.numHarmonics)) + 1;
        this.hue = p.map(harmonicNumber, 1, settings.numHarmonics, 0, 255);
        this.pitchDeviation = (1 - settings.intonation) * settings.maxPitchDeviation;
        const harmonicFreq = fundamental * harmonicNumber *
            p.random(1 - this.pitchDeviation, 1 + this.pitchDeviation);
        this.pos = p.createVector(getHarmonicX(harmonicFreq), 20, 0);
        this.velocity = p.createVector(0, 0.5, 0);
        this.velocity.mult(5);
        const pan = settings.numHarmonics === 1 ? 0 :
            p.map(harmonicFreq, fundamental, fundamental * settings.numHarmonics, -0.8, 0.8);
        this.sound = new ShapeSound(harmonicFreq, settings, pan, this.velocity.mag());
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
