Game = function(game) {};

Game.prototype = {
    levelDefs:          null,
    level:              1,
    score:              0,
    whacker:            null,
    whackerMass:        1000,
    maxMenaces:         10,
    angularVelocity:    10,
    cursors:            null,
    trash:              null,
    menaces:            null,
    menaceSound:        null,
    
    levelDef: function(menaceName, menaceSpritesheet, menaceDimensions, menaceAudioFilename, animationSequence) {
        return {
            menaceName:             menaceName,
            menaceSpritesheet:      menaceSpritesheet,
            menaceDimensions:       menaceDimensions,
            menaceAudioFilename:    menaceAudioFilename,
            animationSequence:      animationSequence
        };
    },
    
    preload: function() {
        var i, levelDef, dim;
        var ldef = this.levelDef;
        this.levelDefs = [
            ldef('Leaf Blowers', 'BlowerSpriteSheet.png', [68, 96], 'blower.wav', [0, 1, 2, 3, 4, 5, 6])
        ];
        for (i = 0; i < this.levelDefs.length; ++i) {
            levelDef = this.levelDefs[i];
            dim = levelDef.menaceDimensions;
            game.load.spritesheet(levelDef.menaceName, 'assets/' + levelDef.menaceSpritesheet, dim[0], dim[1]);
            game.load.audio(levelDef.menaceName, 'assets/' + levelDef.menaceAudioFilename);
        }
        game.load.image('whacker', 'assets/whacker.png');
        game.load.image('trash',   'assets/trash.png');
    },

    create: function() {
        var self = this;

        game.stage.backgroundColor = '303030';
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = 0.5;

        this.menaces = game.add.group();
        this.createMenaces();
        this.trash = game.add.sprite(game.world.width - 50, game.world.height - 50, 'trash');
        this.trash.anchor.setTo(.5);
        game.physics.p2.enable(this.trash);
        this.trash.body.static = true;
        
        this.trash.body.onBeginContact.add(function(body, shapeA, shapeB, equation) {
            if (body.sprite !== self.whacker) {
                body.sprite.kill();
                document.getElementById('score').innerHTML = ++self.score;
                self.menaceSound.fadeTo(10, self.menaces.total / self.maxMenaces);
                if (self.menaces.total === 0 && self.level < self.levelDefs.length) {
                    self.level++;
                    self.createMenaces();
                }
            }
        });

        this.whacker = game.add.sprite(game.world.width / 2, game.world.height - 250, 'whacker');
        game.physics.p2.enable(this.whacker);
        this.whacker.body.mass = this.whackerMass;

        this.cursors = game.input.keyboard.createCursorKeys();
        this.spinBoostKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.spinBoostKey.onDown.add(this.boostSpin, this);
    },

    createMenaces: function() {
        var levelDef = this.levelDefs[this.level - 1];
        this.menaceSound = game.add.audio(levelDef.menaceName);
        this.menaceSound.loopFull(1);
        this.menaceSound.play();

        for (var n = 0; n < this.maxMenaces; ++n) {
            var x = game.rnd.integerInRange(20, game.world.width  - 40);
            var y = game.rnd.integerInRange(20, game.world.height - 40);
            var menace = this.menaces.create(x, y, levelDef.menaceName);
            game.physics.p2.enable(menace);
            menace.animations.add('operate', levelDef.animationSequence);
            menace.animations.play('operate', 4, true);
        }
        
        document.getElementById('level').innerHTML = levelDef.menaceName;
    },
    
    update: function() {
        var moveAmt = 500;
        this.whacker.body.setZeroVelocity();

        if (this.cursors.left.isDown) {
            if (this.cursors.left.shiftKey) {
                this.whacker.body.angularVelocity = -this.angularVelocity;
            }
            this.whacker.body.moveLeft(moveAmt);
        }
        if (this.cursors.right.isDown) {
            if (this.cursors.right.shiftKey) {
                this.whacker.body.angularVelocity = this.angularVelocity;
            }
            this.whacker.body.moveRight(moveAmt);
        }
        if (this.cursors.up.isDown) {
            this.whacker.body.moveUp(moveAmt);
        }
        if (this.cursors.down.isDown) {
            this.whacker.body.moveDown(moveAmt);
        }
    },
    
    boostSpin: function() {
        this.angularVelocity = 30;
    }
};

var game = new Phaser.Game(1000, 750, Phaser.AUTO, '');
game.state.add('Game', Game);
game.state.start('Game');
