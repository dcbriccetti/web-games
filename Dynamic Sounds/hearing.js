var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);
oscillator.connect(gainNode);

oscillator.type = 'sine';
oscillator.frequency.value = 440; // value in hertz
oscillator.start();
var frequencyMultiplier = Math.pow(2, 1 / 24); 
var freqDisplay = document.getElementById("freq");

function raisePitch() {
    oscillator.frequency.value *= frequencyMultiplier;
    freqDisplay.innerHTML = oscillator.frequency.value.toFixed(0);
    if (oscillator.frequency.value < 20000) {
        setTimeout(raisePitch, 100);
    } else {
        oscillator.stop();
        freqDisplay.innerHTML = '';
    }
}
setTimeout(raisePitch, 100);
