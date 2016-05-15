// It's not perfect but it works Kappa
'use strict';

let wheelContents = {
	'bulbasaur': {
		name: 'Bulbasaur',
		img: 'http://i.imgur.com/FuNRBK0.png',
		chances: 24,
		winning: 2,
	},
	'charmander': {
		name: 'Charmander',
		img: 'http://i.imgur.com/KkF1HYi.png',
		chances: 21,
		winning: 4,
	},
	'squirtle': {
		name: 'Squirtle',
		img: 'http://i.imgur.com/3FEZhDN.png',
		chances: 18,
		winning: 6,
	},
	'eevee': {
		name: 'Eevee',
		img: 'http://i.imgur.com/apP9zLc.png',
		chances: 15,
		winning: 8,
	},
	'pikachu': {
		name: 'Pikachu',
		img: 'http://i.imgur.com/p4oMLpG.png',
		chances: 12,
		winning: 10,
	},
	'pichu': {
		name: 'Pichu',
		img: 'http://i.imgur.com/dZpE7FF.png',
		chances: 9,
		winning: 12,
	},
	'dragonite': {
		name: 'Dragonite',
		img: 'http://i.imgur.com/EV8hF4t.png',
		chances: 6,
		winning: 15,
	},
	'mew': {
		name: 'Mew',
		img: 'http://i.imgur.com/d2btQHR.png',
		chances: 3,
		winning: 18,
	},	
};

let losingMessages = [
	'Ah! The wheel broke and ran over Dragotic!! HALP!',
	'Paul-Man accidentally burned the wheel down while fighting with his arch-nemesis, Burrito-Man.',
	'Sparkychild enchanted the wheel with her furry powers, it isn\'t stopping now...',
];

function generateWheelResult() {
	let spinTheWheel = Math.floor(Math.random() * 100 + 1);
	let wheelPokemons = Object.keys(wheelContents);
	console.log(spinTheWheel, spinTheWheel);
	for (let i = 0; i < wheelPokemons.length; i++) {
		if (wheelContents[wheelPokemons[i]].chances >= spinTheWheel) {
			console.log(spinTheWheel, wheelContents[wheelPokemons[i]].chances >= spinTheWheel);
			return [wheelContents[wheelPokemons[i]].name, wheelContents[wheelPokemons[i]].img, wheelContents[wheelPokemons[i]].winning];
		}
	}
	return false;
};

function generateDisplay(room, change, img, display) {
	return '|uhtml' + (change ? 'change' : '') + '|wheelGame' + room.wheelGameNumber + '|' + 
	'<div class="infobox" style="background: #A066CC; border: 1px solid #8044B8; border-radius: 20px; box-shadow: inset 1px 1px 3px #FFF;">' + 
	'<center>' +  (img ? '<img src="' + img + '" width="170" height="170"></center><br />' : '') + display + '</center></div>';
}

exports.commands = {
	wheel: function (target, room, user) {
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
				return user.sendTo(room, generateDisplay(room, true, false, '<h3 style="color: crimson; font-weight: bold; text-shadow: 1px 1px 2px #000;">' + losingMessages[Math.floor(Math.random() * losingMessages.length)] + '</h3>'));
			}
			// When a user wins
			Db('money').set(user.userid, Db('money').get(user.userid, 0) + wheelResult[2]);
			user.sendTo(room, generateDisplay(room, true, wheelResult[1], '<center><font style="color: white; font-size: 11pt;">' + 'The wheel stopped at ' + wheelResult[0] + '. Congratulations!! You have won ' + wheelResult[2] + (wheelResult[2] > 1 ? ' bucks' : ' buck') + '.</font></center>'));
		}, 2 * 1000);
	},
};