// tell the transpiler that this depends on CustomGameState being first
/// <reference path="CustomGameState.ts" />
class LevelPicker extends CustomGameState {
	menuSprite: Phaser.Sprite;
	menuGroup: any;
	oxygen_increase: number;
	oxygen_decrease: number;
	oxygen_timer: number;
	explosions;
	map;
	tileset;
	layer;
	player;
	facing;
	jumpTimer;
	cursors;
	jumpButton;
	bg;
	blowfishs;
	aqua_balls;
	octopi;

	backgroundlayer;
	blockedLayer;
	score;
	scoreText;
	oxygenText;
	door;

	exit_door;

	sprite_to_index = new Array();

	preload() {
		// variables saved across states
		this.score = this.gameLoader.score;

		this.oxygen_increase = 50
		this.oxygen_decrease = 5
		this.oxygen_timer = 800;

		this.load.image('background', 'assets/tilemaps/tiles/waterbackground.png');

		this.load.tilemap('level1', 'assets/levelPickertilemap.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
		this.load.spritesheet('mustang', 'assets/mustang.png', 32, 48);
		
		this.load.image('aqua_ball', 'assets/sprites/aqua_ball.png');
		

		this.load.image('exit_door','assets/sprites/door.png');

		this.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');
		this.load.atlas('fish', 'assets/sprites/blowfishatlas.png', 'assets/sprites/blowfishatlas.json');

		this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
		this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
		
		
		//this.load.image('door', 'assets/sprites/door.png');
		
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
		
		super.preload();
	}

	create() {

		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.stage.backgroundColor = '#000000';

		this.bg = this.add.tileSprite(0, 0, 1600, 1600, 'background');
		//this.bg.fixedToCamera = true;

		this.map = this.game.add.tilemap('level1');

		this.map.addTilesetImage('tiles2')
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

		this.exit_door = this.add.sprite(1195.5, 1525, 'exit_door');
		this.physics.enable(this.exit_door, Phaser.Physics.ARCADE);
		this.exit_door.body.allowGravity = false;

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

		var blowfishs_coordinates = (<GameLoader>this.game).blowfishs_coordinates

		for (var coord of blowfishs_coordinates) {
			//  They are evenly spaced out on the X coordinate, with a random Y coordinate
			var sprite = this.blowfishs.create(coord.x, coord.y, 'fish', 'Blowfishfront0000');
			sprite.body.allowGravity = false;
			sprite.scale.setTo(.25, .25);

            //  Bob the octopus up and down with a tween
            var rand = Math.random() * 1000;
            this.add.tween(sprite).to({ y: sprite.body.y+100 }, rand + 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

			this.sprite_to_index.push({ sprite: sprite, array: 'blowfishs_coordinates', coord: coord });
		}

		//  These are the frame names for the octopus animation. We use the generateFrames function to help create the array.
		var frameNames = Phaser.Animation.generateFrameNames('Blowfishfront', 0, 3, '', 4);
		this.blowfishs.callAll('animations.add', 'animations', 'swim', frameNames, 3, true, false);

		//  Here we just say 'play the swim animation', this time the 'play' method exists on the child itself, so we can set the context to null.
		this.blowfishs.callAll('play', null, 'swim');

		this.aqua_balls = this.add.group();
		this.aqua_balls.enableBody = true;

		var aqua_coordinates = (<GameLoader>this.game).aqua_coordinates;
		console.log(aqua_coordinates)

		for (var coord of aqua_coordinates) {
			var aqua_ball = this.aqua_balls.create(coord.x, coord.y, 'aqua_ball');
			aqua_ball.body.allowGravity = false;
			aqua_ball.body.bounce.y = 0.7 + Math.random() * 0.2

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
		
		//this.door = this.add.sprite( 1270, 1520, 'door');
		//this.physics.enable(this.door, Phaser.Physics.ARCADE);
		//this.door.body.allowGravity = false;

		super.create();

		


	}

	update() {
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
		this.physics.arcade.overlap(this.player, this.exit_door, this.nextLevel, null, this);
		
		super.update();
	}

	decrease_oxygen = () => {
		this.player.oxygen -= this.oxygen_decrease;
		this.oxygenText.text = 'Oxygen: ' + this.player.oxygen
		if (this.player.oxygen <= 0) {
			this.changeGameState('GameOver');
		}
	}

	startBlowfish = (player: any, blowfish: any) => {
		blowfish.kill();
		this.removeSprite(blowfish);
		this.changeGameState('BlowFishBattle');
	}

	startOctopus = (player: any, octopus: any) => {
		octopus.kill();
		this.removeSprite(octopus);
		this.changeGameState('OctopusBattle');
	}

	nextLevel= (player, door) => {
		this.changeGameState('LevelPicker2');
	}
	
	startlevelpicker2 = (player: any, door: any) => {
		this.changeGameState('LevelPicker2');
	}

	collectStar = (player: any, star: any) => {

		console.log(star)

		//this.removeSprite(star)

		// Removes the star from the screen
		star.kill();
		player.oxygen += this.oxygen_increase;
		this.oxygenText.text = 'Oxygen: ' + this.player.oxygen
		// Add and update the score
		this.score += 10;
		this.scoreText.text = 'Score: ' + this.score;

		if (this.aqua_balls.total == 0) {
			this.changeGameState('LevelPicker');
		}
	}

	
	removeSprite = (sprite2remove) => {
		for (var s of this.sprite_to_index) {
			if (s.sprite == sprite2remove) {
				console.log('found it!');
				console.log(s);

				var array2Use = []
				if (s.array == 'aqua_coordinates') {
					array2Use = (<GameLoader>this.game).aqua_coordinates;
				} else if (s.array == 'blowfishs_coordinates') {
					array2Use = (<GameLoader>this.game).blowfishs_coordinates;
				} else if (s.array == 'octopi_coordinates') {
					array2Use = (<GameLoader>this.game).octopi_coordinates;
				}

				var ind = array2Use.indexOf(s.coord)
				console.log(ind)

				console.log(array2Use)
				array2Use.splice(ind, 1);

				console.log(array2Use)

				return;
			}
		}
		console.log('didn\'t find the sprite')
	}

	// update variable values that will be saved between states
	checkpointPlayer = () => {
		this.gameLoader.score = this.score;
		this.gameLoader.player_oxygen = this.player.oxygen;
		this.gameLoader.player_coordinate.x = this.player.x;
		this.gameLoader.player_coordinate.y = this.player.y;
		console.log('updated player coordinates. x: ' + this.player.x + ' , y: ' + this.player.y)
		console.log('updated player oxygen: ' + this.player.oxygen);
		console.log('updated player score: ' + this.score);
	}

	get gameLoader():GameLoader{ return (<GameLoader>this.game);}
	
}