'use strict';

exports.BattleItems = {
		//&TheGodOfPie
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
		//@Supernova Robot
			"supernovastone": {
				id: "supernovastone",
				name: "Supernova Stone",
				megaStone: "Palkia",
				megaEvolves: "Nidoran-M",
				onTakeItem: function (item, source) {
					if (item.megaEvolves === source.baseTemplate.baseSpecies) return false;
					return true;
				},
				desc: "If holder is Supernova Robot, this item allows it to Evolve in battle."
			},
    	//+CLawliet
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
		//+Camilas
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
		//DarkChaoticFlare
			"prioritygloves": {
				id: "prioritygloves",
				name: "#PriorityGloves",
				onModifyPriority: function (priority, pokemon) {
					return priority + 1;
				},
				desc: "Holder's moves have a +1 Priority"
			},
};