class Shape {
    constructor(fundamental, length, settings) {
        this.length = length;
        const harmonicNumber = int(random(settings.numHarmonics)) + 1;
        this.hue = map(harmonicNumber, 1, settings.numHarmonics, 0, 255);
        this.pitchDeviation = (1 - settings.intonation) * settings.maxPitchDeviation;
        const harmonicFreq = fundamental * harmonicNumber *
            random(1 - this.pitchDeviation, 1 + this.pitchDeviation);
        const highestFreq = fundamental * settings.numHarmonics;
        const freqs = Settings.chromaticScaleFreqs;
        const highestHarmonicOfHighestKeyFreq = freqs[freqs.length - 1] * Settings.numHarmonics;
        const x = map(harmonicFreq, freqs[0], highestHarmonicOfHighestKeyFreq,
            settings.xMargin, width - settings.xMargin * 2);
        this.pos = createVector(x, 20, 0);
        this.velocity = createVector(0, 0.5, 0);
        this.velocity.mult(5);
        const pan = map(harmonicFreq, fundamental, highestFreq, -0.8, 0.8);
        this.sound = new ShapeSound(harmonicFreq, settings.volume, pan, this.velocity.mag());
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        fill(this.hue, 100, map(this.pos.y, 0, height, 100, 20));
        box(this.length);
        pop();
    }

    move() {
        this.pos.add(this.velocity);
    }
}
