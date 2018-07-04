export default class SoundMaker {
    constructor() {
        this.speech = window.speechSynthesis;
        this.utterance = new SpeechSynthesisUtterance();
        this.osc = new p5.Oscillator();
        this.freq = 100;
        this.osc.setType('sine');
        this.osc.amp(0);
        this.osc.start();
    }

    adjustForRocketHeight(y, maxY, map) {
        this.osc.amp(map(y, 0, maxY, 0.2, 0), 0.1);
        this.osc.freq(30 + y);
    }

    silence() {
        this.osc.stop();
    }

    say(message) {
        this.utterance.text = message;
        this.speech.speak(this.utterance);
    }

}