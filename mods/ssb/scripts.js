"use strict";

exports.BattleScripts = {
	randomSeasonalMeleeTeam: function (side) {
		let team = [];
		let variant = (this.random(2) === 1);
		let sets = {
			// Admins.
				'~Hydrostatics': {
					species: 'Kyogre', ability: 'Drizzle', item: 'Life Orb', gender: 'M',
					moves: ['thunder', 'blizzard', 'originpulse'],
					signatureMove: "Tidal Dance",
					evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
				},
				'~Steel Sciz': {
					species: 'Charizard-Mega-X', ability: 'Tough Claws', item: 'Charizardite X', gender: 'M',
					moves: ['dragondance', 'roost', 'flareblitz'],
					signatureMove: "Dragon's Attack",
					evs: {atk:252, hp:252, spd:4}, nature: 'Adamant',
				},
			// Leaders
				'&Kie': {
					species: 'Feraligatr', ability: 'Piercing Cyclone', item: 'Lum Berry', gender: 'M',
					moves: ['swordsdance', 'earthquake', 'dragonclaw'],
					signatureMove: "Mystletainn Kick",
					evs: {hp:216, atk:252, spe:40}, nature: 'Jolly',
				},
            // Moderators
				'@Supernova Robot': {
					species: 'Nidoran-M', ability: 'Download', item: 'Supernova Stone', gender: 'N', shiny: true,
					moves: ['hydropump', 'fireblast', 'earthpower'],
					signatureMove: "Galaxy Blast",
					evs: {def:4, spa:252, hp:252}, nature: 'Modest',
				},
				'@StarryWindy': {
					species: 'Victini', ability: 'Magic Guard', item: 'Leftovers', gender: 'M',
					moves: ['thunderwave', 'energyball', 'thunderbolt'],
					signatureMove: "Victory Charge",
					evs: {hp:252, spa:252, spe:4}, nature: 'Modest',
				},
				'@TheGodOfPie': {
					species: 'Gallade-Mega', ability: 'Mystic Blades', item: 'Matterless Pie', gender: 'M', shiny: true,
					moves: ['earthquake', 'shadowsneak', 'closecombat'],
					signatureMove: "Boundary Blade",
					evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
				},
            // Drivers
            	'%Cross-Xz14': {
					species: 'Darkrai', ability: 'Bad Dreams', item: 'Life Orb', gender: 'F',
					moves: ['darkpulse', 'nastyplot', 'sludgebomb'],
					signatureMove: "Dark Hell",
					evs: {spe:252, spa:252, spd:4}, nature: 'Timid',
				},
			//Operators
			//Voices
				'+Camilas': {
					species: 'Rayquaza-Mega', ability: 'Pls Ban', item: 'Jade Orb', gender: 'M',
					moves: ['roost', 'vcreate', 'earthquake'],
					signatureMove: "Git Rekt Son",
					evs: {atk:252, hp:4, spe:252}, nature: 'Adamant',
				},
				'+CLawliet': {
					species: 'Dragonite', ability: 'Multipower', item: 'Stats B00ster', gender: 'M',
					moves: ['dragondance', 'dragonclaw', 'earthquake'],
					signatureMove: "Turbulence",
					evs: {spe:252, atk:252, hp:4}, nature: 'Jolly',
				},
				'+Dayuh': {
					species: 'Floette-Eternal', ability: 'Magic Bounce', item: 'Life Orb', gender: 'F', shiny: true,
					moves: ['energyball', 'psychic', 'substitute'],
					signatureMove: "Cold Moonlight",
					evs: {spe:252, spa:252, hp:4}, nature: 'Timid',
				},
			//Regulars
				'Eternal Mayhem': {
					species: 'Greninja', ability: 'Protean', item: 'Life Orb', gender: 'M', shiny: true,
					moves: ['icebeam', 'hydropump', 'extrasensory'],
					signatureMove: "Dance Of Shadows",
					evs: {spe:252, spa:236, hp:20}, nature: 'Timid'
				},
				'Ransei': {
					species: 'Arceus', ability: 'Wonder Barrier', item: 'Life Orb', gender: 'M',
					moves: ['swordsdance', 'calmmind', 'doubleteam'],
					signatureMove: "Final Blast",
					evs: {spe:252, atk:252, hp:4}, nature: 'Jolly',
				},
				'Back At My Day...': {
					species: 'Dialga', ability: 'Time Traveller', item: 'Life Orb', gender: 'M',
					moves: ['flamethrower', 'roaroftime', 'flashcannon'],
					signatureMove: "Past And Future",
					evs: {spa:252, def:4, hp:252}, nature: 'Quiet',
				},
				'Dragotic': {
					species: 'Garchomp', ability: 'Ascent', item: 'Yache Berry', gender: 'M',
					moves: ['dragonclaw', 'dragondance', 'ironhead'],
					signatureMove: "The Great Quake",
					evs: {atk:252, spe:252, hp:4}, nature: 'Adamant',
				},
				'Elizabeth Swann': {
					species: 'Gardevoir-Mega', ability: 'Pixilate', item: 'Gardevoirite', gender: 'F',
					moves: ['hypervoice', 'shadowball', 'energyball'],
					signatureMove: "Pixie Power",
					evs: {spe:252, spa:252, hp:4}, nature: 'Modest',
				},
				'Volco': {
					species: 'Torterra', ability: 'Let\'s Do This', item: 'Leftovers', gender: 'M',
					moves: ['outrage', ['earthquake', 'stoneedge'][this.random(2)], 'crunch'],
					signatureMove: "Wood Tree Sword",
					evs: {spe:252, spa:252, hp:4}, nature: 'Modest',
				},
				'DarkChaoticFlare': {
					species: 'Umbreon', ability: 'Invulnerable', item: 'Healing Coat', gender: 'M', shiny: true,
					moves: ['foulplay','suckerpunch', 'moonlight'],
					signatureMove: "Neon Protection",
					evs: {def:252, spd:252, atk:4}, nature: 'Adamant',
				},
			};
		// Generate the team randomly.
		let pool = Object.keys(sets);
		for (let i = 0; i < 6; i++) {
			let name = this.sampleNoReplace(pool);
			let set = sets[name];
			set.level = 100;
			set.name = name;
			if (!set.ivs) {
				set.ivs = {hp:31, atk:31, def:31, spa:31, spd:31, spe:31};
			} else {
				for (let iv in {hp:31, atk:31, def:31, spa:31, spd:31, spe:31}) {
					set.ivs[iv] = iv in set.ivs ? set.ivs[iv] : 31;
				}
			}
			// Assuming the hardcoded set evs are all legal.
			if (!set.evs) set.evs = {hp:84, atk:84, def:84, spa:84, spd:84, spe:84};
			set.moves = [this.sampleNoReplace(set.moves), this.sampleNoReplace(set.moves), this.sampleNoReplace(set.moves)].concat(set.signatureMove);
			team.push(set);
		}

		return team;
	},
};