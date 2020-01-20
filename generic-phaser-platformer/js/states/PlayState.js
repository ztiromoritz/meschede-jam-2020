(function(global){


    var EVENT_TYPES = {
        dialog: "dialog",
        respawn : "respawn"
    };

    var PlayState = function(){
        Phaser.State.call(this);
        this.dialog = {
            reset: function () {
                this.name = null;
                this.npcId = null;
                this.currentNode = null;
            }
        };
        this.dialog.reset();

        this.map = null;        //The tiled Map
        this.tileLayer = null;  //TileLayer
        this.platforms = null;  //Group for Platform Objects
        this.npcs = null;       //Group for NPC Sprites
        this.enemies = null;    //Group for Enemy Sprites
        this.checkpoints = null;//Group for Checkoints
        this.player = null;     //The Player sprite
        this.eventZones = null;
    };
    PlayState.prototype = Object.create(Phaser.State.prototype);

    PlayState.prototype.create = function(){
        var self = this;
        //config/gloabl stuff
        this.game.stage.backgroundColor = '#0aafe3';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.map = this.game.add.tilemap('map');
        // By conventions the name of tileset in json/tiled this.map
        // and the cacheKey for the tileset image hast to be the same
        this.map.addTilesetImage('background_tiles2');

        //Tiles - rastered Tiles with collision
        this.tileLayer = this.map.createLayer('Tiles');
        this.tileLayer.resizeWorld();
        this.map.setCollision(getGIDs('Boden', this.map), true, this.tileLayer);

        //Objects - free moveable objects
        // Platforms -- immovable = true, move = false
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;
        _.forEach(this.map.getTileinfoByProperty('platform'), function (tileinfo) {
            self.map.createFromObjects('Objects', tileinfo.gid, tileinfo.tileset, tileinfo.frame, true, false, self.platforms);
        });
        this.platforms.setAllChildren('body.moves', false);
        this.platforms.setAllChildren('body.immovable', true);
        this.platforms.forEach(function (item) {
            item.body.setSize(16, 13, 0, 1);
        });

        this.npcs = this.game.add.group();
        this.enemies = this.game.add.group();
        this.checkpoints = this.game.add.group();
        this.map.objects.Chars.forEach(function (char) {
            var properties = getTileProperties(char.gid, self.map);
            if (properties.type === 'player') {
                self.player = new Player(self.game, char.x, char.y);
                self.game.add.existing(self.player);
                self.game.camera.follow(self.player);
            } else if (properties.type === 'npc') {
                var npc = new NPC(self.game, char.x, char.y, char.properties);
                self.npcs.add(npc);
            } else if (properties.type === 'enemy') {
                var enemy1 = new Enemy1(self.game, char.x, char.y);
                self.enemies.add(enemy1);
            } else if (properties.type === 'checkpoint') {
                var checkpoint = new Checkpoint(self.game, char.x, char.y);
                self.checkpoints.add(checkpoint);
            }
        });

    };

    PlayState.prototype.update = function() {
        this.debugInfo();

        this.physics.arcade.collide(this.player, this.tileLayer);
        this.physics.arcade.collide(this.player, this.platforms);
        this.physics.arcade.collide(this.player, this.checkpoints,null, function(player, checkpoint){
            player.setRespawnPoint();
            checkpoint.trigger();
            return false;
        });
        this.physics.arcade.collide(this.enemies, this.tileLayer);
        this.npcs.callAll("modeClear");
        this.player.modeClear();
        this.physics.arcade.overlap(this.player, this.npcs, null, function(player, npc){
            player.setCurrentNPC(npc);
            npc.playerIsNear();
        });
        this.physics.arcade.collide(this.player,this.enemies,null ,function( player, enemy){
            player.killMe();
            return false; // TO avoid physical reaction
        });
        this.physics.arcade.overlap(this.enemies, this.platforms);


    };

    PlayState.prototype.debugInfo = function() {
        var self = this;
        if (this.game.config.enableDebug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
            this.game.debug.body(this.player);
            this.platforms.forEach(function (item) {
                self.game.debug.body(item);
            });

            this.npcs.forEach(function (item) {
                self.game.debug.body(item, 'rgba(0,255,0,0.2)');
            });

            this.checkpoints.forEach(function (item) {
                self.game.debug.body(item, 'rgba(255,0,0,0.2)');
            });
        }
    };

    global.PlayState = PlayState;
})(this);











//========================================
//========================================

//=== Event Zone Handler
//=======
