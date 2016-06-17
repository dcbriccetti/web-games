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

    create: function() {
        this.stage.backgroundColor = 'e0e0f0';
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = this.add.sprite(40, this.world.height / 2, 'lady');
        this.player.animations.add('walk-right', [0, 1]);
        this.player.animations.add('walk-left',  [2, 3]);
        this.enemy  = this.add.sprite(40, 40, 'enemy');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.enemy,  Phaser.Physics.ARCADE);
        this.player.body.drag.set(100);

        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        function spriteContact(obj1, obj2) {
            this.player.kill();
        }
        var playerVelX = 0;
        var playerVelY = 0;
        var vel = 100;
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

        var xVel = this.velocityDirection(this.player.body.position.x, 
            this.enemy.body.position.x) * 30;
        var yVel = this.velocityDirection(this.player.body.position.y, 
            this.enemy.body.position.y) * 30;
        this.enemy.body.velocity.set(xVel, yVel);

        game.physics.arcade.collide(this.player, this.enemy, spriteContact, null, this);
    },
    
    velocityDirection: function(val1, val2) {
        var diff = val1 - val2;
        if (diff === 0)
            return 0;
        if (diff > 0)
            return 1;
        return -1;
    }
};
    
var game = new Phaser.Game('100', 500, Phaser.CANVAS);
game.state.add('Game', Simple.Game);
game.state.start('Game');
