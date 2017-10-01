class Sound {
    constructor(options) {
        this.options = options;
        this.soundHours = new HandSound(options.freqHours, 60);
        this.oscHours = this.soundHours.osc;
        this.soundMins = new HandSound(options.freqMinutes, 60);
        this.oscMins = this.soundMins.osc;
        this.soundSecs = new HandSound(options.freqSeconds, 60);
        this.oscSecs = this.soundSecs.osc;
    }

    set(hours, minutes, secondPlusFraction) {
        const rampTime = 0.01;
        let timeLastSet = 0;
        const secsSinceStart = int(millis() / 1000);
        if (this.options.on) {
            if (timeLastSet + 1 < secsSinceStart) {
                timeLastSet = secsSinceStart;
                this.oscHours.amp(this.options.maxVolumeHours, rampTime);
                this.soundHours.setFreq(hours);
                this.oscMins.amp(this.options.maxVolumeMinutes, rampTime);
                this.soundMins.setFreq(minutes);
                const fractionalSecondsAngle = map(secondPlusFraction - int(secondPlusFraction), 0, 1, 0, TWO_PI);
                this.oscSecs.pan(Math.sin(fractionalSecondsAngle));
                this.oscSecs.amp(this.options.maxVolumeSeconds, rampTime);
                this.soundSecs.setFreq(int(secondPlusFraction));
            }
        } else {
            this.oscHours.amp(0, rampTime);
            this.oscMins.amp(0, rampTime);
            this.oscSecs.amp(0, rampTime);
        }
    }
}

class HandSound {
    constructor(baseFreq, max) {
        const osc = new p5.Oscillator();
        osc.setType('sine');
        osc.freq(baseFreq);
        this.baseFreq = baseFreq;
        this.osc = osc;
        this.max = max;
    }

    setFreq(position) {
        const newFreq = this.baseFreq * Math.pow(2, position / 12 / 5);
        console.log(newFreq);
        this.osc.freq(newFreq);
        if (! this.osc.started) {
            this.osc.start();
        }
    }
}
