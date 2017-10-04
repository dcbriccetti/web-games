const dragAccel = {
    ship: null,
    cursors: null,
    dKey: null,
    acceleration: 200,
    oscillator: null,

    preload: function () {
        this.oscillator = this.createOscillator();
        this.load.image('ship', 'assets/UFO.png');
    },

    create: function () {
        this.stage.backgroundColor = '0000a0';
        const ship = this.add.sprite(this.world.width / 2, 50, 'ship');
        ship.anchor.x = 0.5;
        this.physics.arcade.enable(ship);
        ship.body.collideWorldBounds = false;
        ship.body.drag.set(100);
        this.ship = ship;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.dKey.onDown.add(this.handleDButton, this);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.handleSpaceButton, this);
    },

    update: function () {
        let xAccel = 0;
        let yAccel = 0;

        if (this.cursors.right.isDown) {
            xAccel = this.acceleration;
        } else if (this.cursors.left.isDown) {
            xAccel = -this.acceleration;
        }
        if (this.cursors.up.isDown) {
            yAccel = -this.acceleration;
        } else if (this.cursors.down.isDown) {
            yAccel = this.acceleration;
        }
        this.ship.body.acceleration.set(xAccel, yAccel);
        this.oscillator.frequency.value = 65 +
            (Math.abs(this.ship.body.velocity.x) + Math.abs(this.ship.body.velocity.y)) / 2;
    },

    render: function () {
        const body = this.ship.body;
        const accel = body.acceleration;
        const velX = Math.round(body.velocity.x);
        const velY = Math.round(body.velocity.y);
        const posX = Math.round(body.position.x);
        const posY = Math.round(body.position.y);
        game.debug.text('Position: (' + posX + ', ' + posY + '), ' +
            'velocity: (' + velX + ', ' + velY + '), ' +
            'acceleration: (' + accel.x + ", " + accel.y + '); drag: ' + body.drag.x,
            10, this.world.height - 10);
    },

    handleDButton: function () {
        const change = 10 * (this.dKey.shiftKey ? 1 : -1);
        this.ship.body.drag.set(this.ship.body.drag.x + change);
    },

    handleSpaceButton: function () {
        this.ship.body.velocity.set(0, 0);
    },

    createOscillator: function () {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        gainNode.connect(audioCtx.destination);
        oscillator.connect(gainNode);
        oscillator.type = 'sine';
        oscillator.frequency.value = 65;
        oscillator.start();
        return oscillator;
    }
};

new Phaser.Game(800, 400, Phaser.AUTO, '', dragAccel);
