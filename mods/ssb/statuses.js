'use strict';

exports.BattleStatuses = {
    distortion: {
		effectType: 'Ability',
		onStartPriority: -10,
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Distortion');
	        this.useMove('Topsy-Turvy', pokemon);
	    },
	},
    easiestswitch: {
		effectType: 'Ability',
		onStart: function (pokemon, source) {
			this.useMove('Aqua Ring', pokemon);
		},
		onTryHit: function (pokemon, target, move, source) {
			if (pokemon.newlySwitched && move.type === 'Grass' && target !== source) {
				this.heal(pokemon.maxhp); 
			}
		},
    },
};