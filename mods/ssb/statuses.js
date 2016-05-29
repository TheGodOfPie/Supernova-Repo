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
		onHit: function (pokemon, target, move) {
			if (target.newlySwitched && move.type === 'Grass') {
				this.heal(target.maxhp); 
			}
		},
    },
};