(function (global) {
    var LEFT = true;
    var RIGHT = false;
    var Enemy1 = function (game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'enemy1');

        this.animations.add('idle', [0, 1], 4, true);
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
        this.animations.play('walk');

        game.physics.arcade.enable(this);
        this.body.bounce.y = 0.0;
        this.body.gravity.y = 600;
        this.body.setSize(14, 13, 0, 0);

        this.scale.x = -1; //flipped
        this.anchor.setTo(0.5, 1);

        this.direction = LEFT;
        this.game = game;
    };

    Enemy1.prototype = Object.create(Phaser.Sprite.prototype);
    Enemy1.prototype.constructor = Enemy1;

    Enemy1.prototype.update = function () {
        if(this.direction === LEFT){
            this.body.velocity.x = -50;
            this.animations.play('walk');
            flipLeft(this);
        }else{
            this.body.velocity.x = 50;
            this.animations.play('walk');
            flipRight(this);
        }

        if(this.body.blocked.left) {
            this.direction = RIGHT;
        }else if(this.body.blocked.right){
            this.direction = LEFT;
        }
    };

    global.Enemy1 = Enemy1;

})(this);
