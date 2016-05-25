'use strict';

let color = require('../config/color');

exports.parseEmoticons = parseEmoticons;

let emotes = {
	// Non Alpha Char
	'#freewolf': 'http://i.imgur.com/ybxWXiG.png',
	'4Head': 'http://i.imgur.com/2gtx8Q0.png',
	// Emotes Alpabetically Ordered
	// A
	'ayylamo': 'http://i.imgur.com/1ehnWjW.png',
	'feelsackbr': 'http://i.imgur.com/BzZJedC.jpg?1',
	// B
	'feelsbd': 'http://i.imgur.com/YyEdmwX.png',
	'feelsbebop': 'http://i.imgur.com/TDwC3wL.png',
	'feelsbirb': 'http://i.imgur.com/o4KxmWe.png',
	'feelsbm': 'http://i.imgur.com/xwfJb2z.png',
	'feelsbn': 'http://i.imgur.com/wp51rIg.png',
	'feelsbm': 'http://i.imgur.com/xwfJb2z.png',
	'feelsbt': 'http://i.imgur.com/rghiV9b.png',
	// C
	'feelschime': 'http://i.imgur.com/uIIBChH.png',
	'feelschamp': 'https://imgur.com/k1K1mSl.png',
	'feelschar': 'http://i.imgur.com/TRnvzq0.gif',
	'feelscx': 'http://i.imgur.com/zRSUw2n.gif',
	'feelscool': 'http://i.imgur.com/qdGngVl.jpg?1',
	'feelscrazy': 'http://i.imgur.com/NiJsT5W.png',
	'feelscri': 'http://i.imgur.com/QAuUW7u.jpg?1',
	// D
	'Doge': 'http://i.imgur.com/cphotT7.png',
	'feelsdd': 'http://i.imgur.com/fXtdLtV.png',
	'feelsdoge': 'http://i.imgur.com/GklYWvi.png',
 	'feelsdrg': 'http://i.imgur.com/UZzWcA3.png',
 	// E
 	'feelsemo': 'http://i.imgur.com/FPolh5d.jpg',
 	'feelsesp': 'http://i.imgur.com/R6uJPav.gif',
 	// F
 	'FacePalm': 'http://i.imgur.com/lv3GmpM.png',
 	'feelsfdra': 'http://i.imgur.com/ZIcl9Zy.jpg',
 	'feelsfro': 'http://i.imgur.com/ijJakJT.png',
 	'funnylol': 'http://i.imgur.com/SlzCghq.png',
 	// G
 	'feelsgay': 'http://i.imgur.com/zQAacwu.png?1',
 	'feelsgd': 'http://i.imgur.com/Jf0n4BL.png',
	'feelsgira': 'http://i.imgur.com/AD7xJKR.gif',
	'feelsgn': 'http://i.imgur.com/juJQh0J.png',
	'feelsgro': 'http://i.imgur.com/jLhP0bZ.png?1',
	'gudone': 'http://i.imgur.com/C10Bwqq.png',
	// H
	'feelshigh': 'http://i.imgur.com/s9I2bxp.jpg?1',
	'feelshlwn': 'http://i.imgur.com/OHMDVNJ.jpg',
	'feelshp': 'http://i.imgur.com/1W19BDG.png',
	'feelsho': 'http://i.imgur.com/J4oUHm2.png?1',
	'hmmface': 'http://i.imgur.com/Z5lOwfZ.png',
	'hypnotoad': 'http://i.imgur.com/lJtbSfl.gif',
	// I
	'feelsilum': 'http://i.imgur.com/CnyGTTD.png',
	// J
	'feelsjenny': 'http://i.imgur.com/lZpcv5C.jpg?1',
	'feelsjig': 'http://i.imgur.com/hSzqy5z.png?1',
	'feelsjpn': 'http://i.imgur.com/Zz2WrQf.jpg',
	'jcena': 'http://i.imgur.com/hPz30Ol.jpg?2',
	// K
	'feelskawaii': 'http://i.imgur.com/kLnDaYD.png',
 	'feelsky': 'http://i.imgur.com/BtATPId.png?1',
 	'Kappa': 'http://i.imgur.com/ZxRU4z3.png?1',
 	'Kreygasm': 'http://i.imgur.com/qw9XlYv.png',
 	// L
 	'feelslatias': 'http://i.imgur.com/OPZuG3f.gif',
 	'feelslatios': 'http://i.imgur.com/QCoBmpe.gif',
 	'feelslelouch': 'http://i.imgur.com/qZrV75o.png',
 	'feelsllama': 'http://i.imgur.com/oSLSk2I.gif',
	'feelslot': 'http://i.imgur.com/tl88F7i.png?1',
	'feelslu': 'http://i.imgur.com/REEBSOT.png?1',
	'llamacool': 'http://i.imgur.com/X1x3728.gif',	
	'llamanoodle': 'http://i.imgur.com/SUZkz5p.gif',
	'llamarawr': 'http://i.imgur.com/KWAQbPu.gif',
	'llamatea': 'http://i.imgur.com/nJnakEU.gif',
	'llamayawn': 'http://i.imgur.com/SVj8kBt.gif',
	// M
	'feelsmd': 'http://i.imgur.com/DJHMdSw.png',
	'feelsmixtape': 'http://i.imgur.com/7lncwng.png',
	'meGusta': 'http://i.imgur.com/s1xzsuC.png',
	// N
	'feelsnv': 'http://i.imgur.com/XF6kIdJ.png',
	'feelsns': 'http://i.imgur.com/jYRFUYW.jpg?1',
	'noface': 'http://i.imgur.com/H744eRE.png',
	// O
	'feelsok': 'http://i.imgur.com/gu3Osve.png',
	'feelsorange': 'http://i.imgur.com/3fxXP16.jpg',
	'Obama': 'http://i.imgur.com/rBA9M7A.png',
	'oshet': 'http://i.imgur.com/yr5DjuZ.png',
	// P
	'feelspanda': 'http://i.imgur.com/qi7fue9.png',
	'feelspichu': 'http://i.imgur.com/vqEpogr.gif',
	'feelspie': 'http://i.imgur.com/M9d1GOf.png',
	'feelspika': 'http://i.imgur.com/mBq3BAW.png',
	'feelsPika': 'http://i.imgur.com/eoTrTkn.png?1',
	'feelspink': 'http://i.imgur.com/jqfB8Di.png',
	'feelspissed': 'http://i.imgur.com/D44jUWM.png',
	'feelspn': 'http://i.imgur.com/wSSM6Zk.png',
	'feelspoli': 'http://i.imgur.com/FnzhrWa.jpg?1',
 	'feelsPoli': 'http://i.imgur.com/sbKhXZE.jpg?1',
	'feelspr': 'http://i.imgur.com/3VtkKfJ.png',
	'PeoplesChamp': 'http://i.imgur.com/QMiMBKe.png',
	// Q
	// R
	'feelsrb': 'http://i.imgur.com/L6ak1Uk.png',
	'feelsrg': 'http://i.imgur.com/DsRQCsI.png',
	'feelsrs': 'http://i.imgur.com/qGEot0R.png',
	// S
	'feelssc': 'http://i.imgur.com/cm6oTZ1.png',
	'feelssciz': 'http://i.imgur.com/sDWpTYN.gif',
	'feelsseis': 'http://i.imgur.com/gGGYxrE.png?1',
	'feelsshay': 'http://i.imgur.com/Aw8KAmi.gif',
	'feelsshi': 'http://i.imgur.com/VzlGZ1M.jpg',
	'feelsshrk': 'http://i.imgur.com/amTG3jF.jpg',
	'feelsslo': 'http://i.imgur.com/iQuToJf.jpg?1',
	'feelssnail':'http://i.imgur.com/wf2ajCR.jpg',
	'feelssnake': 'http://i.imgur.com/xoJnDUD.png',
	'Sanic': 'http://i.imgur.com/Y6etmna.png',
	// T
	'feelstea': 'http://i.imgur.com/M0f2zgJ.jpg?1',
 	'feelstired': 'http://i.imgur.com/EgYViOs.jpg',
 	'thumbsup': 'http://i.imgur.com/eWcFLLn.jpg',
 	'trollface': 'http://i.imgur.com/o0d3gdu.png',
 	'trumpW': 'http://i.imgur.com/E0gXLWA.png',
 	// U
 	// V
 	'feelsvolc': 'http://i.imgur.com/QXlKzZd.png?1',
 	'feelsvpn': 'http://i.imgur.com/ODTZISl.gif',
 	// W
 	'feelswin': 'http://i.imgur.com/rbs9pZG.png?1',
 	'wtfman': 'http://i.imgur.com/kwR8Re9.png',
 	// X
 	'xaa': 'http://i.imgur.com/V728AvL.png',
 	'xoxo': 'http://i.imgur.com/BoaiQWP.png',
 	// Y
 	'yayface': 'http://i.imgur.com/anY1jf8.png',
	'yesface': 'http://i.imgur.com/k9YCF6K.png',
 	'youdontsay': 'http://i.imgur.com/fALVrF9.jpg',
 	// Z
 };

let emotesKeys = Object.keys(emotes);
let patterns = [];
let metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;

for (let i in emotes) {
	if (emotes.hasOwnProperty(i)) {
		patterns.push('(' + i.replace(metachars, '\\$&') + ')');
	}
}
let patternRegex = new RegExp(patterns.join('|'), 'g');

/**
 * Parse emoticons in message.
 *
 * @param {String} message
 * @param {Object} room
 * @param {Object} user
 * @param {Boolean} pm - returns a string if it is in private messages
 * @returns {Boolean|String}
 */
function parseEmoticons(message, room, user, pm) {
	if (typeof message !== 'string' || (!pm && room.disableEmoticons)) return false;

	let match = false;
	let len = emotesKeys.length;


	while (len--) {
		if (message && message.indexOf(emotesKeys[len]) >= 0) {
			match = true;
			break;
		}
	}

	if (!match) return false;

	// shadowbanroom message
	let sbanmsg = message;

	// escape HTML
	message = Tools.escapeHTML(message);

	// add emotes
	message = message.replace(patternRegex, function (match) {
		let emote = emotes[match];
		return typeof emote === 'string' ? '<img src="' + emote + '" title="' + match + '" height="50" width="50" />' : match;
	});

	// __italics__
	message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>');

	// **bold**
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');

	let group = user.getIdentity().charAt(0);
	if (room.auth) group = room.auth[user.userid] || group;

	let style = "background:none;border:0;padding:0 5px 0 0;font-family:Verdana,Helvetica,Arial,sans-serif;font-size:9pt;cursor:pointer";

	message = "<div class='chat'>" + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>" + "<b><font color='" + color(user.userid) + "'>" + user.name + ":</font></b>" + "</button><em class='mine'>" + message + "</em></div>";
	if (pm) return message;
	if (Users.ShadowBan.checkBanned(user)) {
		user.sendTo(room, '|html|' + message);
		Users.ShadowBan.addMessage(user, "To " + room, sbanmsg);
	}
	room.addRaw(message);
	return true;
}

/**
 * Create a two column table listing emoticons.
 *
 * @return {String} emotes table
 */
function create_table() {
	let emotes_name = Object.keys(emotes);
	let emotes_list = [];
	let emotes_group_list = [];
	let len = emotes_name.length;
	let i;

	for (i = 0; i < len; i++) {
		emotes_list.push("<td>" +
			"<img src='" + emotes[emotes_name[i]] + "'' title='" + emotes_name[i] + "' height='50' width='50' />" +
			emotes_name[i] + "</td>");
	}

	let emotes_list_right = emotes_list.splice(len / 2, len / 2);

	for (i = 0; i < len / 2; i++) {
		let emote1 = emotes_list[i],
			emote2 = emotes_list_right[i];
		if (emote2) {
			emotes_group_list.push("<tr>" + emote1 + emote2 + "</tr>");
		} else {
			emotes_group_list.push("<tr>" + emote1 + "</tr>");
		}
	}

	return "<div class='infobox'><center><b><u>List of Emoticons</u></b></center>" + "<div class='infobox-limited'><table border='0' cellspacing='0' cellpadding='5' width='100%'>" + "<tbody>" + emotes_group_list.join("") + "</tbody>" + "</table></div></div>";
}

let emotes_table = create_table();

exports.commands = {
	blockemote: 'blockemoticons',
	blockemotes: 'blockemoticons',
	blockemoticon: 'blockemoticons',
	blockemoticons: function (target, room, user) {
		if (user.blockEmoticons === (target || true)) return this.sendReply("You are already blocking emoticons in private messages! To unblock, use /unblockemoticons");
		user.blockEmoticons = true;
		return this.sendReply("You are now blocking emoticons in private messages.");
	},
	blockemoticonshelp: ["/blockemoticons - Blocks emoticons in private messages. Unblock them with /unblockemoticons."],

	unblockemote: 'unblockemoticons',
	unblockemotes: 'unblockemoticons',
	unblockemoticon: 'unblockemoticons',
	unblockemoticons: function (target, room, user) {
		if (!user.blockEmoticons) return this.sendReply("You are not blocking emoticons in private messages! To block, use /blockemoticons");
		user.blockEmoticons = false;
		return this.sendReply("You are no longer blocking emoticons in private messages.");
	},
	unblockemoticonshelp: ["/unblockemoticons - Unblocks emoticons in private messages. Block them with /blockemoticons."],

	emotes: 'emoticons',
	emoticons: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply("|raw|" + emotes_table);
	},
	emoticonshelp: ["/emoticons - Get a list of emoticons."],

	toggleemote: 'toggleemoticons',
	toggleemotes: 'toggleemoticons',
	toggleemoticons: function (target, room, user) {
		if (!this.can('declare', null, room)) return false;
		room.disableEmoticons = !room.disableEmoticons;
		this.sendReply("Disallowing emoticons is set to " + room.disableEmoticons + " in this room.");
		if (room.disableEmoticons) {
			this.add("|raw|<div class=\"broadcast-red\"><b>Emoticons are disabled!</b><br />Emoticons will not work.</div>");
		} else {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Emoticons are enabled!</b><br />Emoticons will work now.</div>");
		}
	},
	toggleemoticonshelp: ["/toggleemoticons - Toggle emoticons on or off."],

	rande: 'randemote',
	randemote: function (target, room, user) {
		if (!this.canBroadcast()) return;
		let rng = Math.floor(Math.random() * emotesKeys.length);
		let randomEmote = emotesKeys[rng];
		this.sendReplyBox("<img src='" + emotes[randomEmote] + "' title='" + randomEmote + "' height='50' width='50' />");
	},
	randemotehelp: ["/randemote - Get a random emote."],
};
