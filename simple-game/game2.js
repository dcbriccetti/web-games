var Simple = {};

Simple.Game = function () {};

Simple.Game.prototype = {
    preload: function() {
        this.load.image('dude', 'dude.png');
        this.load.image('enemy', 'enemy.png');
    },

    player: null,
    enemy: null,
    cursors: null,

    create: function() {
        this.stage.backgroundColor = 'e0e0f0';
        this.physics.startSystem(Phaser.Physics.ARCADE);

        player = this.add.sprite(40, this.world.height / 2, 'dude');
        enemy  = this.add.sprite(40, 40, 'enemy');
        this.physics.enable(player, Phaser.Physics.ARCADE);
        this.physics.enable(enemy,  Phaser.Physics.ARCADE);
        player.body.drag.set(100);

        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        function spriteContact(obj1, obj2) {
            player.kill();
        }
        var playerVelX = 0;
        var playerVelY = 0;
        var vel = 100;
        if (cursors.right.isDown) {
            playerVelX = vel;
        } else if (cursors.left.isDown) {
            playerVelX = -vel;
        }
        if (cursors.up.isDown) {
            playerVelY = -vel;
        } else if (cursors.down.isDown) {
            playerVelY = vel;
        }
        player.body.velocity.set(playerVelX, playerVelY);

        var xVel = this.velocityDirection(player.body.position.x, 
            enemy.body.position.x) * 50;
        var yVel = this.velocityDirection(player.body.position.y, 
            enemy.body.position.y) * 50;
        enemy.body.velocity.set(xVel, yVel);

        game.physics.arcade.collide(player, enemy, spriteContact, null, this);
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
