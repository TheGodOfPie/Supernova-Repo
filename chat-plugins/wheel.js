// Artwork: TheGodOfPie, Coded By Dragotic

'use strict';

// chancesMin & chancesMax is the range, if "spinTheWheel" ends up between them the user wins.
let wheelContents = {
	'bulbasaur': {
		name: 'Bulbasaur',
		img: 'http://i.imgur.com/FuNRBK0.png',
		chancesMin: 85,
		chancesMax: 80,
		winning: 2,
	},
	'charmander': {
		name: 'Charmander',
		img: 'http://i.imgur.com/KkF1HYi.png',
		chancesMax: 79,
		chancesMin: 76,
		winning: 4,
	},
	'squirtle': {
		name: 'Squirtle',
		img: 'http://i.imgur.com/3FEZhDN.png',
		chancesMax: 37,
		chancesMin: 34,
		winning: 6,
	},
	'eevee': {
		name: 'Eevee',
		img: 'http://i.imgur.com/apP9zLc.png',
		chancesMax: 29,
		chancesMin: 27,
		winning: 8,
	},
	'pikachu': {
		name: 'Pikachu',
		img: 'http://i.imgur.com/p4oMLpG.png',
		chancesMax: 23,
		chancesMin: 21,
		winning: 10,
	},
	'pichu': {
		name: 'Pichu',
		img: 'http://i.imgur.com/dZpE7FF.png',
		chancesMax: 17,
		chancesMin: 15,
		winning: 12,
	},
	'dragonite': {
		name: 'Dragonite',
		img: 'http://i.imgur.com/EV8hF4t.png',
		chancesMax: 4,
		chancesMin: 2,
		winning: 15,
	},
	'mew': {
		name: 'Mew',
		img: 'http://i.imgur.com/d2btQHR.png',
		chancesMax: 2,
		chancesMin: 0,
		winning: 18,
	},	
};

// Array of the messages you get when you lose
let losingMessages = [
	'Ah! The wheel broke and ran over Dragotic!! HALP!',
	'Paul-Man accidentally burned the wheel down while fighting with his arch-nemesis, Burrito-Man.',
	'Sparkychild enchanted the wheel with her furry powers, it isn\'t stopping now...',
	'Steel Sciz bullet punched through the wheel, #BlameNaten',
	'Drag-Boy forgot to oil the Paul-Cave\'s door and crashed into it.',
	'TheGodOfPie barged in and threw the wheel in the oven!',
];

// Generate results for the wheel, if it's a win return the name of the pokemon the wheel stopped at it and it's winning and image
function generateWheelResult() {
	let spinTheWheel = Math.floor(Math.random() * 100 + 1);
	let wheelPokemons = Object.keys(wheelContents);
	for (let i = 0; i < wheelPokemons.length; i++) {
		let pokemon = wheelContents[wheelPokemons[i]];
		// the conditions that apply to win
		let conditions = pokemon.chancesMin < spinTheWheel && pokemon.chancesMax >= spinTheWheel;
		if (conditions) {
			return [pokemon.name, pokemon.img, pokemon.winning];
		}
	}
	// Incase it's a loss
	return false;
};

//Generates the display for the wheel
function generateDisplay(room, change, img, display) {
	change = (change ? 'change' : '');
	img = (img ? '<img src="' + img + '" width="170" height="170"></center><br />' : '');
	return '|uhtml' + change + '|wheelGame' + room.wheelGameNumber + '|' + 
	'<div class="infobox" style="background: #A975D1; border: 1px solid #8044B8; border-radius: 20px; box-shadow: inset 1px 1px 3px #FFF; padding: 10px;">' + 
	'<center><img src="http://i.imgur.com/y1ZyUsO.png?1" width="450" height="70"><br />' + img + display + '</center></div>';
}

exports.commands = {
	wheel: {
		spin: function (target, room, user) {
			if (!this.canTalk()) return false;
			if (Db('money').get(user.userid, 0) < 2) return this.errorReply('You don\'t have enough bucks to play this game.');
			if (!room.wheelGameNumber) room.wheelGameNumber = 0;

			room.wheelGameNumber++;
			let wheelResult = generateWheelResult();

			// Wheel's spinning gif
			user.sendTo(room, generateDisplay(room, false, 'http://i.imgur.com/3xtv5Ui.gif', '<center><font style="color: white; font-size: 11pt;">' + 'The Wheel\'s Spinning....' + '</font></center>'));
					
			setTimeout( function() {
				// If the user loses, it would generate a message out of the losing messages array
				if (!wheelResult) {
					Db('money').set(user.userid, Db('money').get(user.userid, 0) - 2);
					return user.sendTo(room, generateDisplay(room, true, false, '<div style="background: rgba(255, 50, 70, 0.6); border: 1px solid #FF0000; border-radius: 5px; padding: 5px;"><font style="color: #FF0000; font-family: Arial; font-size: 11pt; text-shadow: 0px -1px 4px #000, 0px 1px 4px #000;">' + 
						losingMessages[Math.floor(Math.random() * losingMessages.length)] + '</font></div>'));
				}

				// The results output if a user wins
				let pokemonName = wheelResult[0];
				let pokemonImg = wheelResult[1];
				let pokemonWinning = wheelResult[2];

				// When a user wins
				Db('money').set(user.userid, Db('money').get(user.userid, 0) + wheelResult[2]);
				user.sendTo(room, generateDisplay(room, true, pokemonImg, '<center><font style="color: white; font-size: 11pt;">' + 'The wheel stopped at ' + pokemonName + '. ' + 
					'Congratulations!! You have won ' + pokemonWinning + ' bucks.</font></center>'));
			}, 2 * 1000);
		},
	},
	wheelhelp: ['The Wheel Is a Casino Game.',
	'Following are the winnings from the wheel:',
	'- Bulbasaur - 2 Bucks',
	'- Charmander - 4 Bucks',
	'- Squirtle - 6 Bucks',
	'- Eevee - 8 Bucks',
	'- Pikachu - 10 Bucks',
	'- Pichu - 12 Bucks',
	'- Dragonite - 15 Bucks',
	'- Mew - 18 Bucks'],
};