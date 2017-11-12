const brushWidth = 100;
const bristleSeparation = 3;
let preRender = true;
let autoRotate = false;
let rotationAngle = 0;
let autoHue = true;
let hue = 0;
let brushes;
let strokes = 0;
let strokeTime = 0;

function setup() {
    const c = document.getElementById('canvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, c.width, c.height);
    if (preRender) brushes = Array(360).fill().map((_, i) => createBrushCanvasForHue(i));

    addEventListener('keydown', keyDown);
    c.addEventListener('mousemove', event => {
        ctx.save();
        ctx.translate(event.x, event.y);
        ctx.rotate(rotationAngle);
        const drawStartTime = performance.now();
        if (preRender) {
            ctx.drawImage(brushes[hue], -brushWidth / 2, -brushWidth / 2);
        } else {
            drawBrush(ctx, hue);
        }
        strokeTime += performance.now() - drawStartTime;
        if (++strokes % 100 === 0) {
            console.log(`Average time of ${strokes} brush strokes: ${(strokeTime / strokes).toFixed(5)} ms`);
        }
        ctx.restore();
        if (autoHue) {
            hue = (hue + 1) % 360;
        }
        if (autoRotate) {
            rotationAngle = (rotationAngle + 0.1) % (2 * Math.PI);
        }
    });
}

function keyDown(event) {
    switch (event.key) {
        case 'H':
            autoHue = ! autoHue;
            break;
        case 'h':
            autoHue = false;
            hue += 15;
            break;
        case 'R':
            autoRotate = ! autoRotate;
            break;
        case 'r':
            autoRotate = false;
            rotationAngle += 15;
            break;
        default:
            break;
    }
}

function drawBrush(ctx, hue) {
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    for (let xo = 0; xo < brushWidth; xo += bristleSeparation) {
        for (let yo = 0; yo < brushWidth; yo += bristleSeparation) {
            ctx.fillRect(xo, yo, 2, 2);
        }
    }
}

function createBrushCanvasForHue(hue) {
    const c = document.createElement('canvas');
    c.width = brushWidth;
    c.height = c.width;
    const ctx = c.getContext('2d');
    drawBrush(ctx, hue);
    return c;
}

setup();
