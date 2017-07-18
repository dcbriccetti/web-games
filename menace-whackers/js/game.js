Game = function(game) {};

Game.prototype = {
    whacker: null,
    whackerMass: 1000,
    maxMenaces: 20,
    cursors: null,
    trash: null,
    menaceNames: ['blowers'],
    menaceSpritesheets: ['BlowerSpriteSheet.png'],
    menaceDimensions: [[68, 96]],
    menaces: null,
    level: 1,
    menaceSound: null,

    preload: function() {
        var dim = this.menaceDimensions[0];
        game.load.spritesheet(this.menaceNames[0], 'assets/' + this.menaceSpritesheets[0], dim[0], dim[1]);
        game.load.image('whacker', 'assets/whacker.png');
        game.load.image('trash', 'assets/trash.png');
        game.load.audio('blower', 'assets/blower.wav');
    },

    create: function() {
        var self = this;
        var whackKey;
        this.menaceSound = game.add.audio('blower');
        this.menaceSound.loopFull(1);
        this.menaceSound.play();

        game.stage.backgroundColor = '303030';
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = 0.5;

        this.menaces = game.add.group();

        for (var n = 0; n < this.maxMenaces; ++n) {
            var x = game.rnd.integerInRange(20, game.world.width  - 40);
            var y = game.rnd.integerInRange(20, game.world.height - 40);
            var menace = this.menaces.create(x, y, this.menaceNames[this.level - 1]);
            game.physics.p2.enable(menace);
            menace.animations.add('operate', [0, 6]);
            menace.animations.play('operate', 4, true);
        }

        this.trash = game.add.sprite(game.world.width - 50, game.world.height - 50, 'trash');
        this.trash.anchor.setTo(.5);
        game.physics.p2.enable(this.trash);
        this.trash.body.static = true;
        this.trash.body.onBeginContact.add(function(body, shapeA, shapeB, equation) {
            if (body.sprite !== self.whacker) {
                body.sprite.kill();
                self.menaceSound.fadeTo(10, self.menaces.total / self.maxMenaces);
            }
        });

        this.whacker = game.add.sprite(game.world.width / 2, game.world.height - 250, 'whacker');
        game.physics.p2.enable(this.whacker);
        this.whacker.body.mass = this.whackerMass;

        this.cursors = game.input.keyboard.createCursorKeys();
        whackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        whackKey.onDown.add(this.spin, this);
    },

    update: function() {
        var moveAmt = 500;
        this.whacker.body.setZeroVelocity();

        if (this.cursors.left.isDown) {
            this.whacker.body.moveLeft(moveAmt);
        }
        if (this.cursors.right.isDown) {
            this.whacker.body.moveRight(moveAmt);
        }
        if (this.cursors.up.isDown) {
            this.whacker.body.moveUp(moveAmt);
        }
        if (this.cursors.down.isDown) {
            this.whacker.body.moveDown(moveAmt);
        }
    },

    spin: function() {
        this.whacker.body.angularVelocity = 10;
    }
};

var game = new Phaser.Game(800, 500, Phaser.AUTO, '');
game.state.add('Game', Game);
game.state.start('Game');
