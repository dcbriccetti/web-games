// 3D Clock
// Inspired by The Coding Train Coding Challenge #74: Clock with p5.js, https://www.youtube.com/watch?v=E4RyStef-gY

State = {
    oscSecs: null,
    oscMins: null,
    // Used to align the clock “agitation” cycle with a second boundary
    navStartMsSecondOffset: window.performance.timing.navigationStart % 1000,
    numTickMarks:           60,
    raiseExtent:            Math.PI * 2 / 60,
    hourMarkThickness:      10,
    minuteMarkThickness:    5,
    raisedMarkMaxHeight:    50,
    normalMarkHeight:       10,
    axleThickness:          10,
    axleLength:             200,
    freqSeconds:            880,
    maxVolumeSeconds:       0.2,
    freqMinutes:            440,
    maxVolumeMinutes:       0.3
};

function Sound() {
    function startOsc(freq) {
        const osc = new p5.Oscillator();
        osc.setType('sine');
        osc.freq(freq);
        osc.start();
        return osc;
    }

    this.oscSecs = startOsc(State.freqSeconds);
    this.oscMins = startOsc(State.freqMinutes);

    this.set = function(msOfCurrentSecond, minutesFraction) {
        State.sound.oscSecs.amp(map(msOfCurrentSecond, 0, 1000, State.maxVolumeSeconds, 0));
        const fractionalSecondsAngle = map(msOfCurrentSecond, 0, 1000, 0, TWO_PI);
        State.sound.oscSecs.pan(Math.sin(fractionalSecondsAngle));
        const fadeZone = 1 / 12;
        const vol = map(Math.min(fadeZone, minutesFraction), 0, fadeZone, State.maxVolumeMinutes, 0);
        State.sound.oscMins.amp(vol);
    }
}

function setup() {
    State.sound = new Sound();
    State.colors = { // Set this here because the color function isn’t available before
        ticks: color(59, 71, 248),
        hour:  color(51, 136, 217),
        min:   color(69, 233, 240),
        sec:   color(51, 217, 144)
    };

    const len = Math.min(document.body.clientWidth, window.innerHeight);
    createCanvas(len, len, WEBGL);
}

function draw() {
    /**
     * Draws tick marks along the circumference of the clock.
     * @param radius the radius of the circle along which the marks are drawn
     * @param msOfCurrentSecond how far we are into the next second
     */
    function drawTickMarks(radius, msOfCurrentSecond) {
        /**
         * Computes the thickness of a tick mark, based on its tick index. Ticks at hour positions are thicker.
         * @param tickIndex the index from 0 to the number of tick marks - 1
         * @returns a thickness in pixels
         */
        function markThickness(tickIndex) {
            const hourMark = tickIndex % (60 / 12) === 0;
            return hourMark ? State.hourMarkThickness : State.minuteMarkThickness;
        }

        /**
         * Computes the height (the length along z) of a tick mark.
         * @param angle the angle at which the mark will be drawn
         * @returns the mark height in pixels
         */
        function markHeight(angle) {
            const angleTurnedOneQuarter = (angle + TWO_PI / 4) % TWO_PI;
            const msAngle = map(msOfCurrentSecond, 0, 1000, PI * 2, 0);
            const tickDistanceFromMsPos = Math.abs(msAngle - angleTurnedOneQuarter);
            const limitedTickDistanceFromMsPos = Math.min(State.raiseExtent, tickDistanceFromMsPos);
            return map(limitedTickDistanceFromMsPos, 0, State.raiseExtent,
                State.raisedMarkMaxHeight, State.normalMarkHeight);
        }

        for (let tickIndex = 0; tickIndex < State.numTickMarks; ++tickIndex) {
            push();
            const angle = tickIndex * TWO_PI / State.numTickMarks;
            rotateZ(angle);
            translate(-radius, 0, 0);
            rotateX(PI / 2); // Align with the z axis
            cylinder(markThickness(tickIndex), markHeight(angle));
            pop();
        }
    }

    function drawAxle() {
        push();
        rotateX(PI / 2); // Align with the z axis
        cylinder(State.axleThickness, State.axleLength);
        pop();
    }

    /**
     * Draws a clock hand.
     * @param position the position (seconds, minutes, or hours. A real number.
     * @param maxUnits 60 or 12
     * @param radius the radius of the cylinder forming the hand
     * @param length the length of the cylinder
     * @param color the color of the cylinder
     * @param z where the hand is positioned along the z axis
     */
    function drawHand(position, maxUnits, radius, length, color, z) {
        push();
        fill(color);
        const handAngle = map(position, 0, maxUnits, 0, TWO_PI);
        rotateZ(-handAngle);
        translate(0, -length / 2, z);
        cylinder(radius, length);
        pop();
    }

    /** Moves the entire clock on the y axis sinusoidally, in the manner of a washing machine agitator */
    function agitateClock(cyclesPerSecond, maxRotationRadians) {
        const angleOverTime = cyclesPerSecond / 1000 * (millis() - State.navStartMsSecondOffset) * PI * 2;
        rotateY(map(Math.sin(angleOverTime), -1, 1, -maxRotationRadians, maxRotationRadians));
    }

    agitateClock(0.1, PI / 8);

    const millisecondsOfCurrentSecond = new Date().getTime() % 1000;
    const secondPlusFraction = second() + millisecondsOfCurrentSecond / 1000;
    const minutesFraction = secondPlusFraction / 60;
    const minutePlusFraction = minute() + minutesFraction;
    const hourPlusFraction = hour() % 12 + minutePlusFraction / 60;
    State.sound.set(millisecondsOfCurrentSecond, minutesFraction);

    fill(State.colors.ticks);
    drawTickMarks(width * 0.35, millisecondsOfCurrentSecond);
    fill(0);
    drawAxle();

    drawHand(hourPlusFraction,   12, 9, width / 6, State.colors.hour, 0);
    drawHand(minutePlusFraction, 60, 6, width / 3, State.colors.min, 30);
    drawHand(secondPlusFraction, 60, 3, width / 3, State.colors.sec, 60);
}
