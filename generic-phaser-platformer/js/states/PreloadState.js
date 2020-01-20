(function(global){
    var PreloadState = function(game){
        Phaser.State.call(this);
    };

    PreloadState.prototype = Object.create(Phaser.State.prototype);

    PreloadState.prototype.preload = function(){
        //Settings
        this.game.stage.smoothed = false;
        this.game.config.enableDebug = false;
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale(2, 2);
        this.game.time.advancedTiming = true;
        this.game.sound.mute = true;

        //Helper
        this.game.load.spritesheet('none', 'assets/1px.png', 1, 1);

        //Sprites
        this.game.load.spritesheet('player',        'assets/characters/player/charSprite.png', 16, 16);
        this.game.load.spritesheet('enemy1',        'assets/characters/enemy1/enemy1.png', 16, 16);
        this.game.load.spritesheet('npc',           'assets/characters/npc/npcSprite.png', 16, 16);
        this.game.load.spritesheet('checkpoint',    'assets/characters/checkpoint/checkpoint.png', 16, 16);

        //this.game.load.spritesheet('player',        'assets/characters/player/dummy.png', 16, 16);
        //this.game.load.spritesheet('enemy1',        'assets/characters/enemy1/dummy.png', 16, 16);
        //this.game.load.spritesheet('npc',           'assets/characters/npc/dummy.png', 16, 16);
        //this.game.load.spritesheet('checkpoint',    'assets/characters/checkpoint/dummy.png', 16, 16);


        //Buttons
        this.game.load.spritesheet("startButton","assets/buttons/StartButton.png",128,40);
        this.game.load.spritesheet("largeButton","assets/buttons/LargeButton.png",256,40);

        //Map: Level und Tiles
        this.game.load.tilemap('map', 'assets/tilemaps/tiled-map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet('background_tiles2', 'assets/tilemaps/background_tiles2.png', 16, 16);
        //this.game.load.spritesheet('background_tiles2', 'assets/tilemaps/dummy.png', 16, 16);

        //Sounds & Music
        this.game.load.audio('jump',        'assets/sounds/jump.wav');
        this.game.load.audio('hit',         'assets/sounds/hit.wav');
        this.game.load.audio('checkpoint',  'assets/sounds/checkpoint.wav');

        //Fonts

        //font load hack!!
        this.game.add.text(0, 0, "fix", {font:"1px PressStart2P", fill:"#FFFFFF"});
        //this.game.load.bitmapFont('Parvas', 'assets/fonts/parvas_medium_12.PNG', 'assets/fonts/parvas_medium_12.xml');

        //Dialogs
        this.game.load.text('dialog1', 'assets/dialogs/dialog.twee');


        this.game.load.onFileComplete.add(function (progress, key, success) {
            console.log(progress + '%', key + ' loaded', success);
        }, game);

        this.game.load.onLoadComplete.add(function(){
            //Post processing
            tweepee.addDialog("test", this.game.cache.getText('dialog1'));
        }, this);
    };

    PreloadState.prototype.create = function(){
        //this.game.state.start("play");
        this.game.state.start("menu");
    };

    global.PreloadState = PreloadState;
})(this);
