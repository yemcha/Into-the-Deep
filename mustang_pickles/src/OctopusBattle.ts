// tell the transpiler that this depends on CustomGameState being first
/// <reference path="CustomGameState.ts" />
class OctopusBattle extends CustomGameState {
	game: GameLoader;

	player;
	explostions;
	bullet;
	bullets;
	bulletTime;
	tentacleTime;
	tentacle;
	tentaclespeed;
	enemy;
	octopus;
	spaceKey;
	bKey;

	of;
	tentacles;
	cursors;
	octopus_weapon;
	tentacle_timer: Phaser.Timer;

	playerHealthText: Phaser.Text;
	enemyHealthText: Phaser.Text;

	health_start;
	health_decrease;

	octopus_health;
	octopus_health_decrease;
	explosions;

	preload() {
		this.load.image('bfbg', 'assets/tilemaps/tiles/battlebg.png');

		this.load.spritesheet('kaboom', 'assets/sprites/explode.png', 128, 128);
		

		this.load.spritesheet('mustangbc1', 'assets/sprites/mustangbattlechar1.png', 81, 200);

		//  this.load.atlas('bfb', 'assets/sprites/blowfishbattle_json.png', 'assets/sprites/blowfishbattle_json.json');
		this.load.atlas('octopus', 'assets/sprites/octopus.png', 'assets/sprites/octopus.json');

		this.load.image('bullet', 'assets/misc/bullet0.png');
		this.load.image('tentacles', 'assets/sprites/tentacles.png');
		this.load.spritesheet('kaboom', 'assets/sprites/explode.png', 128, 128);
		
		

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
		this.explosions;
		super.preload();
	}

	create() {
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

		this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.B]);

		this.octopus = this.add.sprite(350, 250, 'octopus');
		var frameNames = Phaser.Animation.generateFrameNames('octopus', 0, 4, '', 4);
		this.octopus.animations.add('swim', frameNames, 3, true, false);

		this.octopus.animations.play('swim');
		this.octopus.enableBody = true;
		this.physics.enable(this.octopus, Phaser.Physics.ARCADE);

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

		this.player.animations.add('right', [5, 6, 7, 8], 10, true);
		this.player.animations.add('claw', [9, 10, 11], 2, true);

		this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.bKey = this.input.keyboard.addKey(Phaser.Keyboard.B);

		this.add.tween(this.octopus).to({ y: 100 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

		this.octopus_weapon = new WeaponEightWay(this, 'tentacles', 200, 200)

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
		
		super.create();
		 //  An explosion pool
		

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
		else if (this.cursors.up.isDown) {
			//  Move down
			this.player.body.velocity.y = 150;
			this.player.animations.play('right');
		}
		else if (this.cursors.down.isDown) {
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
		
		this.physics.arcade.overlap(this.player, this.octopus_weapon, this.cathitbytentacle, null, this);

		// sprite will always be the first in overlap params regardless of parameter order, for call back
		this.physics.arcade.overlap(this.octopus, this.bullets, this.octopushitbybullet, null, this);

		this.physics.arcade.overlap(this.bullets, this.octopus_weapon, this.bullethitstentacle, null, this);

		this.octopus.animations.play('fish');

		super.update();
	}

	firetentacle = () => {

		this.octopus_weapon.fire(this.octopus)
		this.octopus.bringToTop()

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

	cathitbytentacle = (cat, tentacle) => {
		this.player.health -= this.health_decrease;
		console.log('ouch');
		console.log('health @:' + this.player.health)

		this.playerHealthText.text = 'Player Health: ' + this.player.health;

		tentacle.kill();
		
		if (this.player.health <= 0) {

			this.player.animations.play('dying');
			// this.player.kill();
			this.game.state.start('GameOver');

			cat.kill();
		}
	}

	octopushitbybullet = (octopus, bullet) => {
		this.octopus_health -= this.octopus_health_decrease;
		console.log('octopus hit by bullet')
		console.log('of health @:' + this.octopus_health)


		this.enemyHealthText.text = 'Enemy Health: ' + this.octopus_health;


		console.log(bullet)
		console.log(octopus)

		bullet.kill();

		if (this.octopus_health <= 0) {
			console.log('blowfish killed')
			this.octopus.kill();
			this.tentacle_timer.stop();

			this.game.state.start('LevelPicker2');
		}
	}

	setupInvader = (tentacles, octopus) => {
		
			tentacles.anchor.x = 0.5;
			tentacles.anchor.y = 0.5;
			octopus.anchor.x = 0.5;
			octopus.anchor.y = 0.5;
			tentacles.animations.add('kaboom');
			octopus.animations.add('kaboom');
			
		
		}


	bullethitstentacle = (bullet, tentacle) => {
		console.log('tentacle hit by bullet')
		bullet.kill();
		tentacle.kill();
	}

	//  Called if the bullet goes out of the screen
	resetBullet = (bullet) => {

		bullet.kill();

	}
}