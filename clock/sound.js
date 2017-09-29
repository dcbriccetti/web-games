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

    set(secondsFraction, minutesFraction) {
        const rampTime = 0.01;
        if (this.options.on) {
            const secondsVolumeFraction = Math.max(0, -1 / this.options.pingSecondsSeconds * secondsFraction + 1);
            this.oscSecs.amp(secondsVolumeFraction * this.options.maxVolumeSeconds, rampTime);
            const fractionalSecondsAngle = map(secondsFraction, 0, 1000, 0, TWO_PI);
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
