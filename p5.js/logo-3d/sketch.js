let codeChanged = false;
let mouseFirstMoved = false;

function setup() {
    const c = createCanvas(500, 500, WEBGL);
    c.parent('#main');
    const sel = $('#samples');
    samples.forEach((s, i) => {
        sel.append(`<option value="${i}">${s.name}</option>`)
    });
    sel.change((e) => $('#code').val(samples[sel.val()].code));
    $('#code').val(samples[0].code);
}

function draw() {
    background('white');
    const lim = PI / 4;
    if (mouseFirstMoved) {
        rotateX(map(mouseY, 0, height, lim, -lim));
        rotateY(map(mouseX, 0, width, -lim, lim));
    }
    noFill();
    stroke('orange');
    strokeWeight(1);
    box(width * 0.5);

    strokeWeight(3);
    const t = new Turtle();
    if (codeChanged && false /* logging off */) {
        t.startLog();
        codeChanged = false;
    }
    const c = $('#code').val().split('\n');
    c.forEach((line, i) => {
        const tl = line.trim();
        t.commands.forEach(cmd => {
            if (tl.startsWith(cmd)) c[i] = 't.' + line;
        })
    });
    stroke('blue');
    try {
        eval(c.join('\n'));
    } catch(e) {
        console.log(e);
    }
}

function mouseMoved() {
    mouseFirstMoved = true;
}

$(() => {
    $('#code').keyup(() => {
        codeChanged = true
    });
});
