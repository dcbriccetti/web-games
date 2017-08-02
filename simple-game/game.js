var Simple = {};

Simple.Game = function () {};

Simple.Game.prototype = {
    preload: function() {
        this.load.image('enemy', 'enemy.png');
        this.load.spritesheet('lady', 'lady.png', 50, 100);
    },

    player: null,
    enemy: null,
    cursors: null,
    running: true,

    create: function() {
        this.stage.backgroundColor = 'e0e0f0';
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = this.add.sprite(40, this.world.height / 2, 'lady');
        this.player.animations.add('walk-right', [0, 1]);
        this.player.animations.add('walk-left',  [2, 3]);
        this.enemy  = this.add.sprite(10, this.world.height - 10, 'enemy');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.enemy,  Phaser.Physics.ARCADE);
        this.enemy.body.collideWorldBounds = true;
        this.enemy.body.bounce = 0.2;
        this.player.body.drag.set(100);

        cursors = this.input.keyboard.createCursorKeys();
    },
    
    frameNumber: 0,

    update: function() {
        if (this.running) {
            var elapsedSeconds = Math.floor(this.game.time.totalElapsedSeconds());
            document.getElementById('elapsed').textContent = elapsedSeconds;
            if (this.running && elapsedSeconds >= 10) {
                alert('You survived!');
                this.running = false;
            }
            var playerVelX = 0;
            var playerVelY = 0;
            var vel = 200;
            if (cursors.right.isDown) {
                playerVelX = vel;
                this.player.animations.play('walk-right', 4);
            } else if (cursors.left.isDown) {
                playerVelX = -vel;
                this.player.animations.play('walk-left', 4);
            }
            if (cursors.up.isDown) {
                playerVelY = -vel;
            } else if (cursors.down.isDown) {
                playerVelY = vel;
            }
            this.player.body.velocity.set(playerVelX, playerVelY);

            if (++this.frameNumber % 30 == 0) {
                var xVel = game.rnd.integerInRange(-800, 800);
                var yVel = game.rnd.integerInRange(-800, 800);
                this.enemy.body.velocity.set(xVel, yVel);
            }

            function spriteContact(obj1, obj2) {
                this.player.kill();
                this.running = false;
            }
            game.physics.arcade.collide(this.player, this.enemy, spriteContact, null, this);
        } else {
            this.enemy.body.velocity.set(0, 0);
        }
    }
};
    
var game = new Phaser.Game('100', 500, Phaser.CANVAS);
game.state.add('Game', Simple.Game);
game.state.start('Game');
