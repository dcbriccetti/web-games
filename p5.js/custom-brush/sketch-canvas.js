const brushWidth = 60;
const bristleSeparation = 3;
let autoRotate = false;
let rotationAngle = 0;
let autoHue = true;
let hue = 0;

function setup() {
    const c = document.getElementById('canvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, c.width, c.height);
    addEventListener('keydown', keyDown);
    c.addEventListener('mousemove', event => {
        ctx.save();
        ctx.translate(event.x, event.y);
        ctx.rotate(rotationAngle);
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        for (let xo = -brushWidth / 2; xo <= brushWidth / 2; xo += bristleSeparation) {
            for (let yo = -brushWidth / 2; yo <= brushWidth / 2; yo += bristleSeparation) {
                ctx.fillRect(xo, yo, 2, 2);
            }
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

setup();
