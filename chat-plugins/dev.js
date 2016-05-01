/**
 *
 * Dev.js Made By Dragotic.
 *
 */

'use strict';

global.isDev= function (user) {
	if (!user) return;
	let dev = Db('devs').get(toId(user));
	if (dev === 1) return true;
	return false;
};

exports.commands = {
	developer: 'dev',
	dev: {
		give: function (target, room, user) {
			if (!this.can('eval')) return false;
			let devUser = toId(target);
			if (!devUser) return this.parse('/help dev');
			if (isDev(devUser)) return this.errorReply(this + ' is already a developer.');
			Db('devs').set(devUser, 1);
			this.sendReply(devUser + ' has been granted with developer status.');
		},
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
	},
};