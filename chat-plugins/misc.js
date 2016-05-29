/**
 * Supernova Commands
 */

'use strict';

const MAX_REASON_LENGTH = 300;
let moment = require('moment');
let request = require('request');
let color = require('../config/color');
let fs = require('fs');
let Ladders;
try {
	Ladders = require('../ladders.js');
} catch (err) {
	Ladders = require('./ladders.js');
}
var tourLadder = Ladders('tournaments');
let confirmDeleteElo = false;
var confirm = false;
let poofoff = false;
let poofs;
const FILE_NAME = ('./config/poofs.json');
try {
	poofs = JSON.parse(fs.readFileSync(FILE_NAME));
} catch (e) {
    let list = ['used Explosion!', 'is blasting off again!', 'peered through the hole on Shedinja\'s back!', 'was smitten by Siiilver\'s mighty sword!', 
		'leaves the server', 'forgot to pray to Lord Helix and is now paying the price!', 'was attacked by the closet monster!',
		'vanished instantly!', 'used Final Gambit and missed!', 'A large spider descended from the sky and picked up (user)!', 'likes trains :D'
	].map(function (msg) {
		if (!msg.match(/\(user\)/)) return '(user) ' + msg;
	});
	fs.writeFileSync(FILE_NAME, JSON.stringify(list, null, 1));
	poofs = JSON.parse(fs.readFileSync(FILE_NAME));
}
const fileName = "randpokedex.js";
var selectors;

function display (message, self) {
	if (self.broadcasting) return self.sendReplyBox(message);
	return self.popupReply('|html|' + message);
	
}

function clearRoom(room) {
	let len = (room.log && room.log.length) || 0;
	let users = [];
	while (len--) {
		room.log[len] = '';
	}
	for (let u in room.users) {
		users.push(u);
		Users.get(u).leaveRoom(room, Users.get(u).connections[0]);
	}
	len = users.length;
	setTimeout(function () {
		while (len--) {
			Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
		}
	}, 1000);
}

function randomColor () {
	var colors = ['9900f2', '4ca2ff', '4cff55', 'e87f00', 'd30007', '8e8080', 'd8b00d', '01776a', '0c4787', '0c870e', '8e892c',
		'5b5931', '660c60', '9e5a99', 'c43873', '39bf39', '7c5cd6', '76d65c', '38c9c9', '2300af', '1daf00'
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

exports.commands = {

	stafflist: 'authority',
	auth: 'authority',
	authlist: 'authority',
	authority: function (target, room, user, connection) {
		let rankLists = {};
		let ranks = Object.keys(Config.groups);
		for (let u in Users.usergroups) {
			let rank = Users.usergroups[u].charAt(0);
			// In case the usergroups.csv file is not proper, we check for the server ranks.
			if (ranks.indexOf(rank) > -1) {
				let name = Users.usergroups[u].substr(1);
				if (!rankLists[rank]) rankLists[rank] = [];
				if (name) rankLists[rank].push(((Users.getExact(name) && Users.getExact(name).connected) ? '**' + name + '**' : name));
			}
		}

		let buffer = [];
		Object.keys(rankLists).sort(function (a, b) {
			return (Config.groups[b] || {rank: 0}).rank - (Config.groups[a] || {rank: 0}).rank;
		}).forEach(function (r) {
			buffer.push((Config.groups[r] ? r + Config.groups[r].name + "s (" + rankLists[r].length + ")" : r) + ":\n" + rankLists[r].sort().join(", "));
		});

		if (!buffer.length) {
			return connection.popup("This server has no auth.");
		}
		connection.popup(buffer.join("\n\n"));	},
	clearroomauth: function (target, room, user, cmd) {
		if (!this.can('hotpatch') && room.founder !== user.userid) return this.errorReply("Access Denied");
		if (!room.auth) return this.errorReply("Room does not have roomauth.");
		var parts = target.split(',');
		var cmd = parts[0].trim().toLowerCase();
		if (!target) {
			this.errorReply("You must specify a roomauth group you want to clear.");
			return;
		}
		switch (target) {

		case 'voice':
			var count = 0;
			for (var userid in room.auth) {
			if (room.auth[userid] === '+') {
				delete room.auth[userid];
				count++;
				if (userid in room.users) room.users[userid].updateIdentity(room.id);
			}
		}
			if (!count) {
				return this.sendReply("(This room has zero roomvoices)");
			}
			if (room.chatRoomData) {
				Rooms.global.writeChatRoomData();
			}
			this.addModCommand("All " + count + " roomvoices have been cleared by " + user.name + ".");
			break;
			
		case 'roomplayer':
			var count = 0;
			for (var userid in room.auth) {
			if (room.auth[userid] === '\u2605') {
				delete room.auth[userid];
				count++;
				if (userid in room.users) room.users[userid].updateIdentity(room.id);
			}
		}
			if (!count) {
			return this.sendReply("(This room has zero roomplayers)");
			}
			if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
			}
			this.addModCommand("All " + count + " roomplayers have been cleared by " + user.name + ".");
		    break;	
			
		case 'driver':
			var count = 0;
			for (var userid in room.auth) {
			if (room.auth[userid] === '%') {
				delete room.auth[userid];
				count++;
				if (userid in room.users) room.users[userid].updateIdentity(room.id);
			}
		}
			if (!count) {
			return this.sendReply("(This room has zero drivers)");
			}
			if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
			}
			this.addModCommand("All " + count + " drivers have been cleared by " + user.name + ".");
			break;

		case 'mod':
			var count = 0;
			for (var userid in room.auth) {
			if (room.auth[userid] === '@') {
				delete room.auth[userid];
				count++;
				if (userid in room.users) room.users[userid].updateIdentity(room.id);
			}
		}
			if (!count) {
			return this.sendReply("(This room has zero mods)");
			}
			if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
			}
			this.addModCommand("All " + count + " mods have been cleared by " + user.name + ".");
		    break;
	
			case 'roomowner':
			var count = 0;
			for (var userid in room.auth) {
			if (room.auth[userid] === '#') {
				delete room.auth[userid];
				count++;
				if (userid in room.users) room.users[userid].updateIdentity(room.id);
			}
		}
		if (!count) {
			return this.sendReply("(This room has zero roomowners)");
		}
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
			}
			this.addModCommand("All " + count + " roomowners have been cleared by " + user.name + ".");
		    break; 

			case 'roomleader':
			var count = 0;
			for (var userid in room.auth) {
			if (room.auth[userid] === '&') {
				delete room.auth[userid];
				count++;
				if (userid in room.users) room.users[userid].updateIdentity(room.id);
			}
		}
		if (!count) {
			return this.sendReply("(This room has zero roomowners)");
		}
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
			}
			this.addModCommand("All " + count + " roomleaders have been cleared by " + user.name + ".");
		    break; 
		
		default:
			return this.sendReply("The group specified does not exist.");
		}
	},

	clearall: function (target, room, user) {
		if (!this.can('declare')  && !this.can('dev')) return false;
		if (room.battle) return this.sendReply("You cannot clearall in battle rooms.");

		clearRoom(room);

	},

	easytour: 'etour',
	elimtour: 'etour',
	etour: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return;
		this.parse('/tour new ' + target + ', elimination');
	},

	roundrobintour: 'rtour',
	cancertour: 'rtour',
	rtour: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return;
		this.parse('/tour new ' + target + ', roundrobin');

    },

	roompm: function (target, room, user) {
		if (!this.can('roommod', null, room)) return false;
		if (!target) return this.parse('/help roompm');

		let pmName = ' Room PM [Do not reply]';

		for (var i in room.users) {
			var message = '|pm|' + pmName + '|' + room.users[i].getIdentity() + '|' + target;
			room.users[i].send(message);
		}
	},
	roompmhelp: ["/roompm [message] - PM all users in the room."],
	
	gclearall: 'globalclearall',
	globalclearall: function (target, room, user) {
		if (!this.can('gdeclare')  && !this.can('dev')) return false;

		for (let u in Users.users) {
			Users.users[u].popup("All rooms are being clear.");
		}

		for (let r in Rooms.rooms) {
			clearRoom(Rooms.rooms[r]);
		}

    },

	restart: function(target, room, user) {
		if (!this.can('lockdown')) return false;
		try {
			var forever = require('forever');
		} catch (e) {
			return this.sendReply("/restart requires the \"forever\" module.");
		}
		if (!Rooms.global.lockdown) {
			return this.sendReply("For safety reasons, /restart can only be used during lockdown.");
		}
		if (CommandParser.updateServerLock) {
			return this.sendReply("Wait for /updateserver to finish before using /restart.");
		}
		this.logModCommand(user.name + ' used /restart');
		Rooms.global.send('|refresh|');
		forever.restart('app.js');
    },
    hide: 'hideauth',
    hideauth: function(target, room, user) {
        if (!user.can('lock')) return this.sendReply("/hideauth - access denied.");
        var tar = ' ';
        if (target) {
            target = target.trim();
            if (Config.groupsranking.indexOf(target) > -1 && target != '#') {
                if (Config.groupsranking.indexOf(target) <= Config.groupsranking.indexOf(user.group)) {
                    tar = target;
                } else {
                    this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
                }
            } else {
                this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
            }
        }
        user.getIdentity = function (roomid) {
            if (this.locked) {
                return '‽' + this.name;
            }
            if (roomid) {
                var room = Rooms.rooms[roomid];
                if (room.isMuted(this)) {
                    return '!' + this.name;
                }
                if (room && room.auth) {
                    if (room.auth[this.userid]) {
                        return room.auth[this.userid] + this.name;
                    }
                    if (room.isPrivate === true) return ' ' + this.name;
                }
            }
            return tar + this.name;
        }
        user.updateIdentity();
        this.sendReply('You are now hiding your auth symbol as \'' + tar + '\'.');
        this.logModCommand(user.name + ' is hiding auth symbol as \'' + tar + '\'');
    },
    show: 'showauth',
    showauth: function(target, room, user) {
        if (!user.can('lock')) return this.sendReply("/showauth - access denied.");
        delete user.getIdentity;
        user.updateIdentity();
        this.sendReply("You have now revealed your auth symbol.");
        return this.logModCommand(user.name + " has revealed their auth symbol.");
        this.sendReply("Your symbol has been reset.");
    },

	rk: 'kick',
	roomkick: 'kick',
	kick: function (target, room, user) {
		if (!target) return this.parse('/help kick');
		if (!this.canTalk() && !user.can('bypassall')) {
			return this.sendReply("You cannot do this while unable to talk.");
		}

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply("User \"" + this.targetUsername + "\" not found.");
		if (!this.can('mute', targetUser, room)  && !this.can('dev')) return false;

		this.addModCommand(targetUser.name + " was kicked from the room by " + user.name + ".");
		targetUser.popup("You were kicked from " + room.id + " by " + user.name + ".");
		targetUser.leaveRoom(room.id);
	},
	kickhelp: ["/kick - Kick a user out of a room. Requires: % @ # & ~"],

	masspm: 'pmall',
	pmall: function (target, room, user) {
		if (!this.can('pmall')  && !this.can('dev')) return false;
		if (!target) return this.parse('/help pmall');

		let pmName = ' Server PM [Do not reply]';

		Users.users.forEach(function (user) {
			let message = '|pm|' + pmName + '|' + user.getIdentity() + '|' + target;
			user.send(message);
		});
	},
	pmallhelp: ["/pmall [message] - PM all users in the server."],

	staffpm: 'pmallstaff',
	pmstaff: 'pmallstaff',
	pmallstaff: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target) return this.parse('/help pmallstaff');

		let pmName = ' Staff PM [Do not reply]';

		Users.users.forEach(function (user) {
			if (!user.isStaff) return;
			let message = '|pm|' + pmName + '|' + user.getIdentity() + '|' + target;
			user.send(message);
		});
	},
	pmallstaffhelp: ["/pmallstaff [message] - Sends a PM to every staff member online."],

	regdate: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target || !toId(target)) return this.parse('/help regdate');
		let username = toId(target);
		request('http://pokemonshowdown.com/users/' + username, function (error, response, body) {
			if (error && response.statusCode !== 200) {
				this.sendReplyBox(Tools.escapeHTML(target) + " is not registered.");
				return room.update();
			}
			let regdate = body.split('<small>')[1].split('</small>')[0].replace(/(<em>|<\/em>)/g, '');
			if (regdate === '(Unregistered)') {
				this.sendReplyBox(Tools.escapeHTML(target) + " is not registered.");
			} else if (regdate === '(Account disabled)') {
				this.sendReplyBox(Tools.escapeHTML(target) + "'s account is disabled.");
			} else {
				this.sendReplyBox(Tools.escapeHTML(target) + " was registered on " + regdate.slice(7) + ".");
			}
			room.update();
		}.bind(this));
	},
	regdatehelp: ["/regdate - Please specify a valid username."],

	sb: 'showdownboilerplate',
	showdownboilerplate: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReply("|raw|This server uses <a href='https://github.com/CreaturePhil/Showdown-Boilerplate'>Showdown-Boilerplate</a>.");
	},
	showdownboilerplatehelp: ["/showdownboilerplate - Links to the Showdown-Boilerplate repository on Github."],

	seen: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help seen');
		let targetUser = Users.get(target);
		if (targetUser && targetUser.connected) return this.sendReplyBox(targetUser.name + " is <b>currently online</b>.");
		target = Tools.escapeHTML(target);
		let seen = Db('seen').get(toId(target));
		if (!seen) return this.sendReplyBox(target + " has never been online on this server.");
		this.sendReplyBox(target + " was last seen <b>" + moment(seen).fromNow() + "</b>.");
	},
	seenhelp: ["/seen - Shows when the user last connected on the server."],

	tell: function (target, room, user, connection) {
		if (!target) return this.parse('/help tell');
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!target) {
			this.sendReply("You forgot the comma.");
			return this.parse('/help tell');
		}

		if (targetUser && targetUser.connected) {
			return this.parse('/pm ' + this.targetUsername + ', ' + target);
		}

		if (user.locked) return this.popupReply("You may not send offline messages when locked.");
		if (target.length > 255) return this.popupReply("Your message is too long to be sent as an offline message (>255 characters).");

		if (Config.tellrank === 'autoconfirmed' && !user.autoconfirmed) {
			return this.popupReply("You must be autoconfirmed to send an offline message.");
		} else if (!Config.tellrank || Config.groupsranking.indexOf(user.group) < Config.groupsranking.indexOf(Config.tellrank)) {
			return this.popupReply("You cannot send an offline message because offline messaging is " +
				(!Config.tellrank ? "disabled" : "only available to users of rank " + Config.tellrank + " and above") + ".");
		}

		let userid = toId(this.targetUsername);
		if (userid.length > 18) return this.popupReply("\"" + this.targetUsername + "\" is not a legal username.");

		let sendSuccess = Tells.addTell(user, userid, target);
		if (!sendSuccess) {
			if (sendSuccess === false) {
				return this.popupReply("User " + this.targetUsername + " has too many offline messages queued.");
			} else {
				return this.popupReply("You have too many outgoing offline messages queued. Please wait until some have been received or have expired.");
			}
		}
		return connection.send('|pm|' + user.getIdentity() + '|' +
			(targetUser ? targetUser.getIdentity() : ' ' + this.targetUsername) +
			"|/text This user is currently offline. Your message will be delivered when they are next online.");
	},

    roomfounder: function (target, room, user) {
        if (!room.chatRoomData) return this.errorReply("/roomfounder - This room isn\'t designed for per-room moderation to be added.");
        target = this.splitTarget(target, true);

        let targetUser = this.targetUser;

        if (!targetUser)    return this.errorReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('makeroom'))  return false;
        if (!room.auth) room.auth = room.chatRoomData.auth = {};

        let name = targetUser.name;
        let needsPopup = targetUser && room.users[targetUser.userid] && !room.isPrivate && !room.isPersonal && !room.battle;

        room.auth[targetUser.userid] = '#';
        room.founder = targetUser.userid;

        this.addModCommand(name + ' was appointed to Room Founder by ' + user.name + ' in ' + room.title + '.');
        if (needsPopup) targetUser.popup('You were appointed to Room Founder by ' + user.name + ' in ' + room.title + '.');

        room.onUpdateIdentity(targetUser);
        room.chatRoomData.founder = room.founder;
        Rooms.global.writeChatRoomData();
                },

    roomdefounder: 'deroomfounder',
    deroomfounder: function (target, room, user) {
        if (!room.auth) return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
        target = this.splitTarget(target, true);

        let targetUser = this.targetUser;
        let name = this.targetUsername;
        let userid = toId(name);
        let needsPopup = targetUser && room.users[targetUser.userid] && !room.isPrivate && !room.isPersonal && !room.battle;

        if (!userid || userid === '') return this.errorReply("User '" + name + "' does not exist.");

        if (room.auth[userid] !== '#') return this.errorReply("User '" + name + "' is not a room founder.");
        if (!this.can('makeroom', null, room)) return false;

        delete room.auth[userid];
        delete room.founder;

        this.sendReply('(' + name + ' is no longer Room Founder in ' + room.title + '.' + ')');
        targetUser.send('(You are no longer Room Founder in ' + room.title + '.' + ')');
        if (needsPopup) targetUser.popup('You are no longer Room Founder in ' + room.title + '.');
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
        }

	},
	roomlist: function (target, room, user) {
		if(!this.can('makechatroom')) return;
		var totalUsers = 0; 
		for (var u of Users.users) {
			u = u[1];
			if (Users(u).connected) {
				totalUsers++;
			}
		}
		var rooms = Object.keys(Rooms.rooms),
		len = rooms.length,
		header = ['<b><font color="#DA9D01" size="2">Total users connected: ' + totalUsers + '</font></b><br />'],
		official = ['<b><font color="#1a5e00" size="2">Official chat rooms:</font></b><br />'],
		nonOfficial = ['<hr><b><font color="#000b5e" size="2">Public chat rooms:</font></b><br />'],
		privateRoom = ['<hr><b><font color="#ff5cb6" size="2">Private chat rooms:</font></b><br />'],
		groupChats = ['<hr><b><font color="#740B53" size="2">Group Chats:</font></b><br />'],
		battleRooms = ['<hr><b><font color="#0191C6" size="2">Battle Rooms:</font></b><br />'];
	 
		while (len--) {
			var _room = Rooms.rooms[rooms[(rooms.length - len) - 1]];
			if (_room.type === 'battle') {
				battleRooms.push('<a href="/' + _room.id + '" class="ilink">' + _room.title + '</a> (' + _room.userCount + ')');
			}
			if (_room.type === 'chat') {
					if (_room.isPersonal) {
						groupChats.push('<a href="/' + _room.id + '" class="ilink">' + _room.id + '</a> (' + _room.userCount + ')');
						continue;
					}
					if (_room.isOfficial) {
						official.push('<a href="/' + toId(_room.title) + '" class="ilink">' + _room.title + '</a> (' + _room.userCount + ')');
						continue;
					}
					if (_room.isPrivate) {
						privateRoom.push('<a href="/' + toId(_room.title) + '" class="ilink">' + _room.title + '</a> (' + _room.userCount + ')');
						continue;
					}
			}
			if (_room.type !== 'battle' && _room.id !== 'global') nonOfficial.push('<a href="/' + toId(_room.title) + '" class="ilink">' + _room.title + '</a> (' + _room.userCount + ')');
		}
		this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' ') + (groupChats.length > 1 ? groupChats.join(' ') : '') + (battleRooms.length > 1 ? battleRooms.join(' ') : ''));
    },
	randp: function (target, room, user) {
		if (!this.runBroadcast()) return;
		var shinyPoke = '';
		var x = '';
		if (/shiny/i.test(target)) {
			var shinyPoke = '-shiny';
		}
		var kanto = false; var johto = false; var hoenn = false; var sinnoh = false; var kalos = false; var unova = false;
		if (/kanto/i.test(target) || /gen 1/i.test(target)) {
			var kalos = true;
			var x = Math.floor(Math.random() * (174 - 1)) + 1;
		} else if (/johto/i.test(target) || /gen 2/i.test(target)) {
			var johto = true;
			var x = Math.floor(Math.random() * (281 - 173)) + 173;
		} else if (/hoenn/i.test(target) || /gen 3/i.test(target)) {
			var hoenn = true;
			var x = Math.floor(Math.random() * (444 - 280)) + 280;
		} else if (/sinnoh/i.test(target) || /gen 4/i.test(target)) {
			var sinnoh = true;
			var x = Math.floor(Math.random() * (584 - 443)) + 443;
		} else if (/kalos/i.test(target) || /gen 5/i.test(target)) {
			var kalos = true;
			var x = Math.floor(Math.random() * (755 - 583)) + 583;
		} else if (/unova/i.test(target) || /gen 6/i.test(target)) {
			var unova = true;
			var x = Math.floor(Math.random() * (834 - 752)) + 752;
		}
		if (kanto === false && johto === false && hoenn === false && sinnoh === false && kalos === false && unova === false) {
			var x = Math.floor(Math.random() * (856 - 1)) + 1;
		}
		var randP = '';
		var pokeNum = parseInt(x);
		var pokedex = fs.readFileSync('./data/randpokedex.js').toString().split("\n");
		var pokemon = (pokedex[x]);
		var speciesIndex1 = pokemon.indexOf('species:"') + 9; var speciesIndex2 = pokemon.indexOf('",', speciesIndex1);
		var pokeName = pokemon.slice(speciesIndex1, speciesIndex2);
		var type1Index1 = pokemon.indexOf(',types:["') + 9; var type1Index2 = pokemon.indexOf('"],', type1Index1);
		var pokeType2 = '';
		if (/,/.test(pokemon.slice(type1Index1, type1Index2))) {
			var type1Index2 = pokemon.indexOf('","', type1Index1);
			var type2Index1 = pokemon.indexOf('","', type1Index1) + 3; var type2Index2 = pokemon.indexOf('"],', type2Index1);
			var pokeType2 = '<img src="http://play.pokemonshowdown.com/sprites/types/' + pokemon.slice(type2Index1, type2Index2) + '.png" width="32" height="14">';
		}
		var pokeType1 = '<img src="http://play.pokemonshowdown.com/sprites/types/' + pokemon.slice(type1Index1, type1Index2) + '.png" width="32" height="14">';
		var ability1Index1 = pokemon.indexOf(',abilities:{0:"') + 15; var ability1Index2 = pokemon.indexOf('"},h', ability1Index1);
		var pokeAbility2 = '';
		var pokeAbility3 = '';
		if (/",/.test(pokemon.slice(ability1Index1, ability1Index2))) {
			if (/",H:"/.test(pokemon.slice(ability1Index1, ability1Index2))) {
				var ability1Index2 = pokemon.indexOf('",H:"', ability1Index1);
				var ability3Index1 = pokemon.indexOf('",H:"', ability1Index1) + 5; var ability3Index2 = pokemon.indexOf('"', ability3Index1);
				var pokeAbility3 = ', ' + pokemon.slice(ability3Index1, ability3Index2);
			}
			if (/",1:"/.test(pokemon.slice(ability1Index1, ability1Index2))) {
				var ability1Index2 = pokemon.indexOf('",1:"', ability1Index1);
				var ability2Index1 = pokemon.indexOf('",1:"', ability1Index1) + 5; var ability2Index2 = pokemon.indexOf('"', ability2Index1);
				var pokeAbility2 = ', ' + pokemon.slice(ability2Index1, ability2Index2);
			}
		}
		var ability1Index2 = pokemon.indexOf('"', ability1Index1);
		var pokeAbility1 = pokemon.slice(ability1Index1, ability1Index2);
		var hpIndex1 = pokemon.indexOf('hp:') + 3; var hpIndex2 = pokemon.indexOf(',', hpIndex1);
		var pokeHp = parseInt(pokemon.slice(hpIndex1, hpIndex2));
		var atkIndex1 = pokemon.indexOf('atk:') + 4; var atkIndex2 = pokemon.indexOf(',', atkIndex1);
		var pokeAtk = parseInt(pokemon.slice(atkIndex1, atkIndex2));
		var defIndex1 = pokemon.indexOf('def:') + 4; var defIndex2 = pokemon.indexOf(',', defIndex1);
		var pokeDef = parseInt(pokemon.slice(defIndex1, defIndex2));
		var spaIndex1 = pokemon.indexOf('spa:') + 4; var spaIndex2 = pokemon.indexOf(',', spaIndex1);
		var pokeSpa = parseInt(pokemon.slice(spaIndex1, spaIndex2));
		var spdIndex1 = pokemon.indexOf('spd:') + 4; var spdIndex2 = pokemon.indexOf(',', spdIndex1);
		var pokeSpd = parseInt(pokemon.slice(spdIndex1, spdIndex2));
		var speIndex1 = pokemon.indexOf('spe:') + 4; var speIndex2 = pokemon.indexOf('}', speIndex1);
		var pokeSpe = parseInt(pokemon.slice(speIndex1, speIndex2));
		var pokeBst = pokeHp + pokeAtk + pokeDef + pokeSpa + pokeSpd + pokeSpe;
		var pokeStats = 'HP ' + pokeHp + ' / Atk ' + pokeAtk + ' / Def ' + pokeDef + ' / SpA ' + pokeSpa + ' / SpD ' + pokeSpd + ' / Spe ' + pokeSpe + ' / BST ' + pokeBst;
		var colorIndex1 = pokemon.indexOf(',color:"') + 8; var colorIndex2 = pokemon.indexOf('",', colorIndex1);
		var pokeColor = pokemon.slice(colorIndex1, colorIndex2);
		var egg1Index1 = pokemon.indexOf(',eggGroups:["') + 13; var egg1Index2 = pokemon.indexOf('"]', egg1Index1);
		var pokeEgg2 = "";
		if (/,/.test(pokemon.slice(egg1Index1, egg1Index2))) {
			var egg1Index2 = pokemon.indexOf('","', egg1Index1);
			var egg2Index1 = pokemon.indexOf('","', egg1Index1) + 3; var egg2Index2 = pokemon.indexOf('"]', egg2Index1);
			var pokeEgg2 = ", " + pokemon.slice(egg2Index1, egg2Index2);
		}
		var pokeEgg1 = pokemon.slice(egg1Index1, egg1Index2);
		if (pokeName === "Ho-Oh" || pokeName === "Nidoran-F" || pokeName === "Nidoran-M" || pokeName === "Farfetch'd" || pokeName === "Porygon-Z") {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/' + pokeName.toLowerCase().replace(/[-]+/g, '').replace(/[']+/g, '') + '.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Stats: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		} else if (pokeName === "Basculin-Blue-Striped") {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/basculin-bluestriped.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		} else if (pokeName === "Pichu-Spiky-eared") {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pichu-spikyeared.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		} else if (pokeName === "Floette-Eternal-Flower") {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/floette-eternalflower.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		} else if (pokeName === "Missingno.") {
			var y = Math.floor(Math.random() * (6 - 1)) + 1;
			switch (y) {
			case 1:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/9/98/Missingno_RB.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 2:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/0/03/Missingno_Y.png" height="96" width="96"></td><td><bName: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 3:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/a/aa/Spr_1b_141_f.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 4:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/b/bb/Spr_1b_142_f.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 5:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/9/9e/Ghost_I.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			default:
				break;
			}
		} else if (pokeName === "Pikachu-Cosplay") {
			var z = Math.floor(Math.random() * (6 - 1)) + 1;
			switch (z) {
			case 1:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-rock-star.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 2:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-belle.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 3:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-pop-star.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 4:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-phd.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 5:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-libre.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			default:
				break;
			}
		} else {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/' + pokeName.toLowerCase().replace(/[ ]+/g, '').replace(/[.]+/g, '').replace(/[']+/g, '') + '.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		}
		this.sendReplyBox(randP);
	},

	dm: 'daymute',
	daymute: function (target, room, user, connection, cmd) {
		if (!target) return this.sendReply("/daymute OR /dm [user], [reason] - Mutes a user with a reason for 24 hours.")
		if (room.isMuted(user) && !user.can('bypassall')) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}

		var muteDuration = 24 * 60 * 60 * 1000;
		if (!this.can('mute', targetUser, room)) return false;
		var canBeMutedFurther = ((room.getMuteTime(targetUser) || 0) <= (muteDuration * 5 / 6));
		if ((room.isMuted(targetUser) && !canBeMutedFurther) || targetUser.locked || !targetUser.connected) {
			var problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			if (!target) {
				return this.privateModCommand("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
			}
			return this.addModCommand("" + targetUser.name + " would be muted by " + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		if (targetUser in room.users) targetUser.popup("|modal|" + user.name + " has muted you in " + room.id + " for 24 hours. " + target);
		this.addModCommand("" + targetUser.name + " was muted by " + user.name + " for 24 hours." + (target ? " (" + target + ")" : ""));
		if (targetUser.autoconfirmed && targetUser.autoconfirmed !== targetUser.userid) this.privateModCommand("(" + targetUser.name + "'s ac account: " + targetUser.autoconfirmed + ")");


		room.mute(targetUser, muteDuration, false);
	},
	sd: 'declaremod',
	staffdeclare: 'declaremod',
	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function(target, room, user) {
		if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;
		this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Private Auth (Driver +) declare from ' + user.name + '<br /></i></font size>' + target + '</b></div>');
		this.logModCommand(user.name + ' mod declared ' + target);
	},
	helix: function(target, room, user) {
		if (!this.runBroadcast()) return;
		var random = Math.floor(20 * Math.random()) + 1;
		var results = '';
		if (random == 1) {
			results = 'Signs point to yes.';
		}
		if (random == 2) {
			results = 'Yes.';
		}
		if (random == 3) {
			results = 'Reply hazy, try again.';
		}
		if (random == 4) {
			results = 'Without a doubt.';
		}
		if (random == 5) {
			results = 'My sources say no.';
		}
		if (random == 6) {
			results = 'As I see it, yes.';
		}
		if (random == 7) {
			results = 'You may rely on it.';
		}
		if (random == 8) {
			results = 'Concentrate and ask again.';
		}
		if (random == 9) {
			results = 'Outlook not so good.';
		}
		if (random == 10) {
			results = 'It is decidedly so.';
		}
		if (random == 11) {
			results = 'Better not tell you now.';
		}
		if (random == 12) {
			results = 'Very doubtful.';
		}
		if (random == 13) {
			results = 'Yes - definitely.';
		}
		if (random == 14) {
			results = 'It is certain.';
		}
		if (random == 15) {
			results = 'Cannot predict now.';
		}
		if (random == 16) {
			results = 'Most likely.';
		}
		if (random == 17) {
			results = 'Ask again later.';
		}
		if (random == 18) {
			results = 'My reply is no.';
		}
		if (random == 19) {
			results = 'Outlook good.';
		}
		if (random == 20) {
			results = 'Don\'t count on it.';
		}
		return this.sendReplyBox('' + results + '');
    },

spr: 'sprite',
    sprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/sprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/xyani-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/xyani-back/';
		else if (type === 'backshiny' || type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/xyani-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/xyani/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
		});
	},
    bwspr: 'bwsprite',
    bwsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/bwsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'bwshiny') url = 'http://play.pokemonshowdown.com/sprites/bwani-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/bwani-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/bwani-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/bwani/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
		});
	},
	dppspr: 'dppsprite',
        dppsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/dppsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/dpp-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/dpp-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/dpp-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/dpp/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	rsespr: 'rsesprite',
        rsesprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rsesprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/rse-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/rse-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/rse-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/rse/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	gscspr: 'gscsprite',
        gscsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/gscsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/gsc-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/gsc-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/gsc-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/gsc/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	rbyspr: 'rbysprite',
        rbysprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rbysprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/rby-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/rby-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/rby-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/rby/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	greenspr: 'greensprite',
        greensprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/greensprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url = 'http://www.pokestadium.com/img/sprites/main-series/green/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	rbspr: 'rbsprite',
        rbsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rbsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'gray') url = 'http://www.pokestadium.com/img/sprites/main-series/red-blue/gray/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/red-blue/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	crystalspr: 'crystalsprite',
        crystalsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/crystalsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://www.pokestadium.com/img/sprites/main-series/crystal/animated/shiny/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/crystal/animated/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
		});
	},
	rflgspr: 'rflgsprite',
        rflgsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rsesprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://www.pokestadium.com/img/sprites/main-series/firered-leafgreen/shiny/';
		else if (type === 'back') url = 'http://www.pokestadium.com/img/sprites/main-series/firered-leafgreen/back/';
		else if (type === 'shinyback') url = 'http://www.pokestadium.com/img/sprites/main-series/firered-leafgreen/shiny/back/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/firered-leafgreen/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	emeraldspr: 'emeraldsprite',
        emeraldsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/rsesprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://www.pokestadium.com/img/sprites/main-series/emerald/animated/shiny/';
		else if (type === 'shinyback') url = 'http://www.pokestadium.com/img/sprites/main-series/emerald/animated/shiny/back/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/emerald/animated/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
		});
	},
	afdspr: 'afdsprite',
        afdsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/afdsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/afd-shiny/';
		else if (type === 'back') url = 'http://play.pokemonshowdown.com/sprites/afd-back/';
		else if (type === 'shinyback') url = 'http://play.pokemonshowdown.com/sprites/afd-back-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/afd/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	xyspr: 'xysprite',
        xysprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/xysprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://play.pokemonshowdown.com/sprites/xydex-shiny/';
		else url = 'http://play.pokemonshowdown.com/sprites/xydex/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
	artspr: 'artsprite',
        artsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/artsprite [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url = 'http://www.pokestadium.com/img/sprites/official-art/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} /*else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}*/
		}
		var self = this;
		require('request').get(url + sprite + alt + '.png').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.png">');
		});
	},
    model: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/model [Pokémon] - Allows you to view the sprite of a Pokémon');
		target = target.toLowerCase().split(',');
		var alt = '';
		var type = toId(target[1]);
		var sprite = target[0].trim();
		var url;
		if (type === 'shiny') url = 'http://www.pokestadium.com/img/sprites/main-series/xy/shiny/';
		else if (type === 'back') url = 'http://www.pokestadium.com/img/sprites/main-series/xy/back/';
		else url = 'http://www.pokestadium.com/img/sprites/main-series/xy/';

		if (Number(sprite[sprite.length - 1]) && !toId(sprite[sprite.length - 2])) {
			alt = '-' + sprite[sprite.length - 1];
			sprite = sprite.substr(0, sprite.length - 1);
			url = 'http://www.pkparaiso.com/imagenes/xy/sprites/animados/';
		}
		var main = target[0].split(',');
		if (Tools.data.Pokedex[toId(sprite)]) {
			sprite = Tools.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			var correction = Tools.dataSearch(toId(sprite));
			if (correction && correction.length) {
				for (var i = 0; i < correction.length; i++) {
					if (correction[i].id !== toId(sprite) && !Tools.data.Aliases[toId(correction[i].id)] && !i) {
						if (!Tools.data.Pokedex[toId(correction[i])]) continue;
						if (!Tools.data.Aliases[toId(sprite)]) this.sendReply("There isn't any Pokémon called '" + sprite + "'... Did you mean '" + correction[0].name + "'?\n");
						sprite = Tools.data.Pokedex[correction[0].id].species.toLowerCase();
					}
				}
			} /*else {
				return this.sendReply("There isn\'t any Pokémon called '" + sprite + "'...");
			}*/
		}
		var self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode == 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
		});
    },

	chatcolour: 'chatcolor',
	chatcolor: function (target, room, user) {
		var targets = target.split(',');
		if (targets.length < 2) return this.sendReply("/chatcolor OR /chatcolour [colour], [message] - Outputs a message in a custom colour.");
		if (!this.can('lock') && !isVip(user) && !isDev(user)) return;
		if (!this.canTalk()) return this.errorReply("You may not use this command while unable to speak.");
		let group = user.getIdentity().charAt(0);
	    if (room.auth) group = room.auth[user.userid] || group;
	   	let style = "background:none;border:0;padding:0 5px 0 0;font-family:Verdana,Helvetica,Arial,sans-serif;font-size:9pt;cursor:pointer";
		this.add('|raw|' + "<b<div class='chat'>" + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>" + "<b><font color='"  + color(user.userid) +  "'>" + user.name + ":</font></b></button>" + '<b><font color="' + targets[0].toLowerCase().replace(/[^#a-z0-9]+/g, '') + '">' + Tools.escapeHTML(targets.slice(1).join(",")) + '</font>');

    },

	namecolor: function (target, room, user) {
		var targets = target.split(',');
		if (targets.length < 2) return this.sendReply("/namecolor [color], [message] - Outputs your name in custom color.");
		if (!this.can('lock') && !isVip(user) && !isDev(user)) return;
		if (!this.canTalk()) return this.errorReply("You may not use this command while unable to speak.");
		let group = user.getIdentity().charAt(0);
	    if (room.auth) group = room.auth[user.userid] || group;
	   	let style = "background:none;border:0;padding:0 5px 0 0;font-family:Verdana,Helvetica,Arial,sans-serif;font-size:9pt;cursor:pointer";
		this.add('|raw|' + "<div class='chat'>" + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>" + '<b><font color="' + targets[0].toLowerCase().replace(/[^#a-z0-9]+/g, '') + '">' + user.name + ':</b></font></button>' + '<font color="black">' + Tools.escapeHTML(targets.slice(1).join(",")) + '</font>');
			
	},


	tourelo: 'tourladder',
	tourladder: function (target, room, user) {
		if (!this.runBroadcast()) return;
		var self = this;
		if (!target || !target.trim()) {
			tourLadder.load().then(function (users) {
				if (!users.length) return self.sendReplyBox('No rated tournaments have been played yet.');
				users.sort(function (a, b) {
					return b[1] - a[1];
				});
				var padding = self.broadcasting ? '5' : '8';
				var table = '<center><b><u>Tournament Ladder</u></b><br>' +
					'<table border = "1" cellspacing = "0" cellpadding = "' + padding + '"><tr><th>No.</th><th>User</th><th>Elo</th>';
				for (var i = 0; i < (self.broadcasting ? 10 : users.length); i++) {
					if (!users[i] || users[i][1] <= 1000) break;
					var user = (Users.getExact(users[i][0]) ? Users.getExact(users[i][0]).name : users[i][0]);
					table += '<tr><td><center>' + (i + 1) + '</center></td><td style = "text-align: center">' + user + '</td><td style = "text-align: center">' + Math.round(users[i][1]) + '</td></tr>';
				}
				table += '</table></center>';
				if (self.broadcasting && users.length > 10) table += '<center><button name = "send" value = "/tourladder"><small>Click to see the full ladder</small></button></center>';

				display(table + '</table>', self);
				if (self.broadcasting) room.update();
			});
			return;
		}

		target = (Users.getExact(target) ? Users.getExact(target).name : target);
		if (tourLadder.indexOfUser(target) === -1) return this.sendReplyBox(target + ' hasn\'t played any rated tournaments yet.');
		tourLadder.load().then(function (users) {
			var elo = users[tourLadder.indexOfUser(target)][1];
			self.sendReplyBox(target + '\'s Tournament Elo is <b>' + Math.round(elo) + '</b>.');
		});
	},

	deletetourladder: 'resettourladder',
	resettourladder: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		tourLadder.load().then(function (users) {
			if (!users.length) return this.sendReply('No rated tournaments have been played yet.');
			if (!confirm) {
				confirm = true;
				return this.sendReply('WARNING: This will permanently delete all tournament ladder ratings. If you\'re sure you want to do this, use this command again.');
			}
			confirm = false;
			delete Ladders.ladderCaches['tournaments'];
			require('fs').unlinkSync('config/ladders/tournaments.tsv');
			Rooms('lobby').add('|html|<b>The Tournament Ladder has been reset.</b>');
			Rooms('lobby').update();
			if (room.id !== 'lobby') this.sendReply('The Tournament Ladder has been reset.');
		}.bind(this));

	},
	poofhelp: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('-/poof - Leaves a random message in the chat and disconnects the user from the server.<br>' +
			'-/cpoof <em>Message</em> - Leaves a custom message in the chat and disconnects the user from the server. Requires %, @, # or ~<br>' +
			'-/addpoof <em>Message</em> - Adds a poof message into the list of possible poofs. Adding "(user)" into a poof message replaces "(user)" with that user\'s name. Requires ~<br>' +
			'-/pooflist - Displays the list of all poof messages.'
		);
	},

	d: 'poof',
	poof: function (target, room, user) {
		if (!this.canTalk()) return;
		if (poofoff) return this.sendReply("Poofs are currently disabled.");
		if (room.id !== 'lobby') return false;
		var message = poofs[Math.floor(Math.random() * poofs.length)].replace(/\(user\)/g, Tools.escapeHTML(user.name));
		this.add('|html|<center><span style = "color:#' + randomColor() + '"><b>~~ ' + message + ' ~~</b></span></center>');
		user.disconnectAll();
	},

	custompoof: 'cpoof',
	cpoof: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (poofoff) return this.sendReply("Poofs are currently disabled.");
		if (room.id !== 'lobby') return false;
		if (!target || !target.trim()) return this.parse('/poof');
		if (!target.match(/\(user\)/)) target = Tools.escapeHTML(user.name) + ' ' + target;
		else target = target.replace(/\(user\)/g, Tools.escapeHTML(user.name));
		this.add('|html|<center><span style = "color:#' + randomColor() + '"><b>~~ ' + target.trim() + ' ~~</b></span></center>');
		user.disconnectAll();
	},

	addpoof: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.parse('/poofhelp');
		if (poofs.map(toId).indexOf(toId(target)) > -1) return this.sendReply('That poof message already exists!');
		if (target.length > 100) return this.sendReply('Poof messages can only contain a maximum of 100 characters.');
		if (!target.match(/\(user\)/)) target = '(user) ' + target;
		poofs.push(target.trim());
		fs.writeFileSync(FILE_NAME, JSON.stringify(poofs, null, 1));
		return this.sendReply('|html|"' + target + '" has been added to the list of poof messages.');
	},

	switchpoof: 'togglepoof',
	tpoof: 'togglepoof',
	togglepoof: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		poofoff = !poofoff;
		this.sendReply('Poofs have been ' + (poofoff ? 'disabled' : 'enabled') + '.');
	},

	pooflist: function (target, room, user) {
		var list = '|html|<center><b>Poof message list</b></center><br>';
		poofs.forEach(function (msg) {
			list += '"' + msg + '"';
			if (user.can('hotpatch')) list += '<button name = "send" value = "/deletepoof ' + msg + '" style = "font-size: 7pt;">Delete</button>';
			list += '<br>';
		});
		this.popupReply(list);
	},

	deletepoof: function (target, room, user) {
		if (!target || !target.trim()) return this.sendReply('|html|/deletepoof <em>Message</em> - Deletes the selected message from the list of poofs.');
		if (!target.match(/\(user\)/)) target = '(user) ' + target;
		var pos = poofs.map(toId).indexOf(toId(target));
		if (pos === -1) return this.sendReply('That poof message doesn\'t exist.');
		this.popupReply('|html|The poof message "' + poofs[pos] + '" has been deleted.');
		poofs.splice(pos, 1);
		fs.writeFileSync(FILE_NAME, JSON.stringify(poofs, null, 1));
	},
	
	// Credits command by clawliet
	credit: 'credits',
    credits: function (target, room, user) {
        // To generate username with their colors
        function generateName(name) {
                return '<font style="color:' + color(toId(name)) + '; text-shadow: 1px 1px 2px #000; font-weight: bold;">' + name + '</font>'; 
        };
        // A function to generate the display
        function generateDisplay() {
                // The background and stuff
                let display = '<div style="background: url(&quot;http://i.imgur.com/RP3MGmQ.jpg&quot;) no-repeat; background-size: cover; border-radius: 10px; padding: 5px;">';
                // The header
                let header = '<center><img src="http://i.imgur.com/ZYkKm8I.png" width="300" height="80"></center>';
                // The server owners
                let serverOwners = '<center><b><u><i>Server Owners</i></u></b></center>' + '<br />' +
                generateName('Hydrostatics') + ': Server Owner & Sysop' + '<br />' +
                generateName('Steel★Sciz') + ': Server Host, Development & Sysop' + '<br /><br />';
                // The development team
                let developers = '<center><b><u><i>Development:</i></u></b></center>' + '<br />' +
                generateName('Dragotic') + ': Development' + '<br />' +
                generateName('TheGodOfPie') + ': Tiering Manager' + '<br /><br />';
                // Special user or contributors
                let specialThanks = '<center><b><u><i>Special Thanks:</i></u></b></center>' + '<br />' +
                generateName('CLawliet') + ': SSB & Credits Commands' + '<br />' +
                generateName('W♡ndo') + ': Panagrams update' + '<br />' +
                'Our Staff & Faithful users!';
                // Patch it all up here and return
                display += header + serverOwners + developers + specialThanks + '</div>';
                return display;
        };
        // Output it all as a popup
        user.popup('|html|' + generateDisplay());
	},

	ssb: function (target, room, user) {
		// if no mon is specified
        if (!target) return this.parse('/help ssb');
        if (!this.runBroadcast()) return false;
        let monName = toId(target);
        // Replies if the target specified is not present
        if (!Db('staffmons').has(monName)) return this.errorReply('Staffmon ' + monName + ' could not be found.');
        // Generates Display
        function generateDisplay() {
        	let display = '';
        	// The custom styling like background and stuff
        	let styling = Db('staffmons').get([monName, 'styling']);
        	// Staffmons Name
        	let staffName = '<center><h3><b><u>' + Db('staffmons').get([monName, 'username']) + '</u></b></h3></center>';
        	// Staffmon
        	let staffMon = '<b>Staffmon: </b>' + Db('staffmons').get([monName, 'staffmon']);
        	// Staffmon's Item
        	let staffMonItem = '<b>Item: </b>' + Db('staffmons').get([monName, 'item']);
        	// Staffmon's Ability
        	let staffMonAbility = '<b>Ability: </b>' + Db('staffmons').get([monName, 'ability']);
        	//Staffmon's Innate Ability (if it has one)
        	let staffMonInnateAbility = '<b>Innate Ability: </b>' + Db('staffmons').get([monName, 'innate ability']);
        	// Staffmon's Nature
        	let staffMonNature = '<b>Nature: </b>' + Db('staffmons').get([monName, 'nature']);
        	// Staffmon's Move Pool
        	let staffMonMovePool = '<b>Move Pool: </b>' + Db('staffmons').get([monName, 'movepool']).join(', ');
        	// Staffmon's Signature Move
        	let staffMonSignatureMove = '<b>Signature Move: </b>' + Db('staffmons').get([monName, 'signature move']);
        	// Staffmon's Evs
        	let staffMonEvs = '<b>EVs: </b>' + Db('staffmons').get([monName, 'evs']).join(' / ');
        	// A note on how the staffmon works and counters
        	let note = '<b>NOTE: </b>' + Db('staffmons').get([monName, 'note']);
        	// Line Break
        	let BR = '<br /><br />';
        	// Lets patch it all up here
        	display += styling + staffName + '<br />' + staffMon + BR + staffMonItem + BR 
        	+ staffMonAbility + BR + (Db('staffmons').has([monName, 'innate ability']) ? staffMonInnateAbility + BR : '') + staffMonNature + BR + staffMonMovePool + BR + 
        	staffMonSignatureMove + BR + staffMonEvs + BR + note + '</div>';
        	// Output it
        	return display;
        }
        
        this.sendReplyBox(generateDisplay());
    },
    ssbhelp: ['/ssb [staff name] - Shows the complete set of a member in Supernova Super Staff Bros.',
    'List of current members in Supernova Super Staff Bros.:',
    '~Hydrostatics, ~Mighty Sciz, &Kie, &TheGodOfPie, @StarryWindy, +Camilas, +party\'s over, Back At My Day..., CLawliet, Cross-Xz14, DarkChaoticFlare, Dayuh, Dragotic, Elizabeth Swann, Eternal Mayhem, Ransei, Volco, and Zodiac Ragna.'],
};
