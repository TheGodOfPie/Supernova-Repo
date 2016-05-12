/**
 *
 * Customtitle.js Made By Dragotic.
 *
 */

'use strict';

exports.commands = {
	settitle: 'customtitle',
	customtitle: {
		set: 'give',
		give: function (target, room, user) {
			if (!this.can('eval')) return false;
			if (!target) return this.parse('/help customtitle');
            let params = target.split(',');
			let targetUser = toId(params[0]);
            let title = params[1];
            let color = params[2];
            if (!targetUser || !title || !color) return this.parse('/help customtitle');
			Db('titles')
            .set([targetUser, 'Title'], title)
            .set([targetUser, 'Color'], color);
			this.sendReply(targetUser + ' has received a custom title.');
		},
		remove: 'take',
		take: function (target, room, user) {
			if (!this.can('eval')) return false;
			let targetUser = toId(target);
			if (!targetUser) return this.parse('/help customtitle');
			if (!Db('titles').has(targetUser)) return this.errorReply(targetUser + 'does not have a custom title.');
			Db('titles').delete(targetUser);
			this.sendReply(targetUser + '\'s custom title has been removed.');
		},
		list: function (target, room, user) {
			if (!this.can('eval')) return false;
			if (!Object.keys(Db('titles').object()).length) return this.errorReply('There seems to be no user with custom title.');
			this.sendReplyBox('<center><b><u>Custom Titles</u></b></center>' + '<br /><br />' + Object.keys(Db('titles').object()).join('<br />'));
		},
	},
};