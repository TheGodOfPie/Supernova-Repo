'use strict';

exports.BattleItems = {
	"matterlesspie": {
		id: "matterlesspie",
		name: "Matterless Pie",
		onBasePowerPriority: 6,
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return this.chainModify(1.4);
			}
		},
		desc: "Boosts Psychic-type moves' power by 1.4."
	},
   	"oldrod": {
		id: "oldrod",
		name: "Old Rod",
		onSwitchIn: function (target, pokemon) {
			this.boost({def: 2});
			this.boost({spd: 2});
			this.boost({spe: -6});
			this.boost({atk: 1});
		},
	},
   	"statsb00ster": {
		id: "statsb00ster",
		name: "Stats B00ster",
		onHit: function (target, source, move) {
			if (target.hp && move.category !== 'Status' && !move.damage && !move.damageCallback && move.typeMod > 0 && target.useItem()) {
				this.boost({atk: 1, spe: 1});
			}
		},
		desc: "+1 to Atk and Spe when damaged by a super effective move."
	},
	"jadeorb": {
		id: "jadeorb",
		name: "Jade Orb",
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function (pokemon) {
			this.boost({atk: 1, spa: 1, spe: 1, def: 1, spd: 1, accuracy: 1});
			this.damage(pokemon.maxhp / 4);
		},
		desc: "+1 to all stats at the end of each turn, then removes 25% of the holder's max HP."
	},
	"solarstone": {
		id: "solarstone",
		name: "Solar Stone",
		megaStone: "Reshiram",
		megaEvolves: "Litleo",
		onTakeItem: function (item, source) {
			if (item.megaEvolves === source.baseTemplate.baseSpecies) return false;
			return true;
		},
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy * 0.9;
		},
	},
};