"use strict";

exports.BattleMovedex = {
//~Steel Sciz
	"dragonsattack": {
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		shortDesc: "Lasts 2-3 turns. Raises Attack and Speed stats by 1 per hit. Confuses the user afterwards.",
		id: "dragonsattack",
		name: "Dragon's Attack",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, bite: 1},
		self: {volatileStatus: 'lockedmove'},
		onAfterMove: function (pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
            this.add('-anim', source, "Super Fang", target);
        },
		secondary: {
			chance: 50,
			self: {
				boosts: {
					atk: 1,
					spe: 1,
				}
			}
		},
		target: "normal",
		type: "Dragon"
	},
//~Hydrostatics
	"tidaldance": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises the user's Sp. Atk, Sp. Def, Speed by 1.",
		id: "tidaldance",
		name: "Tidal Dance",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		boosts: {spa: 1, spd: 1, spe: 1},
		onPrepareHit: function (move, pokemon) {
			this.add('-anim', pokemon, "Geomancy", pokemon);
		},
		secondary: false,
		target: "self",
		type: "Water"
	},
//&Kie
	"mystletainnkick": {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		shortDesc: "Usually goes first.",
		id: "mystletainnkick",
		isViable: true,
		name: "Mystletainn Kick!",
		pp: 10,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Waterfall", target);
		},
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Water"
	},
//&TheGodOfPie
	"dubstepdagger": {
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		shortDesc: "No additional effect.",
		id: "dubstepdagger",
		name: "Dubstep Dagger",
		pp: 10,
		priority: 0,
		onPrepareHit: function (target, source, move) {
            this.attrLastMove('[still]');
			this.add('-anim', source, "Boomburst", target);
			this.add('-anim', target, "Secret Sword", target);
		},
		flags: {sound: 1, protect: 1, mirror: 1, authentic: 1},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion'
		},
		self: {boosts: {def: -1, spd:-1}},
		target: "normal",
		type: "Psychic"
	},
//@StarryWindy
	"victorycharge": {
		accuracy: 100,
		basePower: 180,
		category: "Physical",
		shortDesc: "70% chance to burn the target, 70% chance to lower opponent's Defense and Sp. Def by 1.",
		id: "victorycharge",
		name: "Victory Charge",
		pp: 10,
		onPrepareHit: function (target, source) {
            this.attrLastMove('[still]');
			this.add('-anim', source, "Flamethrower", target);
        },
        onHit: function (target, source) {
			this.add('c|@StarryWindy|If this move works... go, Victory Charge!');
		},
		flags: {defrost: 1, protect: 1, mirror: 1},
		secondaries: [
			{
				chance: 70,
				status: 'brn',
			}, {
				chance: 70,
				boosts: {
					def: -1,
					spd: -1,
				},
			},
		],
		target: "normal",
		type: "Fire"
	},
//@Supernova Robot
	"galaxyblast": {
		accuracy: 100,
		basePower: 150,
		category: "Special",
		shortDesc: "20% chance to flinch the target",
		id: "galaxyblast",
		name: "Galaxy Blast",
		pp: 10,
		priority: 0,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Techno Blast", target);
		},
		flags: {protect: 1, mirror: 1, pulse: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch'
		},
		target: "normal",
		type: "Dragon"
	},
//%Cross-Xz14
	"darkhell": {
		accuracy: 80,
		basePower: 0,
		category: "Status",
		shortDesc: "Puts the foe to sleep.",
		id: "darkhell",
		name: "Dark Hell",
		pp: 10,
		priority: 0,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Dark Void", target);
		},
		flags: {protect: 1, reflectable: 1, mirror: 1},
		status: 'slp',
		secondary: false,
		target: "normal",
		type: "Dark"
	},
//+CLawliet
	"turbulence": {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		shortDesc: "Nearly always goes first.",
		id: "turbulence",
		isViable: true,
		name: "Turbulence",
		pp: 10,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Brave Bird", target);
		},
		priority: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Flying"
	},
//+Dayuh
	"aromaleech": {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		shortDesc: "User recovers 50% of the damage dealt, 50% chance to raise Atk and Spe by 1.",
		id: "aromaleech",
		name: "AromaLeech",
		pp: 10,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Horn Leech", target);
		},
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
		drain: [1, 2],
		secondary: {
			chance: 50,
			self: {
				boosts: {
					atk: 1,
					spe: 1
				}
			}
		},
		target: "normal",
		type: "Grass",
	},
//+Camilas
	"gitrektson": {
		accuracy: 100,
		basePower: 300,
		category: "Physical",
		shortDesc: "User loses 50% max HP after hit.",
		id: "gitrektson",
		name: "Git Rekt Son",
		pp: 10,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Ascent", target);
		},
		onHit: function (target, source, move) {
			this.damage(source.maxhp / 2, source, source);
		},
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		target: "normal",
		type: "Flying"
	},
//Eternal Mayhem
	"danceofshadows": {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "30% chance to raise the user's Sp Atk by 1.",
		id: "danceofshadows",
		name: "Dance Of Shadows",
		pp: 10,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Topsy-turvy", target);
			this.add('-anim', target, "Dark Void", target);
			
		},
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spa: 1,
				}
			}
		},
		target: "normal",
		type: "Dark"
	},
//Ransei
	"finalblast": {
		accuracy: 100,
		basePower: 500,
		category: "Physical",
		shortDesc: "The user faints after use.",
		id: "finalblast",
		name: "Final Blast",
		pp: 10,
		willCrit: true,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Boomburst", target);
		},
		priority: 0,
		flags: {protect: 1, mirror: 1},
		selfdestruct: true,
		secondary: false,
		target: "normal",
		type: "Normal"
	},
//Back At My Day...
	"pastandfuture": {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		shortDesc: "Ignores Steel resistance and Dark immunity, 10% chance to raise SpA, SpD, Def, Eva, and ACC by 1.",
		id: "pastandfuture",
		name: "Past And Future",
		pp: 10,
		ignoreImmunity: true,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('c|Back At My Day...|I am going to change time!');
			this.add('-anim', source, "Luster Purge", target);
		},
		priority: 0,
		onEffectiveness: function (typeMod, type, move) {
			if (type === 'Steel') return 0;
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					spa: 1,
					def: 1,
					spd: 1,
					accuracy: 1,
					evasion: 1
				}
			}
		},
		target: "normal",
		type: "Psychic"
	},
//Elizabeth Swann
	"pixiepower": {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Raises the user's Sp. Atk, Sp. Def, and Speed by 1.",
		id: "pixiepower",
		name: "Pixie Power",
		pp: 10,
		onPrepareHit: function (move, pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, "Geomancy", pokemon);
		},
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spa: 1,
			spd: 1,
			spe: 1
		},
		secondary: false,
		target: "self",
		type: "Fairy"
	},
//Volco
	"woodtreesword": {
        accuracy: 85,
        basePower: 120,
        category: "Physical",
        shortDesc: "Use and Find Out.",
		id: "woodtreesword",
		name: "Wood Tree Sword",
        pp: 15,
        priority: 0,
        flags: {contact: 1, protect: 1, mirror: 1},
        recoil: [1, 3],
        onTryHit: function (target, source, move) {
            this.attrLastMove('[anim]woodhammer');
        },
        onMoveFail: function (target, source, move) {
            this.attrLastMove('[anim]woodhammer');
        },
        onHit: function (target, source, move) {
            this.add('c|Volco|Let\'s do this');
        },
        secondary: false,
        target: "normal",
        type: "Grass",
    },
//Dragotic
	"thegreatquake": {
		accuracy: 110,
		basePower: 100,
		category: "Physical",
		shortDesc: "Hits adjacent Pokemon.",
		id: "thegreatquake",
		name: "The Great Quake",
		pp: 10,
		priority: 0,
		onPrepareHit: function (pokemon) {
            this.attrLastMove('[still]');
            this.add('-anim', pokemon, "Earthquake", pokemon);
        },
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "allAdjacent",
		type: "Ground"
	},
//DarkChaoticFlare
	"parasites": {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		id: "parasites",
		name: "Parasites",
		pp: 10,
		priority: 0,
		onPrepareHit: function (target, pokemon) {
            this.attrLastMove('[still]');
            this.add('-anim', pokemon, "Struggle Bug", target);
        },
		onHit: function (target) {
			target.setItem('stickybarb');
			this.add('-item', target, pokemon.getItem(), '[from] move: Parasites');
			target.addVolatile('partiallytrapped');
			target.addVolatile('leechseed');
			this.add('c|DarkChaoticFlare|BuzzzBuzzzBuzzzBuzzz');
		},
		self: {
			boosts: {
				spe: -2,
			},
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Bug"
	},
};