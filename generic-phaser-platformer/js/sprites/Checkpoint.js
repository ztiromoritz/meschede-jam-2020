(function (global) {

    var Checkpoint = function (game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'checkpoint',0);
        this.game = game;
        game.physics.arcade.enable(this);
        this.body.setSize(16, 600, 0, 0);
        this.anchor.setTo(0.5, 1); //so it flips around its middle
        this.animations.add('up', [1,2,3,4,5,6,7,8,9], 25 , true);
        this.triggered = false;
        this.sound = game.add.audio('checkpoint');
    };


    Checkpoint.prototype = Object.create(Phaser.Sprite.prototype);
    Checkpoint.prototype.constructor = Checkpoint;

    Checkpoint.prototype.create = function () {

    };

    Checkpoint.prototype.update = function () {

    };

    Checkpoint.prototype.trigger = function(){
        if(!this.triggered){
            this.triggered = true;
            this.sound.play();
            this.animations.play('up', null, false);
        }
    }

    global.Checkpoint = Checkpoint;

})(this);
