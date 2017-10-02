class Shape {
    constructor(scale) {
        function rv() {
            return random(10) - 5;
        }
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.hue = random(0, 255);
        this.dx = rv();
        this.dy = rv();
        this.dz = rv();
        const cycleFourthFreqsFromC2 = [
            65.4064, 87.3071, 116.541, 155.563,
            51.9131, 69.2957, 92.5986, 123.471,
            82.4069, 110, 146.832, 195.998
        ];
        const fundamental = cycleFourthFreqsFromC2[scale];
        const freqMult = int(map(this.hue, 0, 255, 1, 10));
        const freq = fundamental * freqMult;
        this.type = int(random(2));
        this.sound = new ShapeSound(freq, this.type);
        this.startMillis = millis();
    }

    draw() {
        push();
        translate(this.x, this.y, this.z);
        const fadeInTimeMs = 1000;
        fill(this.hue, 100, 100, map(
            min(fadeInTimeMs, millis() - this.startMillis), 0, fadeInTimeMs, 0, 1));
        rotateX(frameCount / 30);
        rotateY(frameCount / 35);
        rotateZ(frameCount / 40);
        if (this.type === 0) {
            cylinder(20, 40);
        } else if (this.type === 1) {
            box(40);
        }
        pop();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.z += this.dz;
    }

    adjustSound(dist) {
        const unclampedPan = map(this.x, -width / 2, width / 2, -1, 1);
        this.sound.setPan(max(-1, min(1, unclampedPan)));
        const maxSoundDist = 1000;
        this.sound.setAmp(map(min(maxSoundDist, dist),
            0, maxSoundDist, 0.4, 0));
    }

    distance() {
        return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
