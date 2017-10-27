// Cube to sphere program. Inspired by Golan Levin’s circle morphing:
// https://github.com/golanlevin/circle-morphing, brought to us by
// Dan Shiffman’s The Coding Train.

const options = {
    cubeEdgeLength:         30,
    betweenCubeSpace:       75,
    morphPeriodSecs:        10,
    yRotationPeriodSecs:    11
};

let numCubes;
let startCoord;
let halfSpace;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    const maxLargeCubeEdge = min(800, width, height);
    numCubes = Math.floor(maxLargeCubeEdge / (options.cubeEdgeLength + options.betweenCubeSpace));
    const spaceNeeded = numCubes * options.cubeEdgeLength + (numCubes - 1) * options.betweenCubeSpace;
    halfSpace = spaceNeeded / 2;
    startCoord = -halfSpace + options.cubeEdgeLength / 2;
}

function draw() {

    function colorPart(offset) {
        return map(offset, -halfSpace, halfSpace, 0, 255)
    }

    function forRange(fn) {
        for (let i = 0; i < numCubes; ++i) {
            fn(startCoord + i * (options.cubeEdgeLength + options.betweenCubeSpace));
        }
    }

    background(64);
    translate(0, 0, -700);
    rotateX(PI / 4);
    rotateY(millis() / 1000 / options.yRotationPeriodSecs * TWO_PI);
    const cornerVector = createVector(halfSpace, halfSpace, halfSpace);
    const cosSquashAt = 0.7;
    const radians = millis() / 1000 / options.morphPeriodSecs * TWO_PI;
    const cosOverTime = constrain(cos(radians), -cosSquashAt, cosSquashAt);
    const changingMaxRadius = createVector(
        map(cosOverTime, -cosSquashAt, cosSquashAt, halfSpace, cornerVector.mag()), 0, 0);

    forRange(x => forRange(y => forRange(z => {
        let pos = createVector(x, y, z);
        const shrinkNeeded = changingMaxRadius.mag() / pos.mag();
        if (shrinkNeeded < 1) {
            pos = pos.mult(shrinkNeeded);
        }
        push();
        translate(pos.x, pos.y, pos.z);
        fill(colorPart(x), colorPart(y), colorPart(z));
        box(options.cubeEdgeLength);
        pop();
    })))
}
