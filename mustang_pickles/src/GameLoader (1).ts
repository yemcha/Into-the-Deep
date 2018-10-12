class GameLoader extends Phaser.Game {

	score;
	blowfishs_coordinates;
	blowfishs_coordinates_original;
	octopi_coordinates;
	octopi_coordinates_original;
	aqua_coordinates;

	player_coordinate;
	player_coordinate_original;

	player_oxygen;
	player_oxygen_original;

	constructor() {

		super(800, 600, Phaser.AUTO, 'content', null);

		this.score = 0;

		this.player_oxygen = 100;
		this.player_oxygen_original = 100;
		
		this.player_coordinate = { x: 19.50, y: 90 }
		
		this.player_coordinate_original = { x: 19.50, y: 90 }//Object.create(this.player_coordinate);

		this.blowfishs_coordinates = [
			{ x: 212, y: 479.99999999999994 }, { x: 449.5, y: 432 }, { x: 803, y: 896 }, { x: 876, y: 1400 }, { x: 250, y: 0 }, { x: 320, y: 1470 }, { x: 1315, y: 1312 }, { x: 150, y: 1248 },
			{ x: 10, y: 870 }, { x: 0, y: 272 }, { x: 77, y: 272 }, { x: 759, y: 360 }, { x: 1122, y: 656 },
			{ x: 500, y: 250 }
		]
		this.blowfishs_coordinates_original = this.blowfishs_coordinates.slice(0);

		this.octopi_coordinates = this.octopi_coordinates_original = [
			{ x: 212, y: 479.99999999999994 }, { x: 449.5, y: 432 }, { x: 803, y: 896 }, { x: 876, y: 1400 }, { x: 250, y: 0 }, { x: 320, y: 1470 }, { x: 1315, y: 1312 }, { x: 150, y: 1248 },
			{ x: 10, y: 870 }, { x: 0, y: 272 }, { x: 77, y: 272 }, { x: 759, y: 360 }, { x: 1122, y: 656 }, { x: 1100, y: 1040 }
		]

		this.octopi_coordinates_original = this.octopi_coordinates.slice(0);

		this.aqua_coordinates = [
			{ x: 367, y: 1280 }, { x: 556, y: 1168 }, { x: 803, y: 100 }, { x: 876, y: 1568 }, { x: 1426.5, y: 752 }, { x: 0, y: 1456 }, { x: 276, y: 1504 }, { x: 1315, y: 1250 }, { x: 1580, y: 1312 }, { x: 104, y: 1248 },
			{ x: 170.5, y: 1136 }, { x: 133, y: 900 }, { x: 0, y: 576 }, { x: 990, y: 1440 }, { x: 1264, y: 1424 }, { x: 1580, y: 848 }, { x: 752, y: 1264 }, { x: 471, y: 912 }, { x: 370, y: 208 },
			{ x: 371, y: 1104 }, { x: 340, y: 800 }, { x: 0, y: 448 }, { x: 612, y: 368 }, { x: 721.5, y: 192 }, { x: 907, y: 368 },
			{ x: 1324, y: 816 }, { x: 1030, y: 912 }, { x: 1200, y: 1040 }, { x: 42, y: 272 }, { x: 1224, y: 208 }, { x: 526.5, y: 1392 }

		]

		this.state.add('LevelPicker', LevelPicker, false);
		this.state.add('LevelPicker2', LevelPicker2, false);
		this.state.add('BlowFishBattle', BlowFishBattle, false);
		this.state.add('OctopusBattle', OctopusBattle, false);
		this.state.add('GameOver', GameOver, false);

		this.state.start('LevelPicker');
		//this.state.start('BlowFishBattle');

	}

}

// when the page has finished loading, create our game
window.onload = function () {
	(<any>window).game = new GameLoader();
};
