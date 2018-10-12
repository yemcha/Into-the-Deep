class Winner extends Phaser.State {

	bg;

	preload() {
		this.load.image('bgcat', 'assets/tilemaps/tiles/Winner.png');
	}

	create() {
		console.log(this.world.centerX, this.world.centerY)
		this.bg = this.add.tileSprite(0, 0, 1600, 1600, 'bgcat');
	}

	update() {
		//the "click to restart" handler
		this.input.onTap.addOnce(this.startLevelPicker.bind(this));
	}

	startLevelPicker = () => {

		(<GameLoader>this.game).player_coordinate = Object.create((<GameLoader>this.game).player_coordinate_original);
		(<GameLoader>this.game).player_oxygen = (<GameLoader>this.game).player_oxygen_original;
		(<GameLoader>this.game).blowfishs_coordinates = (<GameLoader>this.game).blowfishs_coordinates_original;
		(<GameLoader>this.game).octopi_coordinates = (<GameLoader>this.game).octopi_coordinates_original;

		this.game.state.start('LevelPicker');
	}
}