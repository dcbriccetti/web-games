class Sound {
    constructor(options) {
        function startOsc(freq) {
            const osc = new p5.Oscillator();
            osc.setType('sine');
            osc.freq(freq);
            osc.start();
            return osc;
        }

        this.options = options;
        this.oscSecs = startOsc(options.freqSeconds);
        this.oscMins = startOsc(options.freqMinutes);
    }

    set(msAfterCurrentSecond, minutesFraction) {
        const rampTime = 0.01;
        if (this.options.on) {
            const fracSec = msAfterCurrentSecond / 1000;
            const secVolFact = Math.max(0, -2 * fracSec + 1);
            console.log(secVolFact);
            const secsVol = secVolFact * this.options.maxVolumeSeconds;
            this.oscSecs.amp(secsVol, rampTime);
            const fractionalSecondsAngle = map(msAfterCurrentSecond, 0, 1000, 0, TWO_PI);
            this.oscSecs.pan(Math.sin(fractionalSecondsAngle));
            const fadeZone = 1 / 12;
            const minsVol = map(Math.min(fadeZone, minutesFraction), 0, fadeZone,
                this.options.maxVolumeMinutes, 0);
            this.oscMins.amp(minsVol, rampTime);
        } else {
            this.oscSecs.amp(0, rampTime);
            this.oscMins.amp(0, rampTime);
        }
    }
}
