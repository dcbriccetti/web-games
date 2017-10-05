export default class ShapeSound {
    constructor(frequency, maxAmplitude, pan, noteLength) {
        const osc = new p5.SinOsc(frequency);
        this.osc = osc;
        if (maxAmplitude > 0) {
            const envelope = new p5.Env();
            // set attackTime, decayTime, sustainRatio, releaseTime
            envelope.setADSR(0.001, noteLength, 0.1, 0.5);
            // set attackLevel, releaseLevel
            envelope.setRange(maxAmplitude, 0);
            osc.amp(envelope);
            osc.pan(pan);
            osc.start();
            envelope.play();
        }
    }
}
