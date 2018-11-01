function setup() {
    const c = createCanvas(500, 500, WEBGL);
    c.parent('#main');
}

function draw() {
    background('white');
    const lim = PI / 16;
    rotateX(map(mouseY, 0, height, lim, -lim));
    rotateY(map(mouseX, 0, width, -lim, lim));
    rotateZ(PI / 2);
    noFill();

    strokeWeight(5);
    const t = new Turtle();
    const c = $('#code').val();
    stroke('blue');
    try {
        eval(c);
    } catch(e) {
        console.log(e);
    }
}
