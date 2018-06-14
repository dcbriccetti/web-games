let num = 2;
let rocketY = 100;
let rocketDy = 1;
let launched = false;
const speech = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
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

    if (num >= 0) {
      say(num--, 0.5);
    } else {
        if (! launched) {
            frameRate(60);
            say("Oh wow, look at it go!", 2, 0.5);
            launched = true;
        }
        rocketY += rocketDy;
        rocketDy *= 1.01;
    }
}

function say(message, pitch = 1, rate = 1) {
      utterance.text = message;
      utterance.pitch = pitch;
      utterance.rate = rate;
      speech.speak(utterance);
}
