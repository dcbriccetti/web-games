class Turtle {
    constructor() {
        this.pos = createVector(0, 0, -100);
        this.θ = 0;
        this.φ = Math.PI / 2;
        this.log = false;
        this.lineCount = 0;
        this.commands = ['fd', 'rt', 'up'];
    }

    startLog() {
        $('#log').empty();
        this.log = true;
        console.log('startLog');
    }

    static f(n) {return n.toFixed(3);}

    l1(s) {if (this.log) $('#log').append(`<span>${s}</span><br/>`)}

    fd(len) {
        const p = this.pos;
        const x = len * sin(this.φ) * cos(this.θ);
        const y = len * sin(this.φ) * sin(this.θ);
        const z = len * cos(this.φ);
        const moveBy = createVector(x, y, z);
        const f = Turtle.f;
        this.l1(`move by: ${f(moveBy.x)}, ${f(moveBy.y)}, ${f(moveBy.z)}`);
        const e = p5.Vector.add(p, moveBy);
        if (false /* cycle colors */) {
            const colors = ['red', 'green', 'blue', 'yellow'];
            stroke(colors[this.lineCount++ % colors.length]);
        }
        line(p.x, p.y, p.z, e.x, e.y, e.z);
        this.pos = e;
        this.l1('fd: ' + this);
    }

    rt(degrees) {
        this.θ += radians(degrees);
        this.l1('rt: ' + this);
    }

    up(degrees) {
        this.φ -= radians(degrees);
        this.l1('up: ' + this);
    }

    toString() {
        const p = this.pos;
        const f = Turtle.f;
        return `Pos: ${f(p.x)}, ${f(p.y)}, ${f(p.z)}, Dir: θ: ${f(this.θ)}, φ: ${f(this.φ)}`;
    }
}

function repeat(num, fn) {
    for (let n = 0; n < num; ++n) fn()
}


