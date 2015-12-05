var Simple = {};

Simple.Game = function () {};

Simple.Game.prototype = {
    preload: function() {
        this.load.image('dude', 'assets/' + 'dude.png');
    },

    player: null,
    cursors: null,

    create: function() {
        this.stage.backgroundColor = '0000a0';
        this.physics.startSystem(Phaser.Physics.P2JS);

        player = this.add.sprite(40, this.world.height / 2, 'dude');
        this.physics.p2.enable(player);

        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        var moveAmt = 200;
        player.body.setZeroVelocity();

        if (cursors.right.isDown) {
            player.body.moveRight(moveAmt);
        }
    }
};
    
var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
game.state.add('Game', Simple.Game);
game.state.start('Game');
