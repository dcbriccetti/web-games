
function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    colorMode(HSB);
}

let particles = [];
let angle = 0;

function draw() {
    background(0);
    translate(width / 2, height / 2);
    if (frameCount % 5 === 0) {
        const changesUntilCenter = int(map(mouseX, 0, width, 1000, 10));
        particles.push(new Particle(angle, changesUntilCenter));
    }
    const angleChange = int(map(mouseY, 0, height, 1, 10));
    angle = (angle + angleChange) % 360;
    let deleteIndexes = [];
    particles.map((p, i) => {
        if (p.pos.mag() > 1) {
            p.draw();
            p.move();
        } else {
            deleteIndexes.push(i);
        }
    });
    deleteIndexes.reverse();
    deleteIndexes.forEach(i => particles.splice(i, 1));
}

function keyPressed() {
    particles = [];
    angle = 0;
}

class Particle {
    constructor(angle, changesUntilCenter) {
        this.pos = createVector(cos(angle) * width / 3, sin(angle) * height / 3);
        this.color = angle;  // They have the same range
        this.chg = p5.Vector.div(this.pos, changesUntilCenter);
        this.size = 30;
        const smallestSize = 5;
        this.sizeChg = (30 - smallestSize) / changesUntilCenter;
    }

    draw() {
        noStroke();
        fill(this.color, 100, 100);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    move() {
        this.pos.sub(this.chg);
        this.size -= this.sizeChg;
    }
}
