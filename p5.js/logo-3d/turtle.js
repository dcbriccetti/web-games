class Turtle {
    constructor() {
        this.pos = createVector(0, 0, -100);
        this.θ = 0;
        this.φ = Math.PI / 2;
        this.logging = false;
        this.cycleColors = false;
        this.lineCount = 0;
        this.commands = ['fd', 'rt', 'up'];
    }

    startLog() {
        $('#log').empty();
        this.log = true;
        console.log('startLog');
    }

    static f(n) {return n.toFixed(3);}

    log(s) {if (this.logging) $('#log').append(`<span>${s}</span><br/>`)}

    fd(len) {
        const pos = this.pos;
        const moveBy = this.createMovementVector(len);
        const f = Turtle.f;
        this.log(`move by: ${f(moveBy.x)}, ${f(moveBy.y)}, ${f(moveBy.z)}`);
        const newPos = p5.Vector.add(pos, moveBy);
        if (this.cycleColors) {
            const colors = ['red', 'green', 'blue', 'yellow'];
            stroke(colors[this.lineCount++ % colors.length]);
        }
        line(pos.x, pos.y, pos.z, newPos.x, newPos.y, newPos.z);
        this.pos = newPos;
        this.log('fd: ' + this);
    }

    createMovementVector(len) {
        // todo: replace the use of this method with p5.Vector.fromAngles and make changes so that will work
        const x = len * sin(this.φ) * cos(this.θ);
        const y = len * sin(this.φ) * sin(this.θ);
        const z = len * cos(this.φ);
        return createVector(x, y, z);
    }

    rt(degrees) {
        this.θ += radians(degrees);
        this.log('rt: ' + this);
    }

    up(degrees) {
        this.φ -= radians(degrees);
        this.log('up: ' + this);
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


