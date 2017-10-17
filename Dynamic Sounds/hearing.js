const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);
oscillator.connect(gainNode);

const pitchChangeInterval = 200;
oscillator.type = 'sine';
oscillator.frequency.value = 3000; // hertz
oscillator.start();
const frequencyMultiplier = Math.pow(2, 1 / 24);
const freqDisplay = document.getElementById("freq");
let running = true;

function raisePitch() {
    oscillator.frequency.value *= frequencyMultiplier;
    freqDisplay.textContent = oscillator.frequency.value.toFixed(0);
    if (running && oscillator.frequency.value < 20000) {
        setTimeout(raisePitch, 200);
    } else {
        oscillator.stop();
    }
}

document.addEventListener('keydown', () => running = false);
setTimeout(raisePitch, pitchChangeInterval);
