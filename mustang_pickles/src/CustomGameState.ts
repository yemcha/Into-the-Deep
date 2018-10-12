class CustomGameState extends Phaser.State {

	mouseCoordinateKey: Phaser.Key;
	mouseCoordToggle: boolean;

    preload() {
		this.mouseCoordToggle = false;
    }

    create() {
		this.mouseCoordinateKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
    }

    update() {
        if (this.mouseCoordinateKey.isDown) {
			this.mouseCoordToggle = !this.mouseCoordToggle;
			console.log('mouse coord' + this.mouseCoordToggle)
		}		
		if (this.mouseCoordToggle) {
			console.log('x: ' + this.game.input.x + ', y: ' + this.game.input.y)
		}
    }

    changeGameState = (stateKey) => {
        this.checkpointPlayer();
        this.game.state.start(stateKey);
    }

    checkpointPlayer = () => {
        // default does nothing 
    }
}