import Phaser from 'phaser';

import Enums from './enums';

export default class GameConfig {
	constructor() {
		this._data = {
			game: {
				//baseWidth: 320,
				//baseHeight: 568,
				baseWidth: 750,
				baseHeight: 1334,
				maxWidth: 768,
				width: "100%",
				height: "100%",
				enableDebug: false,
				backgroundColor: '#ffffff',
				renderer: Phaser.CANVAS,
				name: "Schiebespiel"
			},

			fontSize: {
				title: 			84,
				score: 			64
			},

			defaultState: 		Enums.States.BOOT,
			scoreGain:  		50,
			scoreBegin: 		10000,
			numImages: 			4, 

			songs:    			[
				"LvWBz1pLXps",
				"y3LZr6dSM8A",
				"I4jznFlGMUo",
				"5blg8NegJDY",
				"Cn3NXlEMyAk",
				"RSzhPoUH-G8",
				"1VlD6fKWQDk",
				"CuIn95h10ZQ",
				"Cb5oXKa8phg"
			]
		};
	}

	get(key, def) {
		let keys = key.split(".");

		let curVal = this._data;
		while (keys.length > 0) {
			let curKey = keys.shift();
			if (!curVal.hasOwnProperty(curKey)) {
				return def;
			}

			curVal = curVal[curKey];
		}

		return curVal;
	}
}