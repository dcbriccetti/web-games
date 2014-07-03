var menuState = {
    
    create: function() {
        game.stage.backgroundColor = '#00f';
        var nameLabel = game.add.text(game.world.centerX, 80,
            "Invisible Player Escapes Maze", {
                font: '50px Arial', fill: '#fff'
            });
        nameLabel.anchor.setTo(0.5, 0.5);

        var startLabel = game.add.text(game.world.centerX, 
            game.world.height - 80,
            "Press space to start", {
                font: '25px Arial', fill: '#fff'
            });
        startLabel.anchor.setTo(0.5, 0.5);
        
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.addOnce(this.start, this);
    },
            
    start: function() {
        game.state.start('play');
    }
};
