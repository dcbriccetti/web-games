import Rocket from "./rocket.js";
import SoundMaker from "./soundmaker.js";

new p5(p => {
    const rocket = new Rocket(200);
    const soundMaker = new SoundMaker();
    let countdownSecs = 1;

    p.setup = function () {
        p.createCanvas(800, p.windowHeight, p.WEBGL).parent('#main');
        p.frameRate(1);
    };

    p.draw = function () {
        function drawBackground() {
            const left = -p.width / 2;
            const top = -p.height / 2;
            const skyProportion = 0.75;
            const skyHeight = p.height * skyProportion;

            function drawSky() {
                p.push();
                p.noStroke();
                p.colorMode(p.HSB);
                const gradient_segments = p.max(100, skyHeight);
                const sectionHeight = Math.ceil(skyHeight / gradient_segments);
                for (let n = 0; n < gradient_segments; ++n) {
                    p.fill(240, 100, p.map(n, 1, gradient_segments, 0, 100));
                    p.rect(left, top + n * sectionHeight, p.width, sectionHeight);
                }
                p.pop();
            }

            function drawGround() {
                p.fill(66, 49, 30);
                p.ellipseMode(p.CENTER);
                const groundHeight = p.height - skyHeight;
                const ellipseHeight = groundHeight * 1.3;
                p.ellipse(0, top + skyHeight + groundHeight / 2, p.width * 4, ellipseHeight);
            }

            p.background(0);
            drawSky();
            drawGround();
        }

        drawBackground();
        rocket.draw(p);

        if (countdownSecs > 0) {
            soundMaker.say(countdownSecs);
        } else {
            if (countdownSecs === 0) {
                soundMaker.say('blastoff');
                setInterval(() => p.frameRate(60), 500); // Wait for speech delay
            } else {
                const maxRocketY = p.height * 1.5;
                soundMaker.adjustForRocketHeight(rocket.y, maxRocketY, p.map);
                rocket.move();

                if (rocket.y > maxRocketY) {
                    soundMaker.silence();
                    p.noLoop();
                }
            }
        }
        --countdownSecs;
    };
});