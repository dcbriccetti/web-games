class ShapeSound {
    constructor(freq, type) {
        const forms = ['sine', 'triangle'];
        const osc = new p5.Oscillator();
        osc.setType(forms[type]);
        osc.freq(freq);
        osc.amp(0);
        osc.start();
        this.osc = osc;
    }

    setAmp(amp) {
        this.osc.amp(amp, 0.01);
    }

    setPan(location) {
        this.osc.pan(location);
    }

    silence() {
        this.osc.stop(0.2);
    }
}
