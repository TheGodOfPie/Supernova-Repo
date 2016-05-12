/**
 *
 * Customtitle.js Made By Dragotic.
 *
 */

'use strict';

global.hasTitle = function (user) {
	if (!user) return;
	let targetUser = Db('titles').get(toId(user));
	if (targetUser === 1) return true;
	return false;
};

exports.commands = {
	settitle: 'customtitle',
	customtitle: {
		give: function (target, room, user) {
			if (!this.can('eval')) return false;
			if (!target) return this.parse('/help customtitle');
            let params = target.split(',');
			let targetUser = toId(params[0]);
            let title = params[1];
            let color = params[2];
            if (!targetUser || !title || !color) return this.parse('/help customtitle');
			Db('titles')
            .set([targetUser, 'Title'], title),
            .set([targetUser, 'Color'], color);
			this.sendReply(targetUser + ' has received a custom title.');
		},
        /*
		take: function (target, room, user) {
			if (!this.can('eval')) return false;
			let devUser = toId(target);
			if (!this) return this.parse('/help dev');
			if (!isDev(this)) return this.errorReply(this + ' is not a developer.');
			Db('devs').delete(this);
			this.sendReply(this + '\'s developer status has been taken.');
		},
		list: function (target, room, user) {
			if (!this.can('eval')) return false;
			if (!Object.keys(Db('devs').object()).length) return this.errorReply('There seems to be no user with dev status.');
			this.sendReplyBox('<center><b><u>Developers</u></b></center>' + '<br /><br />' + Object.keys(Db('devs').object()).join('<br />'));
		},
        */
	},
};