let num = 5;
const speech = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 100);
    background(0);
    frameRate(1);
    say("Counting down");
}

function draw() {
    if (num >= 0) {
      say(num);
      --num;
    }
}

function say(message) {
      utterance.text = message;
      speech.speak(utterance);
}
