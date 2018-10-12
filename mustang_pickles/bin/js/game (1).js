var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CustomGameState = /** @class */ (function (_super) {
    __extends(CustomGameState, _super);
    function CustomGameState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.changeGameState = function (stateKey) {
            _this.checkpointPlayer();
            _this.game.state.start(stateKey);
        };
        _this.checkpointPlayer = function () {
            // default does nothing 
        };
        return _this;
    }
    CustomGameState.prototype.preload = function () {
        this.mouseCoordToggle = false;
    };
    CustomGameState.prototype.create = function () {
        this.mouseCoordinateKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
    };
    CustomGameState.prototype.update = function () {
        if (this.mouseCoordinateKey.isDown) {
            this.mouseCoordToggle = !this.mouseCoordToggle;
            console.log('mouse coord' + this.mouseCoordToggle);
        }
        if (this.mouseCoordToggle) {
            console.log('x: ' + this.game.input.x + ', y: ' + this.game.input.y);
        }
    };
    return CustomGameState;
}(Phaser.State));
// tell the transpiler that this depends on CustomGameState being first
/// <reference path="CustomGameState.ts" />
var BlowFishBattle = /** @class */ (function (_super) {
    __extends(BlowFishBattle, _super);
    function BlowFishBattle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fireSpike = function () {
            _this.blowfish_weapon.fire(_this.blowfish);
            _this.blowfish.bringToTop();
        };
        _this.fireBullet = function () {
            if (_this.game.time.now > _this.bulletTime) {
                var bullet = _this.bullets.getFirstExists(false);
                if (bullet) {
                    bullet.reset(_this.player.x + 50, _this.player.y - 1);
                    bullet.body.velocity.x = 600;
                    _this.bulletTime = _this.game.time.now + 600;
                }
            }
        };
        _this.cathitbyspike = function (cat, spike) {
            _this.player.health -= _this.health_decrease;
            console.log('ouch');
            console.log('health @:' + _this.player.health);
            _this.playerHealthText.text = 'Player Health: ' + _this.player.health;
            spike.kill();
            if (_this.player.health <= 0) {
                _this.player.animations.play('dying');
                // this.player.kill();
                _this.game.state.start('GameOver');
                cat.kill();
            }
        };
        _this.blowfishhitbybullet = function (blowfish, bullet) {
            _this.blowfish_health -= _this.blowfish_health_decrease;
            console.log('blowfish hit by bullet');
            console.log('bf health @:' + _this.blowfish_health);
            _this.enemyHealthText.text = 'Enemy Health: ' + _this.blowfish_health;
            console.log(bullet);
            console.log(blowfish);
            bullet.kill();
            if (_this.blowfish_health <= 0) {
                console.log('blowfish killed');
                _this.blowfish.kill();
                _this.spike_timer.stop();
                _this.game.state.start('LevelPicker');
            }
        };
        _this.bullethitsspike = function (bullet, spike) {
            console.log('spike hit by bullet');
            bullet.kill();
            spike.kill();
        };
        //  Called if the bullet goes out of the screen
        _this.resetBullet = function (bullet) {
            bullet.kill();
        };
        return _this;
    }
    BlowFishBattle.prototype.preload = function () {
        this.load.image('bfbg', 'assets/tilemaps/tiles/battlebg.png');
        this.load.spritesheet('mustangbc', 'assets/sprites/mustangbattlechar.png', 160, 320);
        //  this.load.atlas('bfb', 'assets/sprites/blowfishbattle_json.png', 'assets/sprites/blowfishbattle_json.json');
        this.load.atlas('fish', 'assets/sprites/blowfishatlas.png', 'assets/sprites/blowfishatlas.json');
        this.load.image('bullet', 'assets/misc/bullet0.png');
        this.load.image('spikes', 'assets/sprites/spikes.png');
        //    this.load.image('blowfishspikeimage', 'assets/sprites/blowfishspike.png');
        this.player;
        // this.blowfishs;
        this.bullet;
        this.bullets;
        this.bulletTime = 0;
        this.spikeTime = 0;
        this.spike;
        this.spikespeed = 600;
        this.enemy;
        this.blowfish;
        //  Left, right and space key for controls
        this.spaceKey;
        this.bKey;
        this.health_start = 100;
        this.health_decrease = 10;
        this.blowfish_health = 100;
        this.blowfish_health_decrease = 10;
        _super.prototype.preload.call(this);
    };
    BlowFishBattle.prototype.create = function () {
        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.bf = this.add.tileSprite(0, 0, 1600, 1600, 'bfbg');
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(35, 'bullet');
        this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
        this.bullets.setAll('checkWorldBounds', true);
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.B]);
        this.spikes = this.add.group();
        this.spikes.enableBody = true;
        this.spikes.physicsBodyType = Phaser.Physics.ARCADE;
        this.spikes.createMultiple(35, 'spikes');
        this.spikes.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
        this.spikes.setAll('checkWorldBounds', true);
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.B]);
        this.blowfish = this.add.sprite(350, 250, 'fish');
        var frameNames = Phaser.Animation.generateFrameNames('Blowfishfront', 0, 3, '', 4);
        this.blowfish.animations.add('swim', frameNames, 3, true, false);
        this.blowfish.animations.play('swim');
        this.blowfish.enableBody = true;
        this.physics.enable(this.blowfish, Phaser.Physics.ARCADE);
        // The player and its settings
        this.player = this.add.sprite(250, 250, 'mustangbc');
        // this.enemy = this.add.sprite(500, 250, 'blowfishspikeimage');
        //  We need to enable physics on the player
        this.physics.arcade.enable(this.player);
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.allowGravity = false;
        this.player.body.bounce.y = 0.7 + Math.random() * 0.2;
        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.animations.add('claw', [9, 10, 11], 2, true);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bKey = this.input.keyboard.addKey(Phaser.Keyboard.B);
        this.add.tween(this.blowfish).to({ y: 100 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
        this.blowfish_weapon = new WeaponEightWay(this, 'spikes', 450, 299);
        this.player.health = this.health_start;
        //this.octopus.oxygen = this.oxygen_start;
        //  Create our Timer
        this.spike_timer = this.time.create(false);
        //  Set a TimerEvent to occur after 2 seconds
        this.spike_timer.loop(5, this.fireSpike, this);
        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        this.spike_timer.start();
        this.playerHealthText = this.add.text(16, 16, 'Player Health: ' + this.player.health, { fontSize: '32px', fill: '#fff' });
        this.playerHealthText.fixedToCamera = true;
        this.playerHealthText.cameraOffset.setTo(16, 16);
        this.enemyHealthText = this.add.text(450, 16, 'Enemy Health: ' + this.blowfish_health, { fontSize: '32px', fill: '#fff' });
        this.enemyHealthText.fixedToCamera = true;
        this.enemyHealthText.cameraOffset.setTo(450, 16);
        _super.prototype.create.call(this);
    };
    BlowFishBattle.prototype.update = function () {
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            //  Move to the right
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }
        else if (this.spaceKey.isDown) {
            this.fireBullet();
        }
        else if (this.bKey.isDown) {
            this.player.body.velocity.x = 5;
            this.player.animations.play('claw');
        }
        else {
            //  Stand still
            this.player.animations.stop();
            this.player.frame = 4;
        }
        this.physics.arcade.overlap(this.player, this.blowfish_weapon, this.cathitbyspike, null, this);
        // sprite will always be the first in overlap params regardless of parameter order, for call back
        this.physics.arcade.overlap(this.blowfish, this.bullets, this.blowfishhitbybullet, null, this);
        this.physics.arcade.overlap(this.bullets, this.blowfish_weapon, this.bullethitsspike, null, this);
        this.blowfish.animations.play('blowfishfront');
        _super.prototype.update.call(this);
    };
    return BlowFishBattle;
}(CustomGameState));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(game, key) {
        var _this = _super.call(this, game, 0, 0, key) || this;
        _this.fire = function (x, y, angle, speed, gx, gy) {
            gx = gx || 0;
            gy = gy || 0;
            _this.reset(x, y);
            _this.scale.set(1);
            _this.game.physics.arcade.velocityFromAngle(angle, speed, _this.body.velocity);
            _this.angle = angle;
            _this.body.gravity.set(gx, gy);
        };
        _this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        _this.anchor.set(0.5);
        _this.checkWorldBounds = true;
        _this.outOfBoundsKill = true;
        _this.exists = false;
        _this.tracking = false;
        _this.scaleSpeed = 0;
        return _this;
    }
    Bullet.prototype.update = function () {
        //console.log(this);
        if (this.tracking) {
            this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        }
        if (this.scaleSpeed > 0) {
            this.scale.x += this.scaleSpeed;
            this.scale.y += this.scaleSpeed;
        }
    };
    ;
    return Bullet;
}(Phaser.Sprite));
var WeaponEightWay = /** @class */ (function (_super) {
    __extends(WeaponEightWay, _super);
    function WeaponEightWay(game, spriteKey, width, height) {
        var _this = _super.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE) || this;
        _this.fire = function (source) {
            if (_this.game.time.time < _this.nextFire) {
                return;
            }
            // 
            var x = source.x + (_this.width_sprite / 2); // half width, to center it on blowfish
            var y = source.y + (_this.height_sprite / 2); // half height, to center it on blowfish
            console.log('x: ' + x + ', y: ' + y);
            console.log('width: ' + _this.width + ', height: ' + _this.height);
            _this.getFirstExists(false).fire(x, y, 0, _this.bulletSpeed, 0, 0);
            _this.getFirstExists(false).fire(x, y, 45, _this.bulletSpeed, 0, 0);
            _this.getFirstExists(false).fire(x, y, 90, _this.bulletSpeed, 0, 0);
            _this.getFirstExists(false).fire(x, y, 135, _this.bulletSpeed, 0, 0);
            _this.getFirstExists(false).fire(x, y, 180, _this.bulletSpeed, 0, 0);
            _this.getFirstExists(false).fire(x, y, 225, _this.bulletSpeed, 0, 0);
            _this.getFirstExists(false).fire(x, y, 270, _this.bulletSpeed, 0, 0);
            _this.getFirstExists(false).fire(x, y, 315, _this.bulletSpeed, 0, 0);
            _this.nextFire = _this.game.time.time + _this.fireRate;
        };
        _this.nextFire = 0;
        _this.bulletSpeed = 600;
        _this.fireRate = 5000;
        _this.width_sprite = width;
        _this.height_sprite = height;
        for (var i = 0; i < 96; i++) {
            _this.add(new Bullet(game, spriteKey), true);
        }
        return _this;
    }
    return WeaponEightWay;
}(Phaser.Group));
var HashTable = /** @class */ (function () {
    function HashTable() {
        this.hashes = {};
    }
    HashTable.prototype.put = function (key, value) {
        this.hashes[JSON.stringify(key)] = value;
    };
    HashTable.prototype.get = function (key) {
        return this.hashes[JSON.stringify(key)];
    };
    return HashTable;
}());
var GameLoader = /** @class */ (function (_super) {
    __extends(GameLoader, _super);
    function GameLoader() {
        var _this = _super.call(this, 800, 600, Phaser.AUTO, 'content', null) || this;
        _this.score = 0;
        _this.player_oxygen = 100;
        _this.player_oxygen_original = 100;
        _this.player_coordinate = { x: 19.50, y: 90 };
        _this.player_coordinate_original = { x: 19.50, y: 90 }; //Object.create(this.player_coordinate);
        _this.blowfishs_coordinates = [
            { x: 212, y: 479.99999999999994 }, { x: 449.5, y: 432 }, { x: 803, y: 896 }, { x: 876, y: 1400 }, { x: 250, y: 0 }, { x: 320, y: 1470 }, { x: 1315, y: 1312 }, { x: 150, y: 1248 },
            { x: 10, y: 870 }, { x: 0, y: 272 }, { x: 77, y: 272 }, { x: 759, y: 360 }, { x: 1122, y: 656 },
            { x: 500, y: 250 }
        ];
        _this.blowfishs_coordinates_original = _this.blowfishs_coordinates.slice(0);
        _this.octopi_coordinates = _this.octopi_coordinates_original = [
            { x: 212, y: 479.99999999999994 }, { x: 449.5, y: 432 }, { x: 803, y: 896 }, { x: 876, y: 1400 }, { x: 250, y: 0 }, { x: 320, y: 1470 }, { x: 1315, y: 1312 }, { x: 150, y: 1248 },
            { x: 10, y: 870 }, { x: 0, y: 272 }, { x: 77, y: 272 }, { x: 759, y: 360 }, { x: 1122, y: 656 }, { x: 1100, y: 1040 }
        ];
        _this.octopi_coordinates_original = _this.octopi_coordinates.slice(0);
        _this.aqua_coordinates = [
            { x: 367, y: 1280 }, { x: 556, y: 1168 }, { x: 803, y: 100 }, { x: 876, y: 1568 }, { x: 1426.5, y: 752 }, { x: 0, y: 1456 }, { x: 276, y: 1504 }, { x: 1315, y: 1250 }, { x: 1580, y: 1312 }, { x: 104, y: 1248 },
            { x: 170.5, y: 1136 }, { x: 133, y: 900 }, { x: 0, y: 576 }, { x: 990, y: 1440 }, { x: 1264, y: 1424 }, { x: 1580, y: 848 }, { x: 752, y: 1264 }, { x: 471, y: 912 }, { x: 370, y: 208 },
            { x: 371, y: 1104 }, { x: 340, y: 800 }, { x: 0, y: 448 }, { x: 612, y: 368 }, { x: 721.5, y: 192 }, { x: 907, y: 368 },
            { x: 1324, y: 816 }, { x: 1030, y: 912 }, { x: 1200, y: 1040 }, { x: 42, y: 272 }, { x: 1224, y: 208 }, { x: 526.5, y: 1392 }
        ];
        _this.state.add('LevelPicker', LevelPicker, false);
        _this.state.add('LevelPicker2', LevelPicker2, false);
        _this.state.add('BlowFishBattle', BlowFishBattle, false);
        _this.state.add('OctopusBattle', OctopusBattle, false);
        _this.state.add('GameOver', GameOver, false);
        _this.state.start('LevelPicker');
        return _this;
        //this.state.start('BlowFishBattle');
    }
    return GameLoader;
}(Phaser.Game));
// when the page has finished loading, create our game
window.onload = function () {
    window.game = new GameLoader();
};
var GameOver = /** @class */ (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startLevelPicker = function () {
            _this.game.player_coordinate = Object.create(_this.game.player_coordinate_original);
            _this.game.player_oxygen = _this.game.player_oxygen_original;
            _this.game.blowfishs_coordinates = _this.game.blowfishs_coordinates_original;
            _this.game.octopi_coordinates = _this.game.octopi_coordinates_original;
            _this.game.state.start('LevelPicker');
        };
        return _this;
    }
    GameOver.prototype.preload = function () {
        this.load.image('bgcat', 'assets/tilemaps/tiles/GameOverBackground.png');
    };
    GameOver.prototype.create = function () {
        console.log(this.world.centerX, this.world.centerY);
        this.bg = this.add.tileSprite(0, 0, 1600, 1600, 'bgcat');
    };
    GameOver.prototype.update = function () {
        //the "click to restart" handler
        this.input.onTap.addOnce(this.startLevelPicker.bind(this));
    };
    return GameOver;
}(Phaser.State));
// tell the transpiler that this depends on CustomGameState being first
/// <reference path="CustomGameState.ts" />
var LevelPicker = /** @class */ (function (_super) {
    __extends(LevelPicker, _super);
    function LevelPicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sprite_to_index = new Array();
        _this.decrease_oxygen = function () {
            _this.player.oxygen -= _this.oxygen_decrease;
            _this.oxygenText.text = 'Oxygen: ' + _this.player.oxygen;
            if (_this.player.oxygen <= 0) {
                _this.changeGameState('GameOver');
            }
        };
        _this.startBlowfish = function (player, blowfish) {
            blowfish.kill();
            _this.removeSprite(blowfish);
            _this.changeGameState('BlowFishBattle');
        };
        _this.startOctopus = function (player, octopus) {
            octopus.kill();
            _this.removeSprite(octopus);
            _this.changeGameState('OctopusBattle');
        };
        _this.startlevelpicker2 = function (player, door) {
            _this.changeGameState('LevelPicker2');
        };
        _this.collectStar = function (player, star) {
            console.log(star);
            //this.removeSprite(star)
            // Removes the star from the screen
            star.kill();
            player.oxygen += _this.oxygen_increase;
            _this.oxygenText.text = 'Oxygen: ' + _this.player.oxygen;
            // Add and update the score
            _this.score += 10;
            _this.scoreText.text = 'Score: ' + _this.score;
            if (_this.aqua_balls.total == 0) {
                _this.changeGameState('LevelPicker');
            }
        };
        _this.removeSprite = function (sprite2remove) {
            for (var _i = 0, _a = _this.sprite_to_index; _i < _a.length; _i++) {
                var s = _a[_i];
                if (s.sprite == sprite2remove) {
                    console.log('found it!');
                    console.log(s);
                    var array2Use = [];
                    if (s.array == 'aqua_coordinates') {
                        array2Use = _this.game.aqua_coordinates;
                    }
                    else if (s.array == 'blowfishs_coordinates') {
                        array2Use = _this.game.blowfishs_coordinates;
                    }
                    else if (s.array == 'octopi_coordinates') {
                        array2Use = _this.game.octopi_coordinates;
                    }
                    var ind = array2Use.indexOf(s.coord);
                    console.log(ind);
                    console.log(array2Use);
                    array2Use.splice(ind, 1);
                    console.log(array2Use);
                    return;
                }
            }
            console.log('didn\'t find the sprite');
        };
        // update variable values that will be saved between states
        _this.checkpointPlayer = function () {
            _this.gameLoader.score = _this.score;
            _this.gameLoader.player_oxygen = _this.player.oxygen;
            _this.gameLoader.player_coordinate.x = _this.player.x;
            _this.gameLoader.player_coordinate.y = _this.player.y;
            console.log('updated player coordinates. x: ' + _this.player.x + ' , y: ' + _this.player.y);
            console.log('updated player oxygen: ' + _this.player.oxygen);
            console.log('updated player score: ' + _this.score);
        };
        return _this;
    }
    LevelPicker.prototype.preload = function () {
        // variables saved across states
        this.score = this.gameLoader.score;
        this.oxygen_increase = 50;
        this.oxygen_decrease = 5;
        this.oxygen_timer = 800;
        this.load.image('background', 'assets/tilemaps/tiles/Waterbackground.png');
        this.load.tilemap('level1', 'assets/levelPickertilemap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
        this.load.spritesheet('mustang', 'assets/mustang.png', 32, 48);
        this.load.image('aqua_ball', 'assets/sprites/aqua_ball.png');
        this.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');
        this.load.atlas('fish', 'assets/sprites/blowfishatlas.png', 'assets/sprites/blowfishatlas.json');
        this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
        this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
        this.load.image('door', 'assets/sprites/door.png');
        this.map;
        this.tileset;
        this.layer;
        this.player;
        this.facing = 'left';
        this.jumpTimer = 0;
        this.cursors;
        this.jumpButton;
        this.bg;
        this.blowfishs;
        this.aqua_balls;
        this.octopi;
        this.door;
        _super.prototype.preload.call(this);
    };
    LevelPicker.prototype.create = function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.stage.backgroundColor = '#000000';
        this.bg = this.add.tileSprite(0, 0, 1600, 1600, 'background');
        //this.bg.fixedToCamera = true;
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('tiles2');
        this.map.addTilesetImage('kenny_platformer_64x64');
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
        //collision on blockedLayer
        this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
        //resizes the game world to match the layer dimensions
        this.blockedLayer.resizeWorld();
        //this.layer = this.map.createLayer('Tile Layer 1');
        //  Un-comment this on to see the collision tiles
        // layer.debug = true;
        //this.layer.resizeWorld();
        var player_coordinate = this.gameLoader.player_coordinate;
        this.physics.arcade.gravity.y = 250;
        this.player = this.add.sprite(player_coordinate.x, player_coordinate.y, 'mustang');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.oxygen = this.gameLoader.player_oxygen;
        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(20, 32, 5, 16);
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('turn', [4], 20, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.camera.follow(this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.blowfishs = this.add.group();
        this.blowfishs.enableBody = true;
        var blowfishs_coordinates = this.game.blowfishs_coordinates;
        for (var _i = 0, blowfishs_coordinates_1 = blowfishs_coordinates; _i < blowfishs_coordinates_1.length; _i++) {
            var coord = blowfishs_coordinates_1[_i];
            //  They are evenly spaced out on the X coordinate, with a random Y coordinate
            var sprite = this.blowfishs.create(coord.x, coord.y, 'fish', 'Blowfishfront0000');
            sprite.body.allowGravity = false;
            sprite.scale.setTo(.25, .25);
            //  Bob the octopus up and down with a tween
            var rand = Math.random() * 1000;
            this.add.tween(sprite).to({ y: sprite.body.y + 100 }, rand + 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
            this.sprite_to_index.push({ sprite: sprite, array: 'blowfishs_coordinates', coord: coord });
        }
        //  These are the frame names for the octopus animation. We use the generateFrames function to help create the array.
        var frameNames = Phaser.Animation.generateFrameNames('Blowfishfront', 0, 3, '', 4);
        this.blowfishs.callAll('animations.add', 'animations', 'swim', frameNames, 3, true, false);
        //  Here we just say 'play the swim animation', this time the 'play' method exists on the child itself, so we can set the context to null.
        this.blowfishs.callAll('play', null, 'swim');
        this.aqua_balls = this.add.group();
        this.aqua_balls.enableBody = true;
        var aqua_coordinates = this.game.aqua_coordinates;
        console.log(aqua_coordinates);
        for (var _a = 0, aqua_coordinates_1 = aqua_coordinates; _a < aqua_coordinates_1.length; _a++) {
            var coord = aqua_coordinates_1[_a];
            var aqua_ball = this.aqua_balls.create(coord.x, coord.y, 'aqua_ball');
            aqua_ball.body.allowGravity = false;
            aqua_ball.body.bounce.y = 0.7 + Math.random() * 0.2;
            this.sprite_to_index.push({ sprite: aqua_ball, array: 'aqua_coordinates', coord: coord });
        }
        //  The score
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { fontSize: '32px', fill: '#fff' });
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset.setTo(16, 16);
        this.oxygenText = this.add.text(16, 16, 'Oxygen: ' + this.player.oxygen, { fontSize: '32px', fill: '#fff' });
        this.oxygenText.fixedToCamera = true;
        this.oxygenText.cameraOffset.setTo(16, 60);
        //  Create our Timer
        var oxy_timer = this.time.create(false);
        //  Set a TimerEvent to occur after 2 seconds
        oxy_timer.loop(this.oxygen_timer, this.decrease_oxygen, this);
        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        oxy_timer.start();
        this.door = this.add.sprite(1270, 1520, 'door');
        this.physics.enable(this.door, Phaser.Physics.ARCADE);
        this.door.body.allowGravity = false;
        _super.prototype.create.call(this);
    };
    LevelPicker.prototype.update = function () {
        this.physics.arcade.collide(this.player, this.blockedLayer);
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            if (this.facing != 'left') {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            if (this.facing != 'right') {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        }
        else {
            if (this.facing != 'idle') {
                this.player.animations.stop();
                this.player.frame = 4;
                this.facing = 'idle';
            }
        }
        if (this.jumpButton.isDown && this.player.body.onFloor() && this.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -250;
            this.jumpTimer = this.time.now + 750;
        }
        this.physics.arcade.collide(this.octopi, this.blockedLayer);
        this.physics.arcade.collide(this.blowfishs, this.blockedLayer);
        this.physics.arcade.collide(this.aqua_balls, this.blockedLayer);
        this.physics.arcade.overlap(this.player, this.aqua_balls, this.collectStar, null, this);
        this.physics.arcade.overlap(this.player, this.blowfishs, this.startBlowfish, null, this);
        this.physics.arcade.overlap(this.player, this.door, this.startlevelpicker2, null, this);
        this.physics.arcade.overlap(this.player, this.octopi, this.startOctopus, null, this);
        _super.prototype.update.call(this);
    };
    Object.defineProperty(LevelPicker.prototype, "gameLoader", {
        get: function () { return this.game; },
        enumerable: true,
        configurable: true
    });
    return LevelPicker;
}(CustomGameState));
// tell the transpiler that this depends on CustomGameState being first
/// <reference path="CustomGameState.ts" />
var LevelPicker2 = /** @class */ (function (_super) {
    __extends(LevelPicker2, _super);
    function LevelPicker2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sprite_to_index = new Array();
        _this.decrease_oxygen = function () {
            _this.player.oxygen -= _this.oxygen_decrease;
            _this.oxygenText.text = 'Oxygen: ' + _this.player.oxygen;
            if (_this.player.oxygen <= 0) {
                _this.changeGameState('GameOver');
            }
        };
        _this.startBlowfish = function (player, blowfish) {
            blowfish.kill();
            _this.removeSprite(blowfish);
            _this.changeGameState('BlowFishBattle');
        };
        _this.startOctopus = function (player, octopus) {
            octopus.kill();
            _this.removeSprite(octopus);
            _this.changeGameState('OctopusBattle');
        };
        _this.collectStar = function (player, star) {
            console.log(star);
            //this.removeSprite(star)
            // Removes the star from the screen
            star.kill();
            player.oxygen += _this.oxygen_increase;
            _this.oxygenText.text = 'Oxygen: ' + _this.player.oxygen;
            // Add and update the score
            _this.score += 10;
            _this.scoreText.text = 'Score: ' + _this.score;
            if (_this.aqua_balls.total == 0) {
                _this.changeGameState('LevelPicker');
            }
        };
        _this.removeSprite = function (sprite2remove) {
            for (var _i = 0, _a = _this.sprite_to_index; _i < _a.length; _i++) {
                var s = _a[_i];
                if (s.sprite == sprite2remove) {
                    console.log('found it!');
                    console.log(s);
                    var array2Use = [];
                    if (s.array == 'aqua_coordinates') {
                        array2Use = _this.game.aqua_coordinates;
                    }
                    else if (s.array == 'blowfishs_coordinates') {
                        array2Use = _this.game.blowfishs_coordinates;
                    }
                    else if (s.array == 'octopi_coordinates') {
                        array2Use = _this.game.octopi_coordinates;
                    }
                    var ind = array2Use.indexOf(s.coord);
                    console.log(ind);
                    console.log(array2Use);
                    array2Use.splice(ind, 1);
                    console.log(array2Use);
                    return;
                }
            }
            console.log('didn\'t find the sprite');
        };
        // update variable values that will be saved between states
        _this.checkpointPlayer = function () {
            _this.gameLoader.score = _this.score;
            _this.gameLoader.player_oxygen = _this.player.oxygen;
            _this.gameLoader.player_coordinate.x = _this.player.x;
            _this.gameLoader.player_coordinate.y = _this.player.y;
            console.log('updated player coordinates. x: ' + _this.player.x + ' , y: ' + _this.player.y);
            console.log('updated player oxygen: ' + _this.player.oxygen);
            console.log('updated player score: ' + _this.score);
        };
        return _this;
    }
    LevelPicker2.prototype.preload = function () {
        // variables saved across states
        this.score = this.gameLoader.score;
        this.oxygen_increase = 50;
        this.oxygen_decrease = 5;
        this.oxygen_timer = 800;
        this.load.image('background', 'assets/tilemaps/tiles/Waterbackground.png');
        this.load.tilemap('level1', 'assets/levelPickertilemap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
        this.load.spritesheet('mustang', 'assets/mustang.png', 32, 48);
        this.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
        this.load.image('aqua_ball', 'assets/sprites/aqua_ball.png');
        this.load.image('starSmall', 'assets/games/starstruck/star.png');
        this.load.image('starBig', 'assets/games/starstruck/star2.png');
        this.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');
        this.load.atlas('fish', 'assets/sprites/blowfishatlas.png', 'assets/sprites/blowfishatlas.json');
        this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
        this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
        this.map;
        this.tileset;
        this.layer;
        this.player;
        this.facing = 'left';
        this.jumpTimer = 0;
        this.cursors;
        this.jumpButton;
        this.bg;
        this.blowfishs;
        this.aqua_balls;
        this.octopi;
        _super.prototype.preload.call(this);
    };
    LevelPicker2.prototype.create = function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.stage.backgroundColor = '#000000';
        this.bg = this.add.tileSprite(0, 0, 1600, 1600, 'background');
        //this.bg.fixedToCamera = true;
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('tiles2');
        this.map.addTilesetImage('kenny_platformer_64x64');
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
        //collision on blockedLayer
        this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
        //resizes the game world to match the layer dimensions
        this.blockedLayer.resizeWorld();
        //this.layer = this.map.createLayer('Tile Layer 1');
        //  Un-comment this on to see the collision tiles
        // layer.debug = true;
        //this.layer.resizeWorld();
        var player_coordinate = this.gameLoader.player_coordinate;
        this.physics.arcade.gravity.y = 250;
        this.player = this.add.sprite(player_coordinate.x, player_coordinate.y, 'mustang');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.oxygen = this.gameLoader.player_oxygen;
        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(20, 32, 5, 16);
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('turn', [4], 20, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.camera.follow(this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //  Here we create our group and populate it with 6 sprites
        this.octopi = this.add.group();
        this.octopi.enableBody = true;
        var octopi_coordinates = this.game.octopi_coordinates;
        for (var _i = 0, octopi_coordinates_1 = octopi_coordinates; _i < octopi_coordinates_1.length; _i++) {
            var coord = octopi_coordinates_1[_i];
            //  They are evenly spaced out on the X coordinate, with a random Y coordinate
            var sprite = this.octopi.create(coord.x, coord.y, 'seacreatures', 'octopus0000');
            sprite.body.allowGravity = false;
            sprite.scale.setTo(0.5, 0.5);
            //  Bob the octopus up and down with a tween
            var rand = Math.random() * 1000;
            this.add.tween(sprite).to({ y: sprite.body.y + 100 }, rand + 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
            this.sprite_to_index.push({ sprite: sprite, array: 'octopi_coordinates', coord: coord });
        }
        //  These are the frame names for the octopus animation. We use the generateFrames function to help create the array.
        var octoframeNames = Phaser.Animation.generateFrameNames('fish', 0, 24, '', 4);
        //  Here is the important part. Group.callAll will call a method that exists on every child in the Group.
        //  In this case we're saying: child.animations.add('swim', frameNames, 30, true, false)
        //  The second parameter ('animations') is really important and is the context in which the method is called.
        //  For animations the context is the Phaser.AnimationManager, which is linked to the child.animations property.
        //  Everything after the 2nd parameter is just the usual values you'd pass to the animations.add method.
        this.octopi.callAll('animations.add', 'animations', 'swim', octoframeNames, 3, true, false);
        //  Here we just say 'play the swim animation', this time the 'play' method exists on the child itself, so we can set the context to null.
        this.octopi.callAll('play', null, 'swim');
        this.aqua_balls = this.add.group();
        this.aqua_balls.enableBody = true;
        var aqua_coordinates = this.game.aqua_coordinates;
        console.log(aqua_coordinates);
        for (var _a = 0, aqua_coordinates_2 = aqua_coordinates; _a < aqua_coordinates_2.length; _a++) {
            var coord = aqua_coordinates_2[_a];
            var aqua_ball = this.aqua_balls.create(coord.x, coord.y, 'aqua_ball');
            aqua_ball.body.allowGravity = false;
            aqua_ball.body.bounce.y = 0.7 + Math.random() * 0.2;
            this.sprite_to_index.push({ sprite: aqua_ball, array: 'aqua_coordinates', coord: coord });
        }
        //  The score
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { fontSize: '32px', fill: '#fff' });
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset.setTo(16, 16);
        this.oxygenText = this.add.text(16, 16, 'Oxygen: ' + this.player.oxygen, { fontSize: '32px', fill: '#fff' });
        this.oxygenText.fixedToCamera = true;
        this.oxygenText.cameraOffset.setTo(16, 60);
        //  Create our Timer
        var oxy_timer = this.time.create(false);
        //  Set a TimerEvent to occur after 2 seconds
        oxy_timer.loop(this.oxygen_timer, this.decrease_oxygen, this);
        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        oxy_timer.start();
        _super.prototype.create.call(this);
    };
    LevelPicker2.prototype.update = function () {
        this.physics.arcade.collide(this.player, this.blockedLayer);
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            if (this.facing != 'left') {
                this.player.animations.play('left');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            if (this.facing != 'right') {
                this.player.animations.play('right');
                this.facing = 'right';
            }
        }
        else {
            if (this.facing != 'idle') {
                this.player.animations.stop();
                this.player.frame = 4;
                this.facing = 'idle';
            }
        }
        if (this.jumpButton.isDown && this.player.body.onFloor() && this.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -250;
            this.jumpTimer = this.time.now + 750;
        }
        this.physics.arcade.collide(this.octopi, this.blockedLayer);
        this.physics.arcade.collide(this.blowfishs, this.blockedLayer);
        this.physics.arcade.collide(this.aqua_balls, this.blockedLayer);
        this.physics.arcade.overlap(this.player, this.aqua_balls, this.collectStar, null, this);
        this.physics.arcade.overlap(this.player, this.blowfishs, this.startBlowfish, null, this);
        this.physics.arcade.overlap(this.player, this.octopi, this.startOctopus, null, this);
        _super.prototype.update.call(this);
    };
    Object.defineProperty(LevelPicker2.prototype, "gameLoader", {
        get: function () { return this.game; },
        enumerable: true,
        configurable: true
    });
    return LevelPicker2;
}(CustomGameState));
// tell the transpiler that this depends on CustomGameState being first
/// <reference path="CustomGameState.ts" />
var OctopusBattle = /** @class */ (function (_super) {
    __extends(OctopusBattle, _super);
    function OctopusBattle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.firetentacle = function () {
            _this.octopus_weapon.fire(_this.octopus);
            _this.octopus.bringToTop();
        };
        _this.fireBullet = function () {
            if (_this.game.time.now > _this.bulletTime) {
                var bullet = _this.bullets.getFirstExists(false);
                if (bullet) {
                    bullet.reset(_this.player.x + 50, _this.player.y - 1);
                    bullet.body.velocity.x = 600;
                    _this.bulletTime = _this.game.time.now + 600;
                }
            }
        };
        _this.cathitbytentacle = function (cat, tentacle) {
            _this.player.health -= _this.health_decrease;
            console.log('ouch');
            console.log('health @:' + _this.player.health);
            _this.playerHealthText.text = 'Player Health: ' + _this.player.health;
            tentacle.kill();
            if (_this.player.health <= 0) {
                _this.player.animations.play('dying');
                // this.player.kill();
                _this.game.state.start('GameOver');
                cat.kill();
            }
        };
        _this.octopushitbybullet = function (octopus, bullet) {
            _this.octopus_health -= _this.octopus_health_decrease;
            console.log('octopus hit by bullet');
            console.log('of health @:' + _this.octopus_health);
            _this.enemyHealthText.text = 'Enemy Health: ' + _this.octopus_health;
            console.log(bullet);
            console.log(octopus);
            bullet.kill();
            if (_this.octopus_health <= 0) {
                console.log('blowfish killed');
                _this.octopus.kill();
                _this.tentacle_timer.stop();
                _this.game.state.start('LevelPicker2');
            }
        };
        _this.bullethitstentacle = function (bullet, tentacle) {
            console.log('tentacle hit by bullet');
            bullet.kill();
            tentacle.kill();
        };
        //  Called if the bullet goes out of the screen
        _this.resetBullet = function (bullet) {
            bullet.kill();
        };
        return _this;
    }
    OctopusBattle.prototype.preload = function () {
        this.load.image('bfbg', 'assets/tilemaps/tiles/battlebg.png');
        this.load.spritesheet('mustangbc', 'assets/sprites/mustangbattlechar.png', 160, 320);
        //  this.load.atlas('bfb', 'assets/sprites/blowfishbattle_json.png', 'assets/sprites/blowfishbattle_json.json');
        this.load.atlas('octopus', 'assets/sprites/octopus.png', 'assets/sprites/octopus.json');
        this.load.image('bullet', 'assets/misc/bullet0.png');
        this.load.image('tentacles', 'assets/sprites/tentacles.png');
        this.player;
        this.bullet;
        this.bullets;
        this.bulletTime = 0;
        this.tentacleTime = 0;
        this.tentacle;
        this.tentaclespeed = 600;
        this.enemy;
        this.octopus;
        //  Left, right and space key for controls
        this.spaceKey;
        this.bKey;
        this.health_start = 100;
        this.health_decrease = 10;
        this.octopus_health = 100;
        this.octopus_health_decrease = 10;
        _super.prototype.preload.call(this);
    };
    OctopusBattle.prototype.create = function () {
        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.of = this.add.tileSprite(0, 0, 1600, 1600, 'bfbg');
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(35, 'bullet');
        this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
        this.bullets.setAll('checkWorldBounds', true);
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.B]);
        this.tentacles = this.add.group();
        this.tentacles.enableBody = true;
        this.tentacles.physicsBodyType = Phaser.Physics.ARCADE;
        this.tentacles.createMultiple(35, 'tentacles');
        this.tentacles.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
        this.tentacles.setAll('checkWorldBounds', true);
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.B]);
        this.octopus = this.add.sprite(350, 250, 'octopus');
        var frameNames = Phaser.Animation.generateFrameNames('octopus', 0, 4, '', 4);
        this.octopus.animations.add('swim', frameNames, 3, true, false);
        this.octopus.animations.play('swim');
        this.octopus.enableBody = true;
        this.physics.enable(this.octopus, Phaser.Physics.ARCADE);
        // The player and its settings
        this.player = this.add.sprite(250, 250, 'mustangbc');
        // this.enemy = this.add.sprite(500, 250, 'blowfishspikeimage');
        //  We need to enable physics on the player
        this.physics.arcade.enable(this.player);
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.allowGravity = false;
        this.player.body.bounce.y = 0.7 + Math.random() * 0.2;
        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.animations.add('claw', [9, 10, 11], 2, true);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bKey = this.input.keyboard.addKey(Phaser.Keyboard.B);
        this.add.tween(this.octopus).to({ y: 100 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
        this.octopus_weapon = new WeaponEightWay(this, 'tentacles', 200, 200);
        this.player.health = this.health_start;
        //this.octopus.oxygen = this.oxygen_start;
        //  Create our Timer
        this.tentacle_timer = this.time.create(false);
        //  Set a TimerEvent to occur after 2 seconds
        this.tentacle_timer.loop(5, this.firetentacle, this);
        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        this.tentacle_timer.start();
        this.playerHealthText = this.add.text(16, 16, 'Player Health: ' + this.player.health, { fontSize: '32px', fill: '#fff' });
        this.playerHealthText.fixedToCamera = true;
        this.playerHealthText.cameraOffset.setTo(16, 16);
        this.enemyHealthText = this.add.text(450, 16, 'Enemy Health: ' + this.octopus_health, { fontSize: '32px', fill: '#fff' });
        this.enemyHealthText.fixedToCamera = true;
        this.enemyHealthText.cameraOffset.setTo(450, 16);
        _super.prototype.create.call(this);
    };
    OctopusBattle.prototype.update = function () {
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            //  Move to the right
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }
        else if (this.spaceKey.isDown) {
            this.fireBullet();
        }
        else if (this.bKey.isDown) {
            this.player.body.velocity.x = 5;
            this.player.animations.play('claw');
        }
        else {
            //  Stand still
            this.player.animations.stop();
            this.player.frame = 4;
        }
        this.physics.arcade.overlap(this.player, this.octopus_weapon, this.cathitbytentacle, null, this);
        // sprite will always be the first in overlap params regardless of parameter order, for call back
        this.physics.arcade.overlap(this.octopus, this.bullets, this.octopushitbybullet, null, this);
        this.physics.arcade.overlap(this.bullets, this.octopus_weapon, this.bullethitstentacle, null, this);
        this.octopus.animations.play('fish');
        _super.prototype.update.call(this);
    };
    return OctopusBattle;
}(CustomGameState));
var SimpleGame = /** @class */ (function (_super) {
    __extends(SimpleGame, _super);
    function SimpleGame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggleMenu = function () {
            if (_this.menuGroup.y == 0) {
                var menuTween = _this.game.add.tween(_this.menuGroup).to({
                    y: -180
                }, 500, Phaser.Easing.Bounce.Out, true);
            }
            if (_this.menuGroup.y == -180) {
                var menuTween = _this.game.add.tween(_this.menuGroup).to({
                    y: 0
                }, 500, Phaser.Easing.Bounce.Out, true);
            }
        };
        return _this;
    }
    SimpleGame.prototype.preload = function () {
        // add our logo image to the assets class under the
        // key 'logo'. We're also setting the background colour
        // so it's the same as the background colour in the image
        this.game.load.image('logo', "assets/ds_logo.png");
        this.game.load.image('ball', 'assets/shinyball.png');
        this.game.stage.backgroundColor = 0xB20059;
        this.game.load.image("menubutton", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAaCAYAAADWm14/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdENjg1RjVENjhEQjExRTVBNEJBQzNBMEMyMjEyMzAwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdENjg1RjVFNjhEQjExRTVBNEJBQzNBMEMyMjEyMzAwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0Q2ODVGNUI2OERCMTFFNUE0QkFDM0EwQzIyMTIzMDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0Q2ODVGNUM2OERCMTFFNUE0QkFDM0EwQzIyMTIzMDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6nb2YGAAAAo0lEQVR42mL8//9/KAMDQxoD/UEFEJ9lBDrgHZAhOAAO2APErkwDZDkcMDEMMAA54N4A2f0eRIDSgBKQDh0AB8wCOQLkAIYRnwZGtgNYgHhAEyHIAbuhjqA3MAbiMKYBspwBVgIPikT4fqATYfoAVscMoyXhqANYkAoFeraM7sHbIcBEuPv/wIAOUAYARYHLAIW+8WgihDmgc4DsBvULGAACDAA0B55U5ocSZgAAAABJRU5ErkJggg==");
        this.game.load.image("reset", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAAAwCAYAAACi0LByAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY5NzA1OTI0NjhERTExRTVBNzg0RDA5ODU4MTVCRTNBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY5NzA1OTI1NjhERTExRTVBNzg0RDA5ODU4MTVCRTNBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3MDU5MjI2OERFMTFFNUE3ODREMDk4NTgxNUJFM0EiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3MDU5MjM2OERFMTFFNUE3ODREMDk4NTgxNUJFM0EiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5bVT8rAAAFaElEQVR42uxc7ZGcOBDFLv9fMlgyWDI4OQLjCBZHYELAERyOwNoIjCMwG4GZDNgMcAQcVLXq+vr0xQCz6533qrq8M6BGaj1a3S2N30zTlADAa8VbmAAAwQEABAcAEBwAQHAAAMEBAAQHQHAAAMEBAAQHABAcAEBwAADBAeD5CJ7OUs3SzTLOMpEsf7ezlHSPrR0A7IY3BxyXrYncN4H7fs/S0P0L9CzFLGqWPuI5yvH9QHINyMlmGUlCTmUgRzKC4PsRPCXj3q1s90gTck+fvzDS+zAFdFaRL8qfCEXOIWTrr2TLEQQ/jtxPzKMuXuY2oGstwU9sArn+E3m4l+p50zNXmyW8+8Y+n1goaHQrtoKe6PN1knwh+A7STP9HN4uy3Kvomgt15DMNlEW/QbXT+PaWbuVYjZRsbKPDvouks2h2b/9C7XC4vN1pufxs8cKKPItER9dOB72zi/4H5tFfC1IKS0z+4rJvQt66ZHYYrjWBf7eDjlJ8fogIMfQZsfoaDGy5fi3giXsRmV+UdF9zrTH4HgS/F5WRKmKi7g8eV8hzp4z8MXGwiWH7FXrHZN8kt2QJdLeiXQy51Yb+ZjTufgfdanfbbYxxMoonjcTElLlow6Wl+HFLDF56YnAZmxoMjni2oliXx722Pvr0FiJX6ZjOgT6XgbGmB+QVqSV34uMzcyJta/pbUv9524bpbi22yB19qYWdjb7NY/2TEwieQHX07yS+T8WEDsLgso0SL69BS2ImQQu9vdArk+hCJJdrE2vleaHPldZSFJjY+AwkESc23t4ypoa+H+mafAmkc9Diendm0eHVEnyyELv2GFJ6kowZdbBUhrRYfUZh9NpR1eBebNxYRVlDcB+UZZXTwlaVaGMjuFxJbFWbjF0vHO14P0qhjz8ru2aCa4eRXEt8GSBQLkioA/0YPWTNLF78JRC8ZV7bFTKEPHjsWOWKwcfce/qRBmx7kTJhnvz3rAmXMbKK0Yg2a6Fpxy6hDZDc0U+e5HZCasu9DUuiB2qXWfTyyobUqynx3lrRGRxjsW7eCXkvyoc8mdMem/rQB/rYRra5Y4mqtF27YsyHVVGKxH3m5IY61gcy8M+WCTinhKbIYB3pdem6i6gKmEn6SJO97I7+TfKDKhqjqC0fXfZ8on4UK8t+uYVkNxZSush6zvW1uA3scJ9dwz/yuOxDhCdoVnqO0Mv2myavW+HhpNTCEy2E/8Q2pj44+rlG7zkwz/wrcR80sxHDlG1/7EmcnfE+YDv10gj+FKiHpzRhH0QNfcuGxMBqxXeChENEjbxwLIUj6crJoxuSp+JFKjweVO1g04aFO+2K8O/W4kweA31WFyL2UyAEyTx9fFaC39JyWAovkbLdNbnZUyfbDwQtE/+Fxc4lI/ijZ+NjMfD3WX4xY1fULnPEkbnwjLXFI+b0EvzcOlFkm4qFGJ1lF5kTo2U2fhAvY8tspCzO51I7n9pju5T6+X3T6rexklFPcRhEPVRCb6iiKM9hJl4VUaLmW5A0lvp2JjZjarbJIct+/N6e7lMOvVsPW8nSmumfJl21pY6sHRWKQdT5a9bnMVBFqQNz4uNK7ejHwGxXs+/7FZt/u5cJa2FIPa2H3lgmVIESE99cKCw7Zq5+5I57baf4cs8LrHc8Tcif10Y4lTKgo3eML78QwY2D6D17GukWjm49D56zcljF4romCZ/7NnF6e+GEJk3+/RUMX7L7iHvNT+4Gz3mRGL1HjiVhpbbY5DxnIdil58OVA+3SlyN+ssY7rCwJRG+pcwLAITiS4ADw7MB/GwGA4AAAggMACA4AIDgAgOAAAIIDIDhMAIDgAACCAwAIDgAgOADshX8EGAAO4op+FszNegAAAABJRU5ErkJggg==");
        this.game.load.image("thankyou", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAAAwCAYAAACi0LByAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY5QTk2MkJENjhERjExRTU4RkI4RTEyODJEQUJDMjVGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY5QTk2MkJFNjhERjExRTU4RkI4RTEyODJEQUJDMjVGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjlBOTYyQkI2OERGMTFFNThGQjhFMTI4MkRBQkMyNUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjlBOTYyQkM2OERGMTFFNThGQjhFMTI4MkRBQkMyNUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz640ZbzAAAEbklEQVR42uyb/1GjQBTH1xv/h6sgXAXGCsQKTAdiBaYDSQVyFRg7iBUcqUCsQKzgSAU5GN+bvNvZ5UcCAZLvZ+aNCPuTfPft2wUuttutAuBU+YFbACBwACBwACBwACBwACBwACBwAIEDAIEDAIEDAIEDAIEDAIEDUM3lEerwyQpiMgCOwkXHr8sGub1o5x5yW/bQVznIhsg0Nze3lAyMQOBZbo52bkM/5KFCrQsLmjt6MdDfomjnTW6L3MIT1VtAluQ2N1yPaKDPKc2gQhSPLBONcwzpHOpEsqfX+tN0EMOPDQaPBnHZLHZzoAPsbJEZkPje6biMhNK8U54Avz3ogq52UV5ItAvDtYUlNm/ikXVjbkuuAQj8IIr46UMTeRGuvFLcvaHjTBP3B+UFoHXajMEzWgAWi6UrOvespbknk+L2KS8Agw9RWOQfNdIOQdxTVX9XhtO6R6hL9XxPPAj8MJH3Ke5CoCv1vW3Ii9yiHaEl/Ux97/Bw2r9qtwMU0IylL5JjsqZ12QTH5VWFcjOtbtMuBl/3DHVwOz+pnZGlnMjSb/36tHeFF/vgHVm4tRO2XBfj10iT5JblFtOxJNDyzLTrKdmWylhZ+rNPXbGhrCnl57LcivvgivSB4XokyuJzgdYuva0ptaOqrabrvkUTccN8e9u5vovC4ULx95eYbQKDJ+IZ51rt9vqvyavf1ajLt9Q1r+m5i+cGbzVnvIxmDFP5ruhfJDw6Hxd1/BRtvaa2TlQ/T54HvU04ZObq/4dKqfiRb7TpfiKO5ZO1hM5VEWr5ZF1XNcX9SnXVDedCUf5U609R3pcQbETn1oY6uI8bKmsOgY+D2HAutYiMvXdqyfNWUdeqZl16HP0uxB007F9KgtW9eKh5b9nHqKSspZYWAj8xyjxn0kF9V4YQqSmRGCwuhR0T8sYy3JjU6EcmwhkI3AI/6Dk13A7K/C3i9H13IlYUijg0A7AnX2oDdtNAvE12vG7OTeBJR96uS1LxY7kl4UQXM4ZPIncOEHkowpQ7y4yQWBbXkqDEy3sNB30xwG5L4vk5XU/GJvAxsqoIFUIxxQ9R5Cvy0NzGV0P8z/26t4h8aQltEi0EMg0I03ono35kJf1uNdaHwMtFthAC4B0Q3hl5UvWe2PYl8kwTZWQZBLxQfqE6QrJU7V6rCLTBwWU5dC84T1HfsxhQpgHzTHlcg+f/pOutvZt0CR1XTvPFjX8kT/aoxcqZKt/ua0vkMdUT0/91p3AW0bokz4z6+UThmIyfv9Tuaa0evj2QECeUV7JW5duKTkVo09rapssvekLR8bW2+BjbVyuemHpT+sHTEbT5k45vVfWneh7NEFMRXiQVi0t+eORqYUlccR9taXyyZVv3t0uBu2r3zoMvOp8qvEF4rNnnibywd643oetvMl21+ySNR3AGcXcO33NH9feR91kIHPTrvQ/9wHv0YBflNAlKdk7gwcHowxNeKFYtEiFwABCiAACBAwCBAwCBAwCBAwCBAwgcgBHzT4ABAOR9hYyt7fAmAAAAAElFTkSuQmCC");
    };
    SimpleGame.prototype.create = function () {
        // add the 'logo' sprite to the game, position it in the
        // center of the screen, and set the anchor to the center of
        // the image so it's centered properly. There's a lot of
        // centering in that last sentence
        //var logo = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'logo' );
        //logo.anchor.setTo( 0.5, 0.5 );
        this.menuSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ball');
        this.menuSprite.inputEnabled = true;
        this.game.physics.enable(this.menuSprite, Phaser.Physics.ARCADE);
        this.menuGroup = this.game.add.group();
        var menuButton = this.game.add.button(this.game.width / 2, this.game.height - 30, "menubutton", this.toggleMenu);
        menuButton.anchor.set(0.5);
        this.menuGroup.add(menuButton);
        var reset = this.game.add.button(this.game.width / 2, this.game.height + 50, "reset", function () { });
        reset.anchor.set(0.5);
        this.menuGroup.add(reset);
        var thankYou = this.game.add.button(this.game.width / 2, this.game.height + 130, "thankyou", function () { });
        thankYou.anchor.set(0.5);
        this.menuGroup.add(thankYou);
    };
    SimpleGame.prototype.update = function () {
        //  only move when you click
        //if (this.game.input.mousePointer.isDown) {
        //  400 is the speed it will move towards the mouse
        this.game.physics.arcade.moveToPointer(this.menuSprite, 200);
        //  if it's overlapping the mouse, don't move any more
        if (Phaser.Rectangle.contains(this.menuSprite.body, this.game.input.x, this.game.input.y)) {
            this.menuSprite.body.velocity.setTo(0, 0);
        }
        console.log(this.game.input.x);
        console.log(this.game.input.y);
        if (this.menuSprite.input.pointerDown(0)) {
            this.menuGroup.x = this.game.input.x;
            this.menuGroup.y = this.game.input.y;
            console.log('clicked');
        }
    };
    return SimpleGame;
}(Phaser.State));
