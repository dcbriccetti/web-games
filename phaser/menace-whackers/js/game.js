const menaceWhackers = {
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
        const ldef = this.levelDef;
        this.levelDefs = [
            ldef('Leaf Blowers', 'BlowerSpriteSheet.png', [68, 96], 'blower.wav', [0, 1, 2, 3, 4, 5, 6])
        ];
        for (let i = 0; i < this.levelDefs.length; ++i) {
            const levelDef = this.levelDefs[i];
            const dim = levelDef.menaceDimensions;
            this.load.spritesheet(levelDef.menaceName,
                'assets/' + levelDef.menaceSpritesheet, dim[0], dim[1]);
            this.load.audio(levelDef.menaceName, 'assets/' + levelDef.menaceAudioFilename);
        }
        this.load.image('whacker', 'assets/whacker.png');
        this.load.image('trash',   'assets/trash.png');
    },

    create: function() {
        const self = this;

        this.stage.backgroundColor = '303030';
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.restitution = 0.5;

        this.menaces = this.add.group();
        this.createMenaces();
        this.trash = this.add.sprite(this.world.width - 50, this.world.height - 50, 'trash');
        this.trash.anchor.setTo(0.5);
        this.physics.p2.enable(this.trash);
        this.trash.body.static = true;
        
        this.trash.body.onBeginContact.add(function(body, shapeA, shapeB, equation) {
            if (body.sprite !== self.whacker) {
                body.sprite.kill();
                document.getElementById('score').textContent = ++self.score;
                self.menaceSound.fadeTo(10, self.menaces.total / self.maxMenaces);
                if (self.menaces.total === 0 && self.level < self.levelDefs.length) {
                    self.level++;
                    self.createMenaces();
                }
            }
        });

        this.whacker = this.add.sprite(this.world.width / 2, this.world.height - 250, 'whacker');
        this.physics.p2.enable(this.whacker);
        this.whacker.body.mass = this.whackerMass;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spinBoostKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
        this.spinBoostKey.onDown.add(this.boostSpin, this);
        this.generateKey = this.input.keyboard.addKey(Phaser.Keyboard.G);
        this.generateKey.onDown.add(this.createMenace, this);
    },
    
    createMenace: function() {
        const levelDef = this.levelDefs[this.level - 1];
        const x = this.rnd.integerInRange(20, this.world.width - 40);
        const y = this.rnd.integerInRange(20, this.world.height - 40);
        const menace = this.menaces.create(x, y, levelDef.menaceName);
        this.physics.p2.enable(menace);
        menace.animations.add('operate', levelDef.animationSequence);
        menace.animations.play('operate', 10, true);
    },

    createMenaces: function() {
        const levelDef = this.levelDefs[this.level - 1];
        this.menaceSound = this.add.audio(levelDef.menaceName);
        this.menaceSound.loopFull(1);
        this.menaceSound.play();

        for (let n = 0; n < this.maxMenaces; ++n) {
            this.createMenace();
        }
        
        document.getElementById('level').textContent = levelDef.menaceName;
    },
    
    update: function() {
        const moveAmt = 500;
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

new Phaser.Game(1000, 750, Phaser.AUTO, '', menaceWhackers);
