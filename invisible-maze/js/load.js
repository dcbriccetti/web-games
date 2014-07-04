var loadState = {

    preload: function() {
        game.load.image('dude', 'assets/dude.png');
        game.load.image('door', 'assets/door.png');
        game.load.audio('ow',   'assets/ow.wav');
        // Lightning art from http://opengameart.org/content/lightning-shock-spell
        game.load.spritesheet('shock', 'assets/shock.png', 64, 50);
    },
    
    create: function() {
        game.state.start('menu');
    }
};
