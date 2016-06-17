var SimpleAnimation = {};

SimpleAnimation.Game = function () {};

SimpleAnimation.Game.prototype = {
    preload: function() {
        this.load.spritesheet('star', 'assets/stars.png', 200, 200);
    },

    player: null,
    cursors: null,
    animating: false,

    create: function() {
        function toggleAnimation() {
            if (this.animating) {
                this.player.animations.stop();
                this.animating = false;
            } else {
                this.player.animations.play('twinkle', 6, true);
                this.animating = true;
            }
        }

        game.stage.backgroundColor = 'd0d0d0';
        game.physics.startSystem(Phaser.Physics.P2JS);

        this.player = game.add.sprite(100, 0, 'star');
        game.physics.p2.enable(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();
        var spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacebar.onDown.add(toggleAnimation, this);

        this.player.animations.add('twinkle', [0, 1, 2, 1]);
    },

    update: function() {
        var moveAmt = 200;
        this.player.body.setZeroVelocity();

        if (this.cursors.left.isDown) {
            this.player.body.moveLeft(moveAmt);
        }
        if (this.cursors.right.isDown) {
            this.player.body.moveRight(moveAmt);
        }
        if (this.cursors.up.isDown) {
            this.player.body.moveUp(moveAmt);
        }
        if (this.cursors.down.isDown) {
            this.player.body.moveDown(moveAmt);
        }
    }
};
    
var game = new Phaser.Game('100', 500);
game.state.add('Game', SimpleAnimation.Game);
game.state.start('Game');
