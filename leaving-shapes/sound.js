class ShapeSound {
    constructor(freq, maxAmp, length) {
        console.log(freq, maxAmp, length);
        const osc = new p5.SinOsc(freq);
        this.osc = osc;
        if (maxAmp > 0) {
            const envelope = new p5.Env();
            // set attackTime, decayTime, sustainRatio, releaseTime
            envelope.setADSR(0.001, length, 0.1, 0.5);
            // set attackLevel, releaseLevel
            envelope.setRange(maxAmp, 0);
            osc.amp(envelope);
            osc.start();
            envelope.play();
        }
    }

    setPan(location) {
        this.osc.pan(location);
    }
}
