var DragAccel = {};

DragAccel.Game = function () {};

DragAccel.Game.prototype = {
    preload: function() {
        this.load.image('UFO', 'assets/UFO.png');
    },

    player: null,
    cursors: null,
    dKey: null,
    drag: 100,
    acceleration: 200,

    create: function() {
        this.stage.backgroundColor = '0000a0';
        var player = this.add.sprite(this.world.width / 2, 100, 'UFO');
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        this.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.drag.set(this.drag);
        this.player = player;
        cursors = this.input.keyboard.createCursorKeys();
        dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        dKey.onDown.add(this.handleDButton, this);
    },

    update: function() {
        if (cursors.right.isDown) {
            this.player.body.acceleration.set(this.acceleration, 0);
        } else if (cursors.left.isDown) {
            this.player.body.acceleration.set(-this.acceleration, 0);
        } else {
            this.player.body.acceleration.set(0);
        }
    },
    
    render: function() {
        game.debug.text(
            'Acceleration: ' + this.player.body.acceleration + ', drag: ' + this.drag,
            10, this.world.height - 10);
    },
    
    handleDButton: function() {
        if (dKey.shiftKey)
            this.drag -= 10;
        else
            this.drag += 10;
        player.body.drag.set(this.drag);
    }
};
    
var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
game.state.add('Game', DragAccel.Game);
game.state.start('Game');
