var DragAccel = {};

DragAccel.Game = function () {};

DragAccel.Game.prototype = {
    preload: function() {
        this.load.image('ship', 'assets/UFO.png');
    },

    ship: null,
    cursors: null,
    dKey: null,
    drag: 100,
    acceleration: 200,

    create: function() {
        this.stage.backgroundColor = '0000a0';
        var ship = this.add.sprite(this.world.width / 2, 50, 'ship');
        ship.anchor.x = 0.5;
        this.physics.arcade.enable(ship);
        ship.body.collideWorldBounds = false;
        ship.body.drag.set(this.drag);
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
    },
    
    render: function() {
        var accel = this.ship.body.acceleration
        var velX  = Math.round(this.ship.body.velocity.x)
        var velY  = Math.round(this.ship.body.velocity.y)
        game.debug.text('Velocity: (' + velX + ', ' + velY + '), ' +
            'acceleration: ' + accel.x + ", " + accel.y + '; drag: ' + this.drag,
            10, this.world.height - 10);
    },
    
    handleDButton: function() {
        if (dKey.shiftKey)
            this.drag -= 10;
        else
            this.drag += 10;
        this.ship.body.drag.set(this.drag);
    }
};
    
var game = new Phaser.Game(window.innerWidth - 8 * 2, window.innerHeight * .7);
game.state.add('Game', DragAccel.Game);
game.state.start('Game');
