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
        if (distance > 5000) {
            deleteIndexes.push(i);
        }
    }
    for (let i = deleteIndexes.length - 1; i > 0; --i) {
        shapes.splice(deleteIndexes[i], 1);
    }
    console.log(shapes.length);

    if (frameCount % 60 === 0) {
        shapes.push(new Shape());
    }
}

class Shape {
    constructor() {
        function rv() {
            return random(20) - 10;
        }
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.hue = random(0, 255);
        this.dx = rv();
        this.dy = rv();
        this.dz = rv();
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
        return this.distance();
    }

    distance() {
        return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
