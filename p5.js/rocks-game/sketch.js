
class Rock {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.lastTime = Date.now();
    }

    draw() {
        ellipse(this.position.x, this.position.y, 10, 10);
    }

    fall() {
        const now = Date.now();
        const t = (now - this.lastTime) / 1000;
        const a = 9.8;
        const v = this.velocity.y;
        const d = v * t + a * t * t / 2;
        this.position.y += d;
        this.velocity.y += a * t;
        this.lastTime = now;
    }
}

const settings = {
    periodSecs: 3,
    maxRotation: 0.8,
    ropeLenHeightDivisor: 4
};

const state = {
    angularFreq: Math.PI * 2 / settings.periodSecs,
    startSecs: Date.now() / 1000,
    nextDropOkAt: Date.now(),
    rock: undefined,
    prevEndPos: undefined // To find velocity of released rock
};

function setup() {
    const c = createCanvas(800, 800);
    c.parent('#main');
    settings.ropeLen = height / settings.ropeLenHeightDivisor;
}

function draw() {
    background(220);
    strokeWeight(10);
    const elapsedSecs = Date.now() / 1000 - state.startSecs;
    const rotation = settings.maxRotation * cos(state.angularFreq * elapsedSecs);
    const ropeAnchorPos = createVector(width / 2, 20);
    const endPos = createVector(sin(rotation), cos(rotation)).mult(settings.ropeLen).add(ropeAnchorPos);
    line(ropeAnchorPos.x, ropeAnchorPos.y, endPos.x, endPos.y);

    if (keyIsPressed && key === ' ' && state.nextDropOkAt < Date.now()) {
        state.rock = new Rock(endPos, state.prevEndPos.sub(endPos).mult(-0.8));
        state.nextDropOkAt = Date.now() + 1000;
    }

    state.prevEndPos = endPos;

    if (state.rock) {
        state.rock.draw();
        state.rock.fall();
        if (state.rock.position.y > height) {
            state.rock = undefined;
        }
    }
}
