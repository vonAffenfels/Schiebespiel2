import Phaser from 'phaser';

import Enums from '../enums';

export class MenuState extends Phaser.State {
	constructor() {
		super();
	}

	create() {
		let centerX = this.game.world.centerX;
		let titleY = 116;

		let config 	= this.game.config;
		let fontSizeTitle = config.get("fontSize.title");
		let fontSizeScore = config.get("fontSize.score");

		// Draw title
		this.title = this.game.add.bitmapText(centerX, titleY, "fnt_va", "SCHIEBESPIEL", fontSizeTitle);
		this.title.anchor.setTo(0.5);

		// Draw Highscore
		this.score = this.game.add.bitmapText(centerX, this.title.y + fontSizeTitle, "fnt_va", "HIGHSCORE: " + this.game.save.get("highscore"), fontSizeScore);
		this.score.anchor.setTo(0.5);

		let startX = centerX - 300;
		let startY = this.score.y + fontSizeScore;

		// Draw border
		this.border = this.game.add.image(startX - 10, startY - 10, "border");
		this.border.anchor.setTo(0);

		// Draw tiles (complete image)
		this.imageTiles = [];
		for (let i = 0; i < 9; i++) {
			let x = Math.floor(i % 3);
			let y = Math.floor((i - x) / 3);

			this.imageTiles[i] = this.game.add.sprite(x * 200 + startX, y * 200 + startY, "image-" + this.game._getSelectedImage(), i);
			this.imageTiles[i].anchor.setTo(0);
		}

		this.button = this.game.add.sprite(centerX, this.game.world.height - 210, "button_start");
		this.button.anchor.setTo(0.5);
		this.button.inputEnabled = true;
		this.button.events.onInputDown.add(() => {
			this.game.state.start(Enums.States.PLAY);
		});
	}
}