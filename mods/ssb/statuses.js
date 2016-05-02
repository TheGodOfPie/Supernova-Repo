'use strict';

exports.BattleStatuses = {
	//@TheGodOfPie
    distortion: {
		effectType: 'Ability',
		onStartPriority: -10,
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Distortion');
	        this.useMove('Topsy-Turvy', pokemon);
	    },
	},
	//@Supernova Robot
    autowarn: {
		effectType: 'Ability',
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', target, 'Auto-warn');
			this.add('-message', source.name + " was warned by Supernova Robot. (Automated moderation: Hitting a Robot)");
			this.boost({spe: -3}, source, source);
			}
		},
    },
};