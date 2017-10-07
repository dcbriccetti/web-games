new Phaser.Game(700, 500, Phaser.AUTO, '', {
    preload: function() {
        this.load.image('enemy', 'enemy.png');
        this.load.spritesheet('lady', 'lady.png', 50, 100);
    },

    running: true,

    create: function() {
        this.stage.backgroundColor = 'e0e0f0';
        this.physics.startSystem(Phaser.Physics.ARCADE);

        const player = this.player = this.add.sprite(this.world.width / 2, this.world.height / 2, 'lady');
        const enemy  = this.enemy  = this.add.sprite(10, this.world.height - 10, 'enemy');
        player.animations.add('walk-right', [0, 1]);
        player.animations.add('walk-left',  [2, 3]);
        this.physics.enable(player, Phaser.Physics.ARCADE);
        this.physics.enable(enemy,  Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        enemy. body.collideWorldBounds = true;
        enemy.body.bounce = 0.2;
        player.body.drag.set(100);

        cursors = this.input.keyboard.createCursorKeys();

        this.enemyMoveTimer = this.time.events.loop(Phaser.Timer.QUARTER, () => {
            const xVel = this.rnd.integerInRange(-800, 800);
            const yVel = this.rnd.integerInRange(-800, 800);
            enemy.body.velocity.set(xVel, yVel);
        }, this);
    },

    update: function() {
        const player = this.player;
        const enemy = this.enemy;

        if (this.running) {
            const elapsedSeconds = Math.floor(this.game.time.totalElapsedSeconds());
            document.getElementById('elapsed').textContent = elapsedSeconds;
            if (this.running && elapsedSeconds >= 10) {
                this.add.text(20, 20, 'You survived!');
                this.stop();
            }
            this.movePlayer(player);

            this.physics.arcade.collide(player, enemy, (player, enemy) => {
                player.kill();
                this.stop();
            });
        } else {
            enemy.body.velocity.set(0, 0);
            player.body.velocity.set(0, 0);
        }
    },

    stop: function () {
        this.running = false;
        this.time.events.remove(this.enemyMoveTimer);
    },

    movePlayer: function (player) {
        let playerVelX = 0;
        let playerVelY = 0;
        const vel = 200;
        if (cursors.right.isDown) {
            playerVelX = vel;
            player.animations.play('walk-right', 4);
        } else if (cursors.left.isDown) {
            playerVelX = -vel;
            player.animations.play('walk-left', 4);
        }
        if (cursors.up.isDown) {
            playerVelY = -vel;
        } else if (cursors.down.isDown) {
            playerVelY = vel;
        }
        player.body.velocity.set(playerVelX, playerVelY);
    },

});
