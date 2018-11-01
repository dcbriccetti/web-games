class Turtle {
    constructor() {
        this.pos = createVector(0, 0, 0);
        this.θ = 0;
        this.φ = 0;
    }

    fd(len) {
        const p = this.pos;
        const vfa = p5.Vector.fromAngles(this.θ, this.φ, len);
        const e = p5.Vector.add(p, vfa);
        line(p.x, p.y, p.z, e.x, e.y, e.z);
        this.pos = e;
    }

    rt(degrees) {
        this.θ += radians(degrees)
    }

    up(degrees) {
        this.φ += radians(degrees)
    }
}

function repeat(num, fn) {
    for (let n = 0; n < num; ++n) fn()
}


