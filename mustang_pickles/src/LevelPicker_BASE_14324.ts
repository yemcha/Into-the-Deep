class LevelPicker extends Phaser.State {
	menuSprite: Phaser.Sprite;
	menuGroup: any;
	oxygen_start: number = 50;
	oxygen_increase: number;
	oxygen_decrease: number;
	oxygen_timer: number;

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

	sprite_to_index = new Array();

	preload() {
		this.oxygen_start = 50
		this.oxygen_increase = 50
		this.oxygen_decrease = 5
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

		this.physics.arcade.gravity.y = 250;

		this.player = this.add.sprite(155.5, 1568, 'mustang');
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.oxygen = this.oxygen_start;
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
			
			var ind = blowfishs_coordinates.indexOf(coord)
			this.sprite_to_index.push({sprite:sprite, array:blowfishs_coordinates, index:ind});
		}

		//  These are the frame names for the octopus animation. We use the generateFrames function to help create the array.
		var frameNames = Phaser.Animation.generateFrameNames('Blowfishfront', 0, 3, '', 4);
		this.blowfishs.callAll('animations.add', 'animations', 'swim', frameNames, 3, true, false);

		//  Here we just say 'play the swim animation', this time the 'play' method exists on the child itself, so we can set the context to null.
		this.blowfishs.callAll('play', null, 'swim');

		//  Bob the octopus up and down with a tween
		this.add.tween(this.blowfishs).to({ y: 100 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

		//  Here we create our group and populate it with 6 sprites
		this.octopi = this.add.group();
		this.octopi.enableBody = true;
		
		var octopi_coordinates = (<GameLoader>this.game).octopi_coordinates		

		for (var coord of octopi_coordinates) {
			//  They are evenly spaced out on the X coordinate, with a random Y coordinate
			var sprite = this.octopi.create(coord.x, coord.y, 'seacreatures', 'octopus0000');
			sprite.body.allowGravity = false;
			sprite.scale.setTo(.25, .25);
			
			var ind = octopi_coordinates.indexOf(coord)
			this.sprite_to_index.push({sprite:sprite, array:octopi_coordinates, index:ind});
		}

		//  These are the frame names for the octopus animation. We use the generateFrames function to help create the array.
		var octoframeNames = Phaser.Animation.generateFrameNames('octopus', 0, 24, '', 4);

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

		var aqua_coordinates = (<GameLoader>this.game).aqua_coordinates;		
		
		for (var coord of aqua_coordinates) {
			var aqua_ball = this.aqua_balls.create(coord.x, coord.y, 'aqua_ball');
			aqua_ball.body.allowGravity = false;
			aqua_ball.body.bounce.y = 0.7 + Math.random() * 0.2
			
			var ind = aqua_coordinates.indexOf(coord)
			this.sprite_to_index.push({sprite:sprite, array:aqua_coordinates, index:ind});
		}

		this.score = (<GameLoader>this.game).score;

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
		this.physics.arcade.overlap(this.player, this.octopi, this.startOctopus, null, this);
	}

	decrease_oxygen = () => {
		this.player.oxygen -= this.oxygen_decrease;
		this.oxygenText.text = 'Oxygen: ' + this.player.oxygen
		if (this.player.oxygen <= 0) {
			this.game.state.start('GameOver');
		}
	}

	startBlowfish = (player: any, blowfish: any) =>
	{
		this.game.state.start('BlowFishBattle');
	}

	startOctopus = (player: any, octopus: any) =>
	{
		this.game.state.start('OctopusBattle');
	}

	collectStar = (player: any, star: any) => {

		// Removes the star from the screen
		star.kill();
		player.oxygen += this.oxygen_increase;
		this.oxygenText.text = 'Oxygen: ' + this.player.oxygen
		// Add and update the score
		this.score += 10;
		this.scoreText.text = 'Score: ' + this.score;

		if (this.aqua_balls.total == 0) {
			(<GameLoader>this.game).score = this.score;
			this.game.state.start('LevelPicker');
		}
	}
}