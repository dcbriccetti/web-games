let countdownSecs = 3;
let rocketY = 100;
let rocketDy = 1;
let launched = false;
const speech = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();
const osc = new p5.Oscillator();
let freq = 100;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    osc.setType('sine');
    osc.amp(0);
    osc.start();
    frameRate(1);
}

function draw() {
    background(0, 0, 100);
    push();
    translate(0, height / 2 - rocketY);
    fill(128);
    stroke(255);
    cylinder(20, 100);
    pop();

    if (countdownSecs >= 0) {
      say(countdownSecs--);
    } else {
        if (! launched) {
            frameRate(60);
            say("There she goes!");
            launched = true;
        }
        osc.amp(map(rocketY, 0, height * 2, 0.2, 0));
        osc.freq(30 + rocketY);
        rocketY += rocketDy;
        rocketDy += 0.04;

        if (rocketY > height * 2) {
            osc.stop();
            noLoop();
        }
    }
}

function say(message) {
      utterance.text = message;
      speech.speak(utterance);
}
