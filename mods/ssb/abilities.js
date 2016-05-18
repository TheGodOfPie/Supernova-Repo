'use strict';

exports.BattleAbilities = {
        //Admins
        //Leaders
                //&Kie
                "piercingcyclone": {
                        shortDesc: "Primordial Sea + Swift Swim",
                        onStart: function (source) {
			        this.setWeather('primordialsea');
		},
		        onAnySetWeather: function (target, source, weather) {
			        if (this.getWeather().id === 'primordialsea' && !(weather.id in {desolateland:1, primordialsea:1, deltastream:1})) return false;
		},
		        onEnd: function (pokemon) {
			        if (this.weatherData.source !== pokemon) return;
			        for (var i = 0; i < this.sides.length; i++) {
				        for (var j = 0; j < this.sides[i].active.length; j++) {
					        var target = this.sides[i].active[j];
					        if (target === pokemon) continue;
					        if (target && target.hp && target.hasAbility('primordialsea')) {
						        this.weatherData.source = target;
						        return;
					}
				}
			}
			this.clearWeather();
                },
                        onModifySpe: function (spe, pokemon) {
			        if (this.isWeather(['raindance', 'primordialsea'])) {
				        return this.chainModify(1.5);
			        }
		},
			id: "piercingcyclone",
	        	name: "Piercing Cyclone",
	        },
        //Moderators
                //@Supernova Robot
                "galacticclash": {
	        	shortDesc: "Pokemon making contact against this Pokemon lose 3 stages of their Speed stat.",
	        	onAfterDamageOrder: 1,
	        	onAfterDamage: function (damage, target, source, move) {
                                if (source && source !== target && move && move.type !== 'Dragon') {
                                        this.add('-ability', target, 'Galactic Clash');
                                        this.damage(source.maxhp / 10, source, target, null, true);
                                }
                                if (target !== source && move.type === 'Dragon' && move) {
                                        this.add('-ability', target, 'Galactic Clash');
                                        this.damage(source.maxhp / 2, source, target, null, true);
                                }
                        },
	        	id: "galacticclash",
	        	name: "Galactic Clash",
	        },
	        //@TheGodOfPie
                "mysticblades": {
                        shortDesc: "Inverts the opponent\'s stat changes upon entry.",
                        onAfterDamageOrder: 1,
	               	onAfterDamage: function (damage, target, source, move, pokemon) {
		        	if (source && source !== target && move && move.flags['contact']) {
			        	this.add('-ability', target, 'Mystic Blades');
			        	this.damage(source.maxhp / 8, source, target, null, true);
			        }
	        	},
                        id: "mysticblades",
                        name: "Mystic Blades",
                },
                
        //Drivers
                
        //Operators
                
        //Voices
                //+Camilas
                "plsban": {
                        shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage halved. This Pokemon's Attack stat is doubled during battle.",
                        onModifyAtkPriority: 5,
		        onModifyAtk: function (atk) {
		        	return this.chainModify(2);
		        },
		        onPrepareHit: function (source, target, move) {
			        if (move.id in {iceball: 1, rollout: 1}) return;
			        if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit) {
			                move.multihit = 2;
			        	source.addVolatile('parentalbond');
			        }
        		},
        		effect: {
        			duration: 1,
        			onBasePowerPriority: 8,
        			onBasePower: function (basePower) {
        				if (this.effectData.hit) {
        					return this.chainModify(0.5);
        				} else {
        					this.effectData.hit = true;
        				}
        			}
        		},
                        id: "plsban",
                        name: "Pls Ban",
                },
                //+CLawliet
                "multipower": {
                        shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved. This Pokemon's Attack stat is doubled during battle.",
                        onModifyAtkPriority: 5,
		        onModifyAtk: function (atk) {
		        	return this.chainModify(1.5);
		        },
                        id: "multipower",
                        name: "Multipower",
                },
                //+Dayuh
                "aromaboost": {
                        shortDesc: "Adaptability & +1 Speed upon entry.",
                        onModifyMove: function (move) {
		        	move.stab = 2;
                        },
                        onStart: function (pokemon) {
                                this.boost({spe: 1});
                        },
                },
        // Regulars
                //Ransei
                "wonderbarrier": {
                        shortDesc: "This Pokemon can only be damaged by super-effective attacks and indirect damage, can hit Ghost-types using Normal-typed moves, and +6 to all stats upon entry",
                        onStart: function (pokemon) {
                                this.boost({evasion:6, spa:6, spe:6, atk:6, def:6, spd:6, accuracy:6});
                        },
                        onModifyMovePriority: -5,
	        	onModifyMove: function (move) {
	        		if (!move.ignoreImmunity) move.ignoreImmunity = {};
	        		if (move.ignoreImmunity !== true) {
	        			move.ignoreImmunity['Fighting'] = true;
	        			move.ignoreImmunity['Normal'] = true;
	        		}
	        	},
	        	onTryHit: function (target, source, move) {
	        		if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle' || move.isFutureMove) return;
	        		this.debug('Wonder Barrier immunity: ' + move.id);
	        		if (target.runEffectiveness(move) <= 0) {
	        			this.add('-activate', target, 'ability: Wonder Barrier');
	        			this.add('-immune', target, '[msg]');
	        			return null;
	        		}
	        	},
                         id: "wonderbarrier",
                        name: "Wonder Barrier",
                },
                //Back At My Day...
                "timetraveller": {
                        onModifyMove: function (move) {
		        	move.infiltrates = true;
		        },
		        onStart: function (pokemon) {
                                this.boost({spe:-2});
                                this.useMove('trickroom', pokemon);
                        },
                        id: "timetraveller",
                        name: "Time Traveller"
                },
                //Dragotic
                "ascent": {
                        shortDesc: "This Pokemon has its Dragon-type move\'s power doubled, and is immune to Fairy-type moves.",
                        onTryHit: function (target, source, move) {
                                if (target !== source && move.type === 'Fairy') {
                                        this.add('-activate', target, 'ability: Ascent');
                                        this.add('-immune', target, '[msg]');
                                        return null;
                                }
                        },
                        onModifyAtkPriority: 5,
                        onModifyAtk: function (atk, attacker, defender, move) {
                                if (move.type === 'Dragon') {
                                        return this.chainModify(1.5);
                                }
                        },
                        id: "ascent",
                        name: "Ascent",
                },
                //Volco
                "letsdothis": {
                        shortDesc: "Magic Guard + +2 Atk & Spe upon entry + ",
                        onStart: function (pokemon) {
                                this.boost({atk: 1, spe: 1});
                        },
                        onDamage: function (damage, target, source, effect) {
                                if (effect.effectType !== 'Move') {
                                return false;
                            }
                        },
                        id: "letsdothis",
                        name: "Let's Do This",
                },
};
