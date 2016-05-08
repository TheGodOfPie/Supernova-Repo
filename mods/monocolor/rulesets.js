'use strict';

exports.BattleFormats = {
    // Same Color Clause For The Tier Monocolor.
    samecolorclause: {
        effectType: 'Rule',
        onStart: function () {
            this.add('rule', 'Same Color Clause: Pokémon in a team must share a color.');
        },
        onValidateTeam: function (team, format, teamHas) {
            if (!team[0]) return;
            let template = this.getTemplate(team[0].species);
            let teamColor = template.color;
            if (!teamColor) return ["Your team must share a color."];
            for (let i = 0; i < team.length; i++) {
                    let otherPokemonsTemplate = this.getTemplate(team[i].species);
                    if (otherPokemonsTemplate.color !== teamColor) return ["Your team must share a color."];
                    if (!otherPokemonsTemplate.color) return ["Your team must share a color."];
            }
            switch (teamColor) {
                case 'Blue':
                    if (teamHas['greninja']) {
                        for (let v = 0; v < team.length; v++) {
                            if (toId(team[v].species) === 'greninja' && toId(team[v].ability) === 'protean') {
                                return ["Greninja can't have that ability."];
                            }
                        }
                    }
                    break;
                case 'Red':
                    if (teamHas['blaziken']) {
                        for (let j = 0; j < team.length; j++) {
                            if (toId(team[j].species) === 'blaziken' && toId(team[j].ability) === 'speedboost') {
                                return ["Blaziken can't have that ability."];
                            }
                        }
                    }
                    break;
            }
        }
    },
};