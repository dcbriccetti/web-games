new Phaser.Game('100', 500, Phaser.AUTO, '', {
    preload: function() {
        this.load.spritesheet('star', 'assets/stars.png', 200, 200);
    },

    animating: false,

    create: function() {
        this.stage.backgroundColor = 'd0d0d0';
        this.physics.startSystem(Phaser.Physics.P2JS);

        this.player = this.add.sprite(200, 200, 'star');
        this.physics.p2.enable(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
        const spaceBar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBar.onDown.add(() => {
            if (this.animating) {
                this.player.animations.stop();
                this.animating = false;
            } else {
                this.player.animations.play('twinkle', 6, true);
                this.animating = true;
            }
        });

        this.player.animations.add('twinkle', [0, 1, 2, 1]);
    },

    update: function() {
        const moveAmt = 200;
        const body = this.player.body;
        body.setZeroVelocity();
        const c = this.cursors;

        if (c.left.isDown) {
            body.moveLeft(moveAmt);
        }
        if (c.right.isDown) {
            body.moveRight(moveAmt);
        }
        if (c.up.isDown) {
            body.moveUp(moveAmt);
        }
        if (c.down.isDown) {
            body.moveDown(moveAmt);
        }
    }
});
