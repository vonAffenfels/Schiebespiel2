import Phaser from 'phaser';

import Enums from '../enums';

export class PlayState extends Phaser.State {
	constructor() {
		super();
	}

	create() {
		this.turns = 0;
		this.score = 0;
		this.hasWon = false;

		let frame = document.getElementById("ytembed");
		if (frame) {
			document.body.removeChild(frame);
		}

		this._shuffle();
		if (!this._isSolvable()) {
			if (this.currentFreeTile < 2) {
				// Free tile is at beginning - swap at end
				let tmp = this.tiles[7];
				this.tiles[7] = this.tiles[8];
				this.tiles[8] = tmp;
			} else {
				let tmp = this.tiles[0];
				this.tiles[0] = this.tiles[1];
				this.tiles[1] = tmp;
			}
		}

		this._createDisplay();
		this.mooveAudio = this.game.add.audio("snd_moove");
	}

	_createFrame(song) {
		let frame = document.createElement('iframe');
		frame.setAttribute("id", "ytembed");
		frame.setAttribute("src", "https://www.youtube.com/embed/" + song + "?autoplay=1&fs=0&rel=0");
		frame.setAttribute("frameborder", "0");
		frame.setAttribute("allowfullscreen", "allowfullscreen");
		document.body.appendChild(frame);
	}

	_shuffle() {
		this.tiles = Phaser.ArrayUtils.shuffle(Phaser.ArrayUtils.numberArray(0, 8));
		this.currentFreeTile = this.tiles.indexOf(8);
	}

	_sumInversions() {
		let inversions = 0;
		for (let i = 0; i < 9; i++) {
			inversions += this._countInversion(i);
		}

		return inversions;
	}

	_isSolvable() {
		return (this._sumInversions() % 2 == 0);
	}

	_countInversion(index) {
		let indexValue = this.tiles[index];
		let inversions = 0;

		for (let i = index + 1; i < 9; i++) {
			let compValue = this.tiles[i];
			if (indexValue > compValue && indexValue != 8) {
				inversions++;
			}
		}

		return inversions;
	}

	_tileClicked(index) {
		if (this.hasWon) {
			return;
		}

		if (index < 0 || index > 8) {
			return;
		}

		let freeNeighbor = this._getNeighborFree(index);
		if (freeNeighbor == null) {
			return;
		}

		this.mooveAudio.play();
		this._swapNeighbors(index, freeNeighbor);
		
		this.turns++;
		this.turnsText.text = "ZÜGE: " + this.turns;

		this._checkWinning();
	}

	_swapNeighbors(i, j) {
		this.imageTiles[i].visible = false;

		let tmp = this.imageTiles[i].frame;
		this.imageTiles[i].frame = this.imageTiles[j].frame;
		this.imageTiles[j].frame = tmp;

		this.tiles[i] = this.imageTiles[i].frame;
		this.tiles[j] = this.imageTiles[j].frame;

		this.imageTiles[j].visible = true;
		this.currentFreeTile = i;
	}

	_checkWinning() {
		this.hasWon = true;
		for (let i = 0; i < 9; i++) {
			if (this.imageTiles[i].frame != i) {
				this.hasWon = false;
			}
		}

		if (this.hasWon) {
			this.score = this.game.config.get("scoreBegin") - this.game.config.get("scoreGain") * this.turns;
			if (this.score < 0) {
				this.score = 0;
			}

			this.imageTiles[this.currentFreeTile].visible = true;
			this.winning.visible = true;

			this.scoreText.text = "SCORE: " + this.score;
			this.scoreText.visible = true;

			if (this.score > this.game.save.get("highscore")) {
				this.newHighscore.visible = true;
				this.game.save.set("highscore", this.score);
			}

			let song = Phaser.ArrayUtils.getRandomItem(this.game.config.get("songs"));
			this._createFrame(song);
		}
	}

	_getIndexByGrid(x, y) {
		return y * 3 + x;
	}

	_getGridByIndex(index) {
		let x = Math.floor(index % 3);
		let y = Math.floor((index - x) / 3);

		return [x, y];
	}

	_getNeighborFree(index) {
		let [x, y] = this._getGridByIndex(index);

		if (y - 1 >= 0 && !this.imageTiles[this._getIndexByGrid(x, y - 1)].visible) {
			return this._getIndexByGrid(x, y - 1);
		}

		if (y + 1 < 3 && !this.imageTiles[this._getIndexByGrid(x, y + 1)].visible) {
			return this._getIndexByGrid(x, y + 1);
		}

		if (x - 1 >= 0 && !this.imageTiles[this._getIndexByGrid(x - 1, y)].visible) {
			return this._getIndexByGrid(x - 1, y);
		}

		if (x + 1 < 3 && !this.imageTiles[this._getIndexByGrid(x + 1, y)].visible) {
			return this._getIndexByGrid(x + 1, y);
		}

		return null;
	}

	_createDisplay() {
		let centerX = this.game.world.centerX;
		let titleY = 58;

		let config 	= this.game.config;
		let fontSizeTitle = config.get("fontSize.title");
		let fontSizeScore = config.get("fontSize.score");

		// Draw title
		this.title = this.game.add.bitmapText(centerX, titleY, "fnt_va", "SCHIEBESPIEL", fontSizeTitle);
		this.title.anchor.setTo(0.5);

		// Draw Turns
		this.turnsText = this.game.add.bitmapText(centerX, this.title.y + fontSizeTitle, "fnt_va", "ZÜGE: " + this.turns, fontSizeScore);
		this.turnsText.anchor.setTo(0.5);

		let startX = centerX - 300;
		let startY = this.turnsText.y + fontSizeScore;

		// Draw border
		this.border = this.game.add.image(startX - 10, startY - 10, "border");
		this.border.anchor.setTo(0);

		// Draw tiles
		this.imageTiles = [];
		for (let i = 0; i < 9; i++) {
			let x = Math.floor(i % 3);
			let y = Math.floor((i - x) / 3);

			this.imageTiles[i] = this.game.add.sprite(x * 200 + startX, y * 200 + startY, "image-" + this.game._getSelectedImage(), this.tiles[i]);
			this.imageTiles[i].anchor.setTo(0);
			this.imageTiles[i].visible = this.currentFreeTile != i;
			this.imageTiles[i].inputEnabled = true;
			this.imageTiles[i].events.onInputDown.add(() => {
				this._tileClicked(i);
			});
		}

		this.button = this.game.add.sprite(centerX, this.game.world.height - 210, "button_restart");
		this.button.anchor.setTo(0.5);
		this.button.inputEnabled = true;
		this.button.events.onInputDown.add(() => {
			// Restart
			this.game.state.start(this.game.state.current);
		});

		// Draw Wining Text
		this.winning = this.game.add.bitmapText(centerX, startY + 300, "fnt_va", "GEWONNEN", fontSizeTitle);
		this.winning.anchor.setTo(0.5);
		this.winning.visible = false;

		// Draw Score Text
		this.scoreText = this.game.add.bitmapText(centerX, startY + 400, "fnt_va", "SCORE: " + this.score, fontSizeScore);
		this.scoreText.anchor.setTo(0.5);
		this.scoreText.visible = false;

		// Draw New Highscore Text
		this.newHighscore = this.game.add.bitmapText(centerX, startY + 470, "fnt_va", "NEUER HIGHSCORE", fontSizeScore);
		this.newHighscore.anchor.setTo(0.5);
		this.newHighscore.visible = false;
	}
}