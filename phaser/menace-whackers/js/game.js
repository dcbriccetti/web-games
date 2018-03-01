const state = {
    levelDefs: null,
    level: 1,
    score: 0,
    whacker: null,
    whackerMass: 1000,
    maxMenaces: 10,
    angularVelocity: 10,
    cursors: null,
    trash: null,
    menaces: null,
    menaceSound: null
};
    
function levelDef(menaceName, menaceSpritesheet, menaceDimensions, menaceAudioFilename, animationSequence) {
    return {
        menaceName:             menaceName,
        menaceSpritesheet:      menaceSpritesheet,
        menaceDimensions:       menaceDimensions,
        menaceAudioFilename:    menaceAudioFilename,
        animationSequence:      animationSequence
    };
}

function preload() {
    const ldef = levelDef;
    state.levelDefs = [
        ldef('Leaf Blowers', 'BlowerSpriteSheet.png', [68, 96], 'blower.wav', [0, 1, 2, 3, 4, 5, 6])
    ];
    for (let i = 0; i < state.levelDefs.length; ++i) {
        const levelDef = state.levelDefs[i];
        const dim = levelDef.menaceDimensions;
        this.load.spritesheet(levelDef.menaceName,
            'assets/' + levelDef.menaceSpritesheet,
            {'frameWidth': dim[0], 'frameHeight': dim[1]});
        this.load.audio(levelDef.menaceName, 'assets/' + levelDef.menaceAudioFilename);
    }
    this.load.image('whacker', 'assets/whacker.png');
    this.load.image('trash',   'assets/trash.png');
}

function create() {
    console.log(this);
    //todo this.stage.backgroundColor = '303030';
    //todo this.physics.startSystem(Phaser.Physics.P2JS);
    //todo this.physics.p2.restitution = 0.5;

    state.menaces = this.add.group();
    createMenaces();
    state.trash = this.add.sprite(this.world.width - 50, this.world.height - 50, 'trash');
    state.trash.anchor.setTo(0.5);
    this.physics.p2.enable(state.trash);
    state.trash.body.static = true;

    state.trash.body.onBeginContact.add(function(body, shapeA, shapeB, equation) {
        if (body.sprite !== state.whacker) {
            body.sprite.kill();
            document.getElementById('score').textContent = ++state.score;
            state.menaceSound.fadeTo(10, state.menaces.total / state.maxMenaces);
            if (state.menaces.total === 0 && state.level < state.levelDefs.length) {
                state.level++;
                createMenaces();
            }
        }
    });

    state.whacker = this.add.sprite(this.world.width / 2, this.world.height - 250, 'whacker');
    this.physics.p2.enable(state.whacker);
    state.whacker.body.mass = state.whackerMass;

    state.cursors = this.input.keyboard.createCursorKeys();
    state.spinBoostKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
    state.spinBoostKey.onDown.add(state.boostSpin, this);
    state.generateKey = this.input.keyboard.addKey(Phaser.Keyboard.G);
    state.generateKey.onDown.add(createMenace, this);
}

function createMenace() {
    const levelDef = state.levelDefs[state.level - 1];
    const x = this.rnd.integerInRange(20, this.world.width - 40);
    const y = this.rnd.integerInRange(20, this.world.height - 40);
    const menace = state.menaces.create(x, y, levelDef.menaceName);
    this.physics.p2.enable(menace);
    menace.animations.add('operate', levelDef.animationSequence);
    menace.animations.play('operate', 10, true);
}

function createMenaces() {
    const levelDef = state.levelDefs[state.level - 1];
    state.menaceSound = this.add.audio(levelDef.menaceName);
    state.menaceSound.loopFull(1);
    state.menaceSound.play();

    for (let n = 0; n < state.maxMenaces; ++n) {
        state.createMenace();
    }

    document.getElementById('level').textContent = levelDef.menaceName;
}

function update() {
    const moveAmt = 500;
    state.whacker.body.setZeroVelocity();

    if (state.cursors.left.isDown) {
        if (state.cursors.left.shiftKey) {
            state.whacker.body.angularVelocity = -state.angularVelocity;
        }
        state.whacker.body.moveLeft(moveAmt);
    }
    if (state.cursors.right.isDown) {
        if (state.cursors.right.shiftKey) {
            state.whacker.body.angularVelocity = state.angularVelocity;
        }
        state.whacker.body.moveRight(moveAmt);
    }
    if (state.cursors.up.isDown) {
        state.whacker.body.moveUp(moveAmt);
    }
    if (state.cursors.down.isDown) {
        state.whacker.body.moveDown(moveAmt);
    }
}

function boostSpin() {
    state.angularVelocity = 30;
}

var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 750,
    physics: {
        'default': 'p2',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
