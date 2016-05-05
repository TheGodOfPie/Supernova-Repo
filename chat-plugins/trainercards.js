'use strict';

let fs = require('fs');
let path = require('path');

function logTcs(message) {
	if (!message) return;
	let file = path.join(__dirname, '../logs/tc.txt');
	let date = "[" + new Date().toUTCString() + "] ";
	let msg = message + "\n";
	fs.appendFile(file, date + msg);
}

exports.commands = {
	addtc: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help addtc');

		let parts = target.split(',');
		let name = toId(parts[0]);
		let tc = parts.slice(1).join(", ").trim();

		Db('tc').set(name, tc);
		
		this.sendReply("Trainer Card has been set.");
		if (Users.get(username)) Users(username).popup(user.name + " has given you the title: ||||" + title);
		logTitle(" + user.name + " has added the following Trainer Card: ' + name + ' .");
	},
	addtchelp: ["/addtc [name], [HTML] - Adds a trainer card."],
    
    },
    
    tc: function (target, room, user) {
      if (!this.runBroadcast()) return; 
      if (!target || target.indexOf(',') < 0) return this.parse('/help tc');     
	  let name = toId(parts[0]);      
      Db('tc').get(name);     
      this.parse("|html| ' + name + '");
    },
      
};