import ShapeSound from './sound.js';

export default class Shape {
    /**
     * Creates a Shape that will play a note on a randomly chosen harmonic.
     * @param p p5
     * @param getXFromFrequency a function that calculates an x position from a frequency
     * @param fundamental the start of the harmonic series
     * @param length the length of the note, in seconds
     * @param settings settings
     */
    constructor(p, getXFromFrequency, fundamental, length, settings) {
        this.p = p;
        this.length = length;
        const harmonicNumber = p.int(p.random(settings.numHarmonics)) + 1;
        this.hue = p.map(harmonicNumber, 1, settings.numHarmonics, 0, 255);
        this.pitchDeviation = (1 - settings.intonation) * settings.maxPitchDeviation;
        const harmonicFreq = fundamental * harmonicNumber *
            p.random(1 - this.pitchDeviation, 1 + this.pitchDeviation);
        this.posX = getXFromFrequency(harmonicFreq);
        this.timePlayingMs = p.constrain(p.randomGaussian(5, 2), 2, 10) * 1000;
        this.timeStartMs = p.millis();
        const pan = settings.numHarmonics === 1 ? 0 :
            p.map(harmonicFreq, fundamental, fundamental * settings.numHarmonics, -0.8, 0.8);
        this.sound = new ShapeSound(harmonicFreq, settings, pan, this.timePlayingMs / 1000);
    }

    draw() {
        const p = this.p;
        const remainingRatio = 1 - this.completeRatio(p);
        if (remainingRatio > 0) {
            const minY = 40;
            const yRange = p.height - minY;
            const y = minY + yRange * remainingRatio;
            p.push();
            p.translate(this.posX, y, 0);
            p.fill(this.hue, 100, p.map(y, minY, p.height, 100, 10));
            p.box(this.length);
            p.pop();
        }
    }

    /** Returns how complete (from 0 to 1) the life of the shape is */
    completeRatio(p) {
        const elapsed = p.millis() - this.timeStartMs;
        const remaining = this.timePlayingMs - elapsed;
        return remaining > 0 ? remaining / this.timePlayingMs : 1;
    }
}
