// Leaving Shapes with pleasing sounds

let shapes = [];

function setup() {
    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
    colorMode(HSB);
    shapes.push(new Shape());
}

function draw() {
    background(0);
    let deleteIndexes = [];
    for (let i = 0; i < shapes.length; ++i) {
        const shape = shapes[i];
        shape.draw();
        const distance = shape.move();
        if (distance > 3000) {
            shape.sound.silence();
            deleteIndexes.push(i);
        }
    }
    for (let i = deleteIndexes.length - 1; i > 0; --i) {
        shapes.splice(deleteIndexes[i], 1);
    }

    if (frameCount % 60 === 0) {
        shapes.push(new Shape());
    }
}

class Shape {
    constructor() {
        function rv() {
            return random(40) - 20;
        }
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.hue = random(0, 255);
        this.dx = rv();
        this.dy = rv();
        this.dz = rv();
        const freqMult = int(map(this.hue, 0, 255, 1, 10));
        const fundamental = 220;
        const freq = fundamental * freqMult;
        this.sound = new ShapeSound(freq);
    }

    draw() {
        push();
        translate(this.x, this.y, this.z);
        fill(this.hue, 255, 255);
        box(100);
        pop();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.z += this.dz;
        const unclampedPan = map(this.x, -width / 2, width / 2, -1, 1);
        this.sound.setPan(max(-1, min(1, unclampedPan)));
        const dist = this.distance();
        const maxSoundDist = 1000;
        this.sound.setAmp(map(min(maxSoundDist, dist),
            0, maxSoundDist, 0, 0.5));
        return dist;
    }

    distance() {
        return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}

class ShapeSound {
    constructor(freq) {
        const osc = new p5.Oscillator();
        osc.setType('sine');
        osc.freq(freq);
        osc.start();
        this.osc = osc;
        this.amp = 0.5;
    }

    setAmp(amp) {
        console.log(amp);
        this.osc.amp(amp);
    }

    setPan(location) {
        this.osc.pan(location);
    }

    silence() {
        this.osc.stop();
    }
}
