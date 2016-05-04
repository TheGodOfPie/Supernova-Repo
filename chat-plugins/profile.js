

'use strict';

const geoip = require('geoip-ultralight');
let color = require('../config/color');
let moment = require('moment');

let BR = '<br>';
let SPACE = '&nbsp;';
let profileColor = '#24678d';
let trainersprites = [1, 2, 101, 102, 169, 170, 265, 266, 168];

/**
 * Profile constructor.
 *
 * @param {Boolean} isOnline
 * @param {Object|String} user - if isOnline then Object else String
 * @param {String} image
 */
function Profile(isOnline, user, image) {
	this.isOnline = isOnline || false;
	this.user = user || null;
	this.image = image;

	this.username = Tools.escapeHTML(this.isOnline ? this.user.name : this.user);
	this.url = Config.avatarurl || '';
}

/**
 * Create an bold html tag element.
 *
 * Example:
 * createFont('Hello World!');
 * => '<b>Hello World!</b>'
 *
 * @param {String} color
 * @param {String} text
 * @return {String}
 */
function bold(text) {
	return '<b>' + text + '</b>';
}

/**
 * Create an font html tag element.
 *
 * Example:
 * createFont('Hello World!', 'blue');
 * => '<font color="blue">Hello World!</font>'
 *
 * @param {String} color
 * @param {String} text
 * @return {String}
 */
function font(color, text) {
	return '<font color="' + color + '">' + text + '</font>';
}

/**
 * Create an img tag element.
 *
 * Example:
 * createImg('phil.png');
 * => '<img src="phil.png" height="80" width="80" align="left">'
 *
 * @param {String} link
 * @return {String}
 */
function img(link) {
	return '<img src="' + link + '" height="80" width="80">';
}

/**
 * Create a font html element wrap around by a bold html element.
 * Uses to `profileColor` as a color.
 * Adds a colon at the end of the text and a SPACE at the end of the element.
 *
 * Example:
 * label('Name');
 * => '<b><font color="#24678d">Name:</font></b> '
 *
 * @param {String} text
 * @return {String}
 */
function label(text) {
	return bold(font(profileColor, text + ':')) + SPACE;
}

function currencyName(amount) {
	let name = " buck";
	return amount === 1 ? name : name + "s";
}

Profile.prototype.avatar = function () {
	if (this.isOnline) {
		if (typeof this.image === 'string') return img(this.url + ':' + Config.port + '/avatars/' + this.image);
		return img('http://play.pokemonshowdown.com/sprites/trainers/' + this.image + '.png');
	}
	for (let name in Config.customAvatars) {
		if (this.username === name) {
			return img(this.url + ':' + Config.port + '/avatars/' + Config.customAvatars[name]);
		}
	}
	let selectedSprite = trainersprites[Math.floor(Math.random() * trainersprites.length)];
	return img('http://play.pokemonshowdown.com/sprites/trainers/' + selectedSprite + '.png');
};

Profile.prototype.buttonAvatar = function () {
	let css = 'border:none;background:none;padding:0;float:left;';
	return '<div class="infoboxy-supernova"><button style="' + css + '" name="parseCommand" value="/user ' + this.username + '">' + this.avatar() + "</button>";
};

Profile.prototype.group = function () {
	if (this.isOnline && this.user.group === ' ') return label('Group') + 'Regular User';
	if (this.isOnline) return label('Group') + Config.groups[this.user.group].name;
	for (let name in Users.usergroups) {
		if (toId(this.username) === name) {
			return label('Group') + Config.groups[Users.usergroups[name].charAt(0)].name;
		}
	}
	return label('Group') + 'Regular User';
};

Profile.prototype.money = function (amount) {
	return label('Money') + amount + currencyName(amount);
};

Profile.prototype.name = function () {
	return label('Name') + bold(font(color(toId(this.username)), this.username));
};


Profile.prototype.seen = function (timeAgo) {
	if (this.isOnline) return label('Last Seen') + font('#2ECC40', 'Currently Online');
	if (!timeAgo) return label('Last Seen') + 'Never';
	return label('Last Seen') + moment(timeAgo).fromNow();
};

Profile.prototype.dev = function (user) {
	if (isDev(user)) return font('#800042', '(<b>Supernova Dev</b>)');
	return '';
};

Profile.prototype.vip = function (user) {
	if (isVip(user)) return font('#6390F0', '(<b>VIP User</b>)');
	return '';
};

Profile.prototype.title = function (user) { 
	// Check if the user has title or not first
	if (Db('title').has(user)) return ('(<b><i>' + Db('title').get(user) + '</i></b>)');
	return '';
};

Profile.prototype.flag = function (user) {
	if (Users(user)) {
		let userFlag = geoip.lookupCountry(Users(user).latestIp);
		if (userFlag) {
			return '<img src="https://github.com/kevogod/cachechu/blob/master/flags/' + userFlag.toLowerCase() + '.png?raw=true" height=10 title="' + userFlag + '">';
		}
	}
	return '';
};

Profile.prototype.show = function (callback) {
	let userid = toId(this.username);

	return this.buttonAvatar() +
		SPACE + this.name() + SPACE + this.flag(userid) + SPACE + this.title(userid) + BR +
		SPACE + this.group() + SPACE + this.vip(userid) + SPACE + this.dev(userid) + BR +
		SPACE + this.money(Db('money').get(userid, 0)) + BR +
		SPACE + this.seen(Db('seen').get(userid)) +
		'<br clear="all"></div>';
};

exports.commands = {
	profile: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (target.length >= 19) return this.sendReply("Usernames are required to be less than 19 characters long.");
		let targetUser = this.targetUserOrSelf(target);
		let profile;
		if (!targetUser) {
			profile = new Profile(false, target);
		} else {
			profile = new Profile(true, targetUser, targetUser.avatar);
		}
		this.sendReplyBox(profile.show());
	},
	profilehelp: ["/profile -	Shows information regarding user's name, group, money, and when they were last seen."],

	customtitle: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help customtitle');

		let parts = target.split(',');
		let username = toId(parts[0]);
		let title = parts.slice(1).join(", ").trim();

		Db('title').set(username, title);
		
		this.sendReply(username + " was given " + title + ". ");
		if (Users.get(username)) Users(username).popup(user.name + " has given you the title: " + title);
		
	},
	customtitlehelp: ["/customtitle [user], [title] - Sets a title to a user that will be displayed in their profile."],
};
