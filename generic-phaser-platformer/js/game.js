(function () {

    var game = new Phaser.Game(384, 256,
        Phaser.AUTO,
        'game',
        null,  //{preload: preload, create: create, update: update}
        false, //transparent
        false   //antialias
    );

    game.state.add("preload", PreloadState);
    game.state.add("menu", MenuState);
    game.state.add("play", PlayState);
    game.state.start("preload");

})();
