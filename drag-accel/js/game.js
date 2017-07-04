var dragAccel = {
    ship:           null,
    cursors:        null,
    dKey:           null,
    acceleration:   200,
    oscillator:     null,

    preload: function() {
        this.oscillator = this.createOscillator();
        this.load.image('ship', 'assets/UFO.png');
    },

    create: function() {
        this.stage.backgroundColor = '0000a0';
        var ship = this.add.sprite(this.world.width / 2, 50, 'ship');
        ship.anchor.x = 0.5;
        this.physics.arcade.enable(ship);
        ship.body.collideWorldBounds = false;
        ship.body.drag.set(100);
        this.ship = ship;
        this.cursors = this.input.keyboard.createCursorKeys();
        dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        dKey.onDown.add(this.handleDButton, this);
    },

    update: function() {
        var xAccel = 0;
        var yAccel = 0;
        
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
    
    render: function() {
        var accel = this.ship.body.acceleration;
        var velX  = Math.round(this.ship.body.velocity.x)
        var velY  = Math.round(this.ship.body.velocity.y)
        var posX  = Math.round(this.ship.body.position.x)
        var posY  = Math.round(this.ship.body.position.y)
        game.debug.text('Position: (' + posX + ', ' + posY + '), ' +
            'velocity: (' + velX + ', ' + velY + '), ' +
            'acceleration: (' + accel.x + ", " + accel.y + '); drag: ' + this.ship.body.drag.x,
            10, this.world.height - 10);
    },
    
    handleDButton: function() {
        var change = 10 * (dKey.shiftKey ? 1 : -1);
        this.ship.body.drag.set(this.ship.body.drag.x + change);
    },
    
    createOscillator: function() {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        gainNode.connect(audioCtx.destination);
        oscillator.connect(gainNode);
        oscillator.type = 'sine';
        oscillator.frequency.value = 65;
        oscillator.start();
        return oscillator;
    }
};
    
var game = new Phaser.Game(window.innerWidth - 8 * 2, window.innerHeight * .7);
game.state.add('Game', dragAccel);
game.state.start('Game');
