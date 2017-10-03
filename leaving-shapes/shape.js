class Shape {
    constructor(keyIndex, length, settings) {
        this.length = length;
        this.settings = settings;
        this.pos = createVector();
        this.velocity = p5.Vector.random3D();
        this.velocity.mult(5);
        const harmonicNumber = int(random(settings.numHarmonics)) + 1;
        this.hue = map(harmonicNumber, 1, settings.numHarmonics, 0, 255);
        const chromaticScaleFreqs = [
            65.41,
            69.30,
            73.42,
            77.78,
            82.41,
            87.31,
            92.50,
            98.00,
            103.83,
            110.00,
            116.54,
            123.47
        ];
        const fundamental = chromaticScaleFreqs[keyIndex];
        const freqMult = harmonicNumber;
        const maxPitchDev = 0.1;
        const pitchDev = (1 - settings.intonation) * maxPitchDev;
        const freq = fundamental * freqMult * random(1 - pitchDev, 1 + pitchDev);
        this.sound = new ShapeSound(freq, settings.volume, this.velocity.mag());
        this.startMillis = millis();
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        fill(this.hue, 100, 100);
        rotateX(frameCount / 30);
        rotateY(frameCount / 35);
        rotateZ(frameCount / 40);
        box(this.length);
        pop();
    }

    move() {
        this.pos.add(this.velocity);
    }

    adjustSound() {
        const unclampedPan = map(this.pos.x, -width / 2, width / 2, -1, 1);
        this.sound.setPan(constrain(unclampedPan, -1, 1));
    }
}
