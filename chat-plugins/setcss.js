/*************************************************
* Icon and CM Set Plugin						 *
*												 *
* Icon Credits: Master Float					 *
*  												 *
* CM Set Credits: Steel Sciz using the Icon Code *
**************************************************/

'use strict';

let fs = require('fs');
let path = require('path');
let selectors;

function writeIconCSS() {
	fs.appendFile('config/custom.css', selectors);
}

function logMoney(message) {
	if (!message) return;
	let file = path.join(__dirname, '../logs/money.txt');
	let date = "[" + new Date().toUTCString() + "] ";
	let msg = message + "\n";
	fs.appendFile(file, date + msg);
}

exports.commands = {
	seticon: function (target, room, user) {
		if (!this.can('hotpatch')) return this.errorReply("Access denied.");

		let args = target.split(',');
		if (args.length < 3) return this.parse('/help seticon');
		let username = toId(args.shift());
		let image = 'background: rgba(244, 244, 244, 0.8) url("' + args.shift().trim() + '") right no-repeat;';
		selectors = '\n\n' + '  #' + toId(args.shift()) + '-userlist-user-' + username;
		args.forEach(function (room) {
			selectors += ', #' + toId(room) + '-userlist-user-' + username;
		});
		selectors += ' { \n' + '    ' + image +  '\n  }';

		logMoney(user.name + " has set an icon to " + username + ".");
		this.privateModCommand("(" + user.name + " has set an icon to  " + username + ")");
		Rooms('staff').add('|raw|' + user.name + " has set an icon to " + username +  ".").update();
		writeIconCSS();
	},
	seticonhelp: ["/seticon [username], [image], [room 1], [room 2], etc. - Sets an icon to a user in chosen rooms."],

    cmset: function (target, room, user) {
		if (!this.can('hotpatch')) return this.errorReply("Access denied.");
        let args = target.split(',');
        if (args.length < 2) return this.parse('/help cmset');
        let username = toId(args.shift());
        let image = 'color:' + args.shift().trim() + '';
        selectors = '\n\n' + '.chat.chatmessage-' + username +   '  em';
        selectors += ' { \n' + '    ' + image +  ' !important;\n  }';
 
        this.privateModCommand("(" + user.name + " has set an custom message to " + username + ")");
        writeIconCSS();
    },
    cmsethelp: ["/cmset [username], [color] - Sets an custom message to a user for all rooms."],

};
