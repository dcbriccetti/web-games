export default class ShapeSound {

    constructor(frequency, settings, pan, noteLength) {
        const osc = this.osc = new p5.Oscillator(frequency);
        this.oscVibrato = null;
        this.addVibrato(settings, frequency, osc);

        if (settings.volume > 0) {
            const adsrEnvelope = this.createAdsrEnvelope(noteLength, settings.volume);
            osc.setType(settings.waves[settings.waveType]);
            osc.amp(adsrEnvelope);
            osc.pan(pan);
            if (this.oscVibrato) {
                this.oscVibrato.start();
            }
            osc.start();
            adsrEnvelope.play();
        }
    }

    /**
     * Creates an attack, decay, sustain, release (ADSR) envelope to modulate the sound’s volume over time.
     * @param decayTime the decay portion of the envelope
     * @param attackLevel the volume of the attack
     * @returns the ADSR envelope
     */
    createAdsrEnvelope(decayTime, attackLevel) {
        const envelope = new p5.Env();
        const attackTime = .01;
        const sustainRatio = 0;
        const releaseTime = 0;
        envelope.setADSR(attackTime, decayTime, sustainRatio, releaseTime);

        const releaseLevel = 0;
        envelope.setRange(attackLevel, releaseLevel);

        return envelope;
    }

    addVibrato(settings, toneFrequency, toneOscillator) {
        if (settings.vibratoDepth > 0) {
            const ov = this.oscVibrato = new p5.Oscillator(settings.vibratoFreq);
            ov.setType(settings.waves[settings.vibratoWaveType]);
            ov.amp(toneFrequency * 1 / 12 * settings.vibratoDepth);
            ov.disconnect();
            toneOscillator.freq(ov);
        }
    }

    stop() {
        this.osc.stop();
        this.oscVibrato && this.oscVibrato.stop();
    }
}
