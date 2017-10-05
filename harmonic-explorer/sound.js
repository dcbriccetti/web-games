export default class ShapeSound {
    constructor(frequency, settings, pan, noteLength) {
        const osc = new p5.Oscillator(frequency);
        this.osc = osc;
        if (settings.vibratoDepth > 0) {
            const oscVibrato = new p5.Oscillator(settings.vibratoFreq);
            this.oscVibrato = oscVibrato;
            oscVibrato.setType(settings.waves[settings.vibratoWaveType]);
            oscVibrato.amp(frequency * 1/12 * settings.vibratoDepth);
            oscVibrato.disconnect();
            osc.freq(oscVibrato);
        } else {
            this.oscVibrato = null;
        }
        this.osc = osc;
        if (settings.volume > 0) {
            const envelope = new p5.Env();
            // set attackTime, decayTime, sustainRatio, releaseTime
            envelope.setADSR(0.001, noteLength, 0.1, 0.5);
            // set attackLevel, releaseLevel
            envelope.setRange(settings.volume, 0);
            osc.setType(settings.waves[settings.waveType]);
            osc.amp(envelope);
            osc.pan(pan);
            if (this.oscVibrato) {
                this.oscVibrato.start();
            }
            osc.start();
            envelope.play();
        }
    }

    stop() {
        this.osc.stop();
        if (this.oscVibrato) {
            this.oscVibrato.stop();
        }
    }
}
