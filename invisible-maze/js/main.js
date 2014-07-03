
var mainState = {
    preload: function() {
        game.load.image('mine', 'assets/mine.png');
        game.load.image('dude', 'assets/dude.png');
        game.load.image('door', 'assets/door.png');
        game.load.audio('ow', 'assets/ow.wav');
    },
            
    create: function() {
        ow = game.add.audio('ow');
        game.stage.backgroundColor = '303030';
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.x = 0;
        game.physics.p2.gravity.y = 0;

        playerStartX = 40;
        playerStartY = game.world.centerY;
        player = game.add.sprite(playerStartX, playerStartY, 'dude');
        game.physics.p2.enable(player);
        player.body.collideWorldBounds = true;
        player.body.mass = 1;
        player.body.fixedRotation = true;
        player.body.onBeginContact.add(spriteContact, this);

        door = game.add.sprite(game.world.width - 12, game.world.centerY, 'door');
        game.physics.p2.enable(door);
        door.body.mass = 10000;
        door.body.fixedRotation = true;

        mines = game.add.group();
        createMines();

        healthText = game.add.text(16, 16, statusString(), { fontSize: '12px', fill: '#fff' });

        cursors = game.input.keyboard.createCursorKeys();
    },
            
    update: function() {
        var moveAmt = 200;
        player.body.setZeroVelocity();

        if (running) {
            var moved = false;

            if (cursors.left.isDown) {
                player.body.moveLeft(moveAmt);
                moved = true;
            }
            if (cursors.right.isDown) {
                player.body.moveRight(moveAmt);
                moved = true;
            }
            if (cursors.up.isDown) {
                player.body.moveUp(moveAmt);
                moved = true;
            }
            if (cursors.down.isDown) {
                player.body.moveDown(moveAmt);
                moved = true;
            }

            if (moved) {
                player.alpha = 0;
            }

            mines.forEach(function(mine) {
                var ds = spriteDistance(mine, player.x, player.y);
                var thresh = 100;
                mine.alpha = 1.0 - Math.min(thresh, ds) / thresh;
            });
        }
    }
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');

var player;
var door;
var cursors;
var health = 100;
var healthText;
var mines;
var running = true;
var numMines = 60;
var level = 1;
var playerStartX;
var playerStartY;
var ow;

function createMines() {
    for (var i = 0; i < numMines; i++) {
        var newX = 20 + Math.random() * (game.world.width - 40);
        var newY = 20 + Math.random() * (game.world.height - 40);
        if (spriteDistance(player, newX, newY) > 50 && nearestMineDistance(newX, newY) > 50) {
            var mine = mines.create(newX, newY, 'mine');
            game.physics.p2.enable(mine);
            mine.body.mass = 10;
            mine.body.fixedRotation = true;
        }
    }
}

function spriteContact(body, shapeA, shapeB, equation) {
    if (body.sprite === door) {
        mines.removeAll(true);
        numMines *= 1.25;
        player.reset(playerStartX, playerStartY);
        createMines();
        level++;
        healthText.text = statusString();
    } else { // A mine
        ow.play();
        health = Math.max(health - 10, 0);
        if (health === 0) {
            healthText.text = 'Game over';
            running = false;
            mines.forEach(function(mine) {
                mine.alpha = 1;
            });
        } else {
            healthText.text = statusString();
        }
    }
    player.alpha = 1;
}

function spriteDistance(sprite, x, y) {
    return distance(sprite.x, sprite.y, x, y);
}

function distance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function nearestMineDistance(x, y) {
    var minD = 100000;
    mines.forEach(function(mine) {
        var ds = spriteDistance(mine, x, y);
        if (ds < minD) {
            minD = ds;
        }
    });
    return minD;
}

function statusString() {
    return 'Health: ' + health + '%   Level: ' + level;
}
