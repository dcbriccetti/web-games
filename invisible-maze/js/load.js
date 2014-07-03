var loadState = {

    preload: function() {
        game.load.image('mine', 'assets/mine.png');
        game.load.image('dude', 'assets/dude.png');
        game.load.image('door', 'assets/door.png');
        game.load.audio('ow',   'assets/ow.wav');
    },
    
    create: function() {
        game.state.start('menu');
    }
};
