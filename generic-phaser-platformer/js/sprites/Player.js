(function (global) {

    var Vect = Garfunkel.Vect;

    var MODES = {
        PLAY: 0,
        TALKY : 1,
        TALK: 2,
        RESPAWN: 3
    };

    var Player = function (game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'player');
        this.respawnPoint = new Vect(x, y);
        this.respawnMove = null;
        game.physics.arcade.enable(this);
        this.scale.x = -1; //flipped
        this.anchor.setTo(0.5, 1); //so it flips around its middle
        this.body.setSize(14, 13, 0, 0);
        this.body.bounce.y = 0.0;
        this.body.gravity.y = 600;
        this.body.collideWorldBounds = true;
        this.animations.add('walk', [2, 3], 10, true);
        this.animations.add('idle', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4], 10, true);
        this.animations.add('respawn', [2, 8], 10, true);
        this.body.mass = 1;
        this.game = game;
        this.cursors = game.input.keyboard.createCursorKeys();
        this.movementEnabled = true;
        this.mode = MODES.PLAY;
        this.canJump = true;
        this.currentNPC = null;

        //Up key must be released to re-jump
        this.cursors.up.onUp.add(function () {
            this.canJump = true;
        }, this);
        //Dialog handling
        var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add( this.startTalk, this);
        talk.init().onClose( this.stopTalk, this);

        this.hit = game.add.audio('hit');
        this.jump = game.add.audio('jump');

    };


    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.create = function () {
        console.log('player create');
    };

    Player.prototype.update = function () {
        var idle = true;
        this.body.velocity.x = 0;

        switch (this.mode) {
            case MODES.PLAY:
            this.body.enable = true;
            if (this.cursors.left.isDown || gamepad.state.C) {
                this.body.velocity.x = -150;
                this.animations.play('walk');
                flipLeft(this);
                idle = false;
            } else if (this.cursors.right.isDown || gamepad.state.F) {
                this.body.velocity.x = 150;
                this.animations.play('walk');
                flipRight(this);
                idle = false;
            }
            if ((this.cursors.up.isDown || gamepad.state.B || gamepad.state.E) &&
            (this.body.onFloor() || this.body.touching.down) &&
            this.canJump) {
                this.body.velocity.y = -300;
                idle = false;
                this.canJump = false;
                this.jump.play();
            }
            break;

            case MODES.TALK:
            this.body.enable = false;
            //Nothing to move here
            break;

            case MODES.RESPAWN:
            this.body.enable = false;
            this.animations.play('respawn');
            idle = false;
            if (this.respawnPoint.distance(new Vect(this.x, this.y)) < 30) {
                this.mode = MODES.PLAY;
                this.respawnMove = null;
            } else {
                if (!this.respawnMove) {
                    this.respawnMove = new Vect(this.x, this.y).sub(this.respawnPoint).normalize(10);
                }
                this.x -= this.respawnMove.x;
                this.y -= this.respawnMove.y;
            }
            break;
            default:
            //noop
        }

        //  Stand still
        if (idle){
            this.animations.play('idle');
        }
    };

    var disableRestartTalk = false; //helper variable for timing
    Player.prototype.startTalk = function(){
        if (this.currentNPC && this.mode == MODES.PLAY) {
            if(disableRestartTalk){
                disableRestartTalk = false;
            }else{
                this.mode = MODES.TALK;
                var dialog = this.currentNPC.startTalk();
                if(dialog)
                    talk.show(dialog);
                else
                    console.error('No dialog found for ID '+dialog);
            }
        }
    };

    Player.prototype.stopTalk = function(){
        this.mode = MODES.PLAY;
        talk.hide();
        if(this.currentNPC ){
            this.currentNPC.stopTalk();
        }
        disableRestartTalk = true;
        console.log('close callback', this.currentNPC);
    };

    Player.prototype.modeClear = function(){
        if(this.mode == MODES.PLAY){
            this.currentNPC = null;
        }
    };

    Player.prototype.setCurrentNPC = function(npc){
        this.currentNPC = npc;
    };

    Player.prototype.killMe = function () {
        this.hit.play();
        this.mode = MODES.RESPAWN;
    };

    Player.prototype.setRespawnPoint = function(){
        if(this.respawnPoint.x < this.x)
            this.respawnPoint.set(this.x,this.y);
    };



    global.Player = Player;

})(this);
