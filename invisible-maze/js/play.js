
var playState = {
    numMines: 60,

    create: function() {
        this.health = 100;
        this.level = 1;
        this.running = true;
        this.ow = game.add.audio('ow');
        game.stage.backgroundColor = '303030';
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.x = 0;
        game.physics.p2.gravity.y = 0;

        this.playerStartX = 40;
        this.playerStartY = game.world.centerY;
        this.player = game.add.sprite(this.playerStartX, this.playerStartY, 'dude');
        game.physics.p2.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.mass = 1;
        this.player.body.fixedRotation = true;
        this.player.body.onBeginContact.add(this.spriteContact, this);

        this.door = game.add.sprite(game.world.width - 12, game.world.centerY, 'door');
        game.physics.p2.enable(this.door);
        this.door.body.mass = 10000;
        this.door.body.fixedRotation = true;

        this.mines = game.add.group();
        this.createMines();

        this.healthText = game.add.text(16, 16, this.statusString(),
            { fontSize: '12px', fill: '#fff' });

        cursors = game.input.keyboard.createCursorKeys();
    },
            
    update: function() {
        var moveAmt = 200;
        this.player.body.setZeroVelocity();

        if (this.running) {
            var moved = false;

            if (cursors.left.isDown) {
                this.player.body.moveLeft(moveAmt);
                moved = true;
            }
            if (cursors.right.isDown) {
                this.player.body.moveRight(moveAmt);
                moved = true;
            }
            if (cursors.up.isDown) {
                this.player.body.moveUp(moveAmt);
                moved = true;
            }
            if (cursors.down.isDown) {
                this.player.body.moveDown(moveAmt);
                moved = true;
            }

            if (moved) {
                this.player.alpha = 0;
            }

            var state = this;
            this.mines.forEach(function(mine) {
                var ds = state.spriteDistance(mine, state.player.x, state.player.y);
                var thresh = 100;
                mine.alpha = 1.0 - Math.min(thresh, ds) / thresh;
            });
        }
    },
            
    createMines: function() {
        for (var i = 0; i < this.numMines; i++) {
            var newX = game.rnd.integerInRange(20, game.world.width  - 40);
            var newY = game.rnd.integerInRange(20, game.world.height - 40);
            if (this.spriteDistance(this.player, newX, newY) > 50 &&
                    this.nearestMineDistance(newX, newY) > 50) {
                var mine = this.mines.create(newX, newY, 'shock');
                game.physics.p2.enable(mine);
                mine.animations.add('zap', [0, 1, 2, 3]);
                mine.animations.play('zap', 7, true);
                mine.body.mass = 10;
            }
        }
    },

    spriteContact: function(body, shapeA, shapeB, equation) {
        if (body === null) // This happened, but doc doesn't say why
            return;
        
        if (body.sprite === this.door) {
            this.mines.removeAll(true);
            this.numMines *= 1.25;
            this.player.reset(this.playerStartX, this.playerStartY);
            this.createMines();
            this.level++;
            this.healthText.text = this.statusString();
        } else { // A mine
            this.ow.play();
            this.health = Math.max(this.health - 10, 0);
            if (this.health === 0) {
                this.running = false;
                this.mines.forEach(function(mine) {
                    mine.alpha = 1;
                });
                game.time.events.add(2000, function() {
                    game.state.start('menu');
                }, this);
            }
            this.healthText.text = this.statusString();
        }
        this.player.alpha = 1;
    },

    spriteDistance: function(sprite, x, y) {
        return this.distance(sprite.x, sprite.y, x, y);
    },

    distance: function(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    nearestMineDistance: function(x, y) {
        var minD = 100000;
        var state = this;
        this.mines.forEach(function(mine) {
            var ds = state.spriteDistance(mine, x, y);
            if (ds < minD) {
                minD = ds;
            }
        });
        return minD;
    },

    statusString: function() {
        return 'Health: ' + this.health + '%   Level: ' + this.level;
    }
};
