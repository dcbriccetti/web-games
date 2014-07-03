var menuState = {
    
    create: function() {
        game.stage.backgroundColor = '#00f';
        var nameLabel = game.add.text(game.world.centerX, -50,
            "Invisible Player Escapes Maze", {
                font: '50px Arial', fill: '#fff'
            });
        nameLabel.anchor.setTo(0.5, 0.5);
        var tween = game.add.tween(nameLabel);
        tween.to({y: 80}, 1000);
        tween.start();

        var startLabel = game.add.text(game.world.centerX, 
            game.world.height - 80,
            "Press space to start", {
                font: '25px Arial', fill: '#fff'
            });
        startLabel.anchor.setTo(0.5, 0.5);
        tween = game.add.tween(startLabel);
        tween.to({angle: -2}, 500);
        tween.to({angle: 2}, 500);
        tween.loop();
        tween.start();
        
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.addOnce(this.start, this);
    },
            
    start: function() {
        game.state.start('play');
    }
};
