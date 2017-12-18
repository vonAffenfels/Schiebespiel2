import Phaser from 'phaser';

import Enums from '../enums';

export class LoadingState extends Phaser.State {
	constructor() {
		super();
	}

	preload() {
	    let loadingBar = this.add.sprite(this.world.centerX, this.world.centerY, "loading");
	    loadingBar.anchor.setTo(0.5,0.5);
	    this.load.setPreloadSprite(loadingBar);

	    for (let i = 0; i < this.game.config.get("numImages"); i++) {
	    	this.game.load.spritesheet("image-" + i, "assets/images/image-" + i + ".png", 200, 200, 9);
	    }

	    this.game.load.image("button_start", "assets/images/button_start.png");
	    this.game.load.image("button_restart", "assets/images/button_neustart.png");
	    this.game.load.image("border", "assets/images/border.png");
	    this.game.load.bitmapFont("fnt_va", 'assets/fonts/fnt_va.png', 'assets/fonts/fnt_va.fnt');

	    this.load.audio("snd_moove", ["assets/sounds/moove.mp3"]);
	}

	create() {
		// set a blue color for the background of the stage
		this.game.stage.backgroundColor = this.game.config.get("game.backgroundColor");

		this.game.save.loadHighscore().then(() => {
			this.game.state.start(Enums.States.MENU);
		});
	}
}