// tell the transpiler that this depends on CustomGameState being first
/// <reference path="CustomGameState.ts" />
class BlowFishBattle extends CustomGameState {
	game: GameLoader;

	player;

	bullet;
	bullets;
	bulletTime;
	spikeTime;
	spike;
	spikespeed;
	enemy;
	blowfish;
	spaceKey;
	bKey;

	bf;
	spikes;
	cursors;
	blowfish_weapon;
	spike_timer: Phaser.Timer;

	playerHealthText: Phaser.Text;
	enemyHealthText: Phaser.Text;

	health_start;
	health_decrease;

	blowfish_health;
	blowfish_health_decrease;
	explosions;

	preload() {
		this.load.image('bfbg', 'assets/tilemaps/tiles/battlebg.png');

		this.load.spritesheet('mustangbc1', 'assets/sprites/mustangbattlechar1.png', 81, 200);

		//  this.load.atlas('bfb', 'assets/sprites/blowfishbattle_json.png', 'assets/sprites/blowfishbattle_json.json');
		this.load.atlas('fish', 'assets/sprites/blowfishatlas.png', 'assets/sprites/blowfishatlas.json');

		this.load.image('bullet', 'assets/misc/bullet0.png');
		this.load.image('spikes', 'assets/sprites/spikes.png');
		this.load.spritesheet('kaboom', 'assets/sprites/explode.png', 128, 128);

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
		this.explosions;
		super.preload();
	}

	create() {
		//  We're going to be using physics, so enable the Arcade Physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.bf = this.add.tileSprite(0, 0, 1600, 1600, 'bfbg');

		this.bullets = this.add.group();

		this.bullets.enableBody = true;

		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

		this.bullets.createMultiple(35, 'bullet');
		this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
		this.bullets.setAll('checkWorldBounds', true);

	//	this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.B]);

		this.spikes = this.add.group();

		this.spikes.enableBody = true;

		this.spikes.physicsBodyType = Phaser.Physics.ARCADE;

		this.spikes.createMultiple(35, 'spikes');
		this.spikes.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
		this.spikes.setAll('checkWorldBounds', true);

		this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.B]);
		
		this.blowfish = this.add.sprite(350, 250, 'fish');
		var frameNames = Phaser.Animation.generateFrameNames('Blowfishfront', 0, 3, '', 4);
		this.blowfish.animations.add('swim', frameNames, 3, true, false);

		this.blowfish.animations.play('swim');
		this.blowfish.enableBody = true;
		this.physics.enable(this.blowfish, Phaser.Physics.ARCADE);

		// The player and its settings
		this.player = this.add.sprite(250, 250, 'mustangbc1');
		// this.enemy = this.add.sprite(500, 250, 'blowfishspikeimage');


		//  We need to enable physics on the player
		this.physics.arcade.enable(this.player);

		//  Player physics properties. Give the little guy a slight bounce.
		this.player.body.allowGravity = false;
		this.player.body.bounce.y = 0.7 + Math.random() * 0.2

		//  Our two animations, walking left and right.
		this.player.animations.add('left', [0, 1, 2, 3], 10, true);

		this.player.animations.add('right', [4, 5, 6, 7], 10, true);
		this.player.animations.add('claw', [9, 10, 11], 2, true);

		this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.bKey = this.input.keyboard.addKey(Phaser.Keyboard.B);

		this.add.tween(this.blowfish).to({ y: 100 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

		this.blowfish_weapon = new WeaponEightWay(this, 'spikes', 450, 299)

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
		
		super.create();

		this.explosions = this.add.group();
		this.explosions.createMultiple(30, 'kaboom');
		this.explosions.forEach(this.setupInvader, this);
	}

	update() {
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
		else if (this.cursors.down.isDown) {
			//  Move to the right
			this.player.body.velocity.y = 150;
			this.player.animations.play('right');
		}
		else if (this.cursors.up.isDown) {
			//  Move up
			this.player.body.velocity.y = -150;
			this.player.animations.play('right');
		}
		else if (this.spaceKey.isDown) {
			this.fireBullet();
		}
		else if (this.bKey.isDown) {
			this.player.body.velocity.x = 5;

			this.player.animations.play('claw')
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

		super.update();
	}

	fireSpike = () => {

		this.blowfish_weapon.fire(this.blowfish)
		this.blowfish.bringToTop()

	}

	fireBullet = () => {

		if (this.game.time.now > this.bulletTime) {
			var bullet = this.bullets.getFirstExists(false);

			if (bullet) {
				bullet.reset(this.player.x + 50, this.player.y - 1);
				bullet.body.velocity.x = 600;
				this.bulletTime = this.game.time.now + 600;
			}
		}

	}

	cathitbyspike = (cat, spike) => {
		this.player.health -= this.health_decrease;
		console.log('ouch');
		console.log('health @:' + this.player.health)

		this.playerHealthText.text = 'Player Health: ' + this.player.health;

		spike.kill();

		if (this.player.health <= 0) {

			this.player.animations.play('dying');
			// this.player.kill();
			this.game.state.start('GameOver');

			cat.kill();
		}
	}

	blowfishhitbybullet = (blowfish, bullet) => {
		this.blowfish_health -= this.blowfish_health_decrease;
		console.log('blowfish hit by bullet')
		console.log('bf health @:' + this.blowfish_health)


		this.enemyHealthText.text = 'Enemy Health: ' + this.blowfish_health;


		console.log(bullet)
		console.log(blowfish)

		var explosion = this.explosions.getFirstExists(false);
		explosion.reset(blowfish.body.x, blowfish.body.y);
		explosion.play('kaboom', 30, false, true);

		bullet.kill();

		if (this.blowfish_health <= 0) {
			console.log('blowfish killed')
			this.blowfish.kill();
			this.spike_timer.stop();

			this.game.state.start('LevelPicker');
		}
	}

	setupInvader = (spike, blowfish) => {
		
			spike.anchor.x = 0.5;
			spike.anchor.y = 0.5;
			//blowfish.anchor.x = 0.5;
			//blowfish.anchor.y = 0.5;
			spike.animations.add('kaboom');
			//blowfish.animations.add('kaboom');
		}

		setupInvader2 = (blowfish, spike) => {
			
				blowfish.anchor.x = 0.5;
				blowfish.anchor.y = 0.5;
				//blowfish.anchor.x = 0.5;
				//blowfish.anchor.y = 0.5;
				//spike.animations.add('kaboom');
				blowfish.animations.add('kaboom');
			}


	bullethitsspike = (bullet, spike) => {
		console.log('spike hit by bullet')
		

		var explosion = this.explosions.getFirstExists(false);
		explosion.reset(bullet.body.x, bullet.body.y);
		explosion.play('kaboom', 30, false, true);
	
		bullet.kill();
		spike.kill();
	}

	

	//  Called if the bullet goes out of the screen
	resetBullet = (bullet) => {

		bullet.kill();

	}
}