(function(global){

    var MODES = {
        IDLE: 0,
        TALKY: 1,
        TALK: 2
    };

    var NPC = function(game, x , y, properties){
        Phaser.Sprite.call(this, game, x, y, 'npc');
        var self = this;
        this.mode = MODES.IDLE;
        this.properties = properties;
        game.physics.arcade.enable(this);
        this.enableBody = true;
        this.body.setSize(120,80,-52,0);
        this.animations.add('idle', [0, 1], 3.5, true);
        this.animations.add('talky', [8, 9, 10, 11], 3.5, true);
        this.animations.add('talk', [2, 3], 3.5, true);
        this.anchor.setTo(0, 1);
    };

    NPC.prototype = Object.create(Phaser.Sprite.prototype);
    NPC.prototype.constructor = NPC;

    NPC.prototype.update = function () {
        switch (this.mode) {
            case MODES.IDLE:
            this.animations.play('idle');
            break;
            case MODES.TALKY:
            this.animations.play('talky');
            break;
            case MODES.TALK:
            this.animations.play('talk');
            break;
            default:
        }
    };

    NPC.prototype.modeClear = function(){
        if(this.mode == MODES.TALKY){
            this.mode = MODES.IDLE;
        }
    };

    NPC.prototype.playerIsNear = function(){
        if(this.mode == MODES.IDLE){
            this.mode = MODES.TALKY;
        }
    };

    NPC.prototype.startTalk = function() {
        console.log("start talk npc");
        if(this.mode == MODES.TALKY){
            this.mode = MODES.TALK;
            return this.properties.dialog;
        }
    };

    NPC.prototype.stopTalk = function() {
        console.log("stop talk npc");
        if(this.mode == MODES.TALK){
            this.mode = MODES.TALKY;
        }
    };
    global.NPC = NPC;

})(this);
