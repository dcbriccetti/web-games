export default class Rocket {
    constructor(startingY) {
        this.y = startingY;
        this.dy = 1;
    }

    draw(p) {
        p.translate(0, p.height / 2 - this.y);
        p.ambientMaterial(255);
        p.directionalLight(255, 255, 255, 1, 0, -1);
        p.noStroke();
        const rocketRadius = 30;
        p.cylinder(rocketRadius, 100);

        p.push();
        p.translate(0, -70, 0);
        p.rotateX(Math.PI);
        p.ambientMaterial(255, 100, 100);
        p.cone(rocketRadius, 40);
        p.pop();

        p.translate(0, 50, 0);
        p.rotateX(Math.PI);
        p.ambientMaterial(50);
        p.cone(rocketRadius / 2, 30);
    }

    move() {
        this.y += this.dy;
        this.dy += 0.02;
    }
}