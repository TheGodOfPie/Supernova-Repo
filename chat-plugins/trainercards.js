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
   tc: 'trainercard',
   trainercard: {

    edit: 'add',
	add: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/tc help');

		let parts = target.split(',');
		let name = toId(parts[0]);
		let tc = parts.slice(1).join(", ").trim();

		Db('tc').set(name, tc);
		
		this.sendReply("The trainer Card " + name + " has been set.");
		logTc(user.name + " has added the following Trainer Card: " + name + ".");

    },
   

	delete: function (target, room, user) {
	  if (!this.can('hotpatch')) return false;
      if (target.length < 1) return this.parse("/tc help");

      let tc = toId(target);

 	  if (!Db('tc').has(tc)) return this.errorReply('This trainer card does not exist.');
      let name = Db('tc').get(target);

      Db('tc').delete(target);

      this.sendReply('You have successfully deleted the Trainer Card ' + target + '.');

    },
	
	html: function (target, room, user) {
	  if (!this.can('hotpatch')) return false;
      if (Db('tc').has(user.userid)) return this.errorReply('The trainer card does not exist.');
      if (target.length < 1) return this.parse("/tc help");
      let name = Db('tc').get(target);

	  this.sendReply('TC Code: ' + name + '');
	  
   },

/***************************************************
* Copied from Dragotic's VIP and Developer Commands *
****************************************************/
	list: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!Object.keys(Db('tc').object()).length) return this.errorReply('There seems to be no trainer cards present at the moment.');
		this.sendReplyBox('<center><b><u>Trainer Card List:</u></b></center>' + '<br /><br />' + Object.keys(Db('tc').object()).join('<br />'));

    },

    'help': function (target, room, user) {
      if (!this.runBroadcast()) return;
      this.sendReplyBox(
      	"<b>/tc add or edit [name], [HTML]</b> - Adds a trainer card to the list of current tcs." +
      	"<b>/tc delete [name]</b> - Deletes a tc that currently exists." +
      	"<b>/tc html [command]</b> - Gives out the HTML code of a Trainer Card." +
      	"<b>/tc list</b> - Shows the current Trainer Cards that exists in this server." +
      	"<b>/showtc [name] - Broadcasts an existing trainer card onto the chatroom.")
},

   },

    
    showtc: function (target, room, user) {
      if (!this.runBroadcast()) return; 
	  if (target.length < 1) return this.parse("/tc help"); 
      let tc = toId(target);
 	  if (!Db('tc').has(tc)) return this.errorReply('This trainer card does not exist.');
	  let name = Db('tc').get(target);         
      this.sendReplyBox('' + name + '');

},

};