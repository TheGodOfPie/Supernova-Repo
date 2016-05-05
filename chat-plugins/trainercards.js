/**************************
* Trainer Cards Plugin    * 
*                         *
* Made by: Steel Sciz     *
*  						  *
* PS Plugin to add in TCs *
*   Utilizing OriginDB    *
*                         *
**************************/
'use strict';

let fs = require('fs');
let path = require('path');

function logTc(message) {
	if (!message) return;
	let file = path.join(__dirname, '../logs/tc.txt');
	let date = "[" + new Date().toUTCString() + "] ";
	let msg = message + "\n";
	fs.appendFile(file, date + msg);
}

exports.commands = {

	addtc: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help addtc');

		let parts = target.split(',');
		let name = toId(parts[0]);
		let tc = parts.slice(1).join(", ").trim();

		Db('tc').set(name, tc);
		
		this.sendReply("Trainer Card has been set.");
		logTc(user.name + " has added the following Trainer Card: " + name + ".");
	},

	addtchelp: ["/addtc [name], [HTML] - Adds a trainer card."],
    
    tc: function (target, room, user) {
      if (!this.runBroadcast()) return; 
	  if (target.length < 2) return this.parse("/help tc");   
	  let name = Db('tc').get(target);         
      this.sendReplyBox('' + name + '');
    },

	tchelp: ["/tc [name] - Broadcasts a Trainer Card."],     

	deletetc: function (target, room, user) {
	  if (!this.can('hotpatch')) return false;
      if (target.length < 2) return this.parse("/help deletetc");
      let name = Db('tc').get(target);

      Db('tc').delete(target);

      this.sendReply('You have successfully deleted the Trainer Card ' + target + '.');

    },
	
    deletetchelp: ["/deletetc [name] - Delete a trainer card from the list of tcs that you have."],
	
	tchtml: function (target, room, user) {
	  if (!this.can('hotpatch')) return false;
      if (target.length < 2) return this.parse("/help tchtml");
      let name = Db('tc').get(target);

	  this.sendReply('<b>TC Code:</b> ' + name + '');
	  
   },
   tchtmlhelp: ["/tchtml [name] - Get the HTML code of a certain Trainer Card."],

/***************************************************
* Copied from Dragotic's VIP and Developer Commands *
****************************************************/
	tclist: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!Object.keys(Db('tc').object()).length) return this.errorReply('There seems to be no trainer cards present at the moment.');
		this.sendReplyBox('<center><b><u>Trainer Card List:</u></b></center>' + '<br /><br />' + Object.keys(Db('tc').object()).join('<br />'));
   },
};