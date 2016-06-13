var Simple = {};

Simple.Game = function () {};

Simple.Game.prototype = {
    preload: function() {
        this.load.image('dude', 'dude.png');
    },

    player: null,
    cursors: null,

    create: function() {
        this.stage.backgroundColor = 'e0e0f0';
        this.physics.startSystem(Phaser.Physics.ARCADE);

        player = this.add.sprite(40, this.world.height / 2, 'dude');
        this.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.drag.set(100);

        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        if (cursors.right.isDown) {
            player.body.velocity.set(100, 0);
        }
    }
};
    
var game = new Phaser.Game('100', 500);
game.state.add('Game', Simple.Game);
game.state.start('Game');
