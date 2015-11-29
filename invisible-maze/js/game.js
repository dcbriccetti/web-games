var Maze = {
    showDebug: true
};

Maze.Preloader = function() {};
Maze.Preloader.prototype = {
    preload: function() {
        this.load.image('dude', 'assets/dude.png');
        this.load.image('door', 'assets/door.png');
        this.load.audio('ow',   'assets/ow.wav');
        // Lightning art from http://opengameart.org/content/lightning-shock-spell
        this.load.spritesheet('shock', 'assets/shock.png', 64, 50);
    },
    
    create: function() {
        this.state.start('menu');
    }
};

Maze.MainMenu = function() {};
Maze.MainMenu.prototype = {
    create: function() {
        this.stage.backgroundColor = '#00f';
        var nameLabel = this.add.text(this.world.centerX, -50,
            "Invisible Player Escapes Maze", {
                font: '50px Arial', fill: '#fff'
            });
        nameLabel.anchor.setTo(0.5, 0.5);
        this.add.tween(nameLabel).to({y: 80}, 1000).start();

        var startLabel = this.add.text(this.world.centerX, 
            this.world.height - 80,
            "Press space to start", {
                font: '25px Arial', fill: '#fff'
            });
        startLabel.anchor.setTo(0.5, 0.5);
        this.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 500).
            loop().start();
        
        var space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.addOnce(this.start, this);
    },
            
    start: function() {
        this.state.start('play');
    }
};

Maze.Game = function() {};
Maze.Game.prototype = {
    numMines: 30,

    create: function() {
        this.health = 100;
        this.level = 1;
        this.running = true;
        this.ow = this.add.audio('ow');
        this.stage.backgroundColor = '303030';
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.x = 0;
        this.physics.p2.gravity.y = 0;

        this.playerStartX = 40;
        this.playerStartY = this.world.centerY;
        this.player = this.add.sprite(this.playerStartX, this.playerStartY, 'dude');
        this.physics.p2.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.mass = 1;
        this.player.body.fixedRotation = true;
        this.player.body.onBeginContact.add(this.spriteContact, this);

        this.door = this.add.sprite(this.world.width - 12, this.world.centerY, 'door');
        this.physics.p2.enable(this.door);
        this.door.body.mass = 10000;
        this.door.body.fixedRotation = true;

        this.mines = this.add.group();
        this.createMines();

        this.healthText = this.add.text(16, 16, this.statusString(),
            { fontSize: '12px', fill: '#fff' });

        cursors = this.input.keyboard.createCursorKeys();
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
            var newX = this.rnd.integerInRange(20, this.world.width  - 40);
            var newY = this.rnd.integerInRange(20, this.world.height - 40);
            if (this.spriteDistance(this.player, newX, newY) > 70 &&
                    this.nearestMineDistance(newX, newY) > 70) {
                var mine = this.mines.create(newX, newY, 'shock');
                this.physics.p2.enable(mine);
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
                this.time.events.add(2000, function() {
                    this.state.start('menu');
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
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

game.state.add('load', Maze.Preloader);
game.state.add('menu', Maze.MainMenu);
game.state.add('play', Maze.Game);

game.state.start('load');
