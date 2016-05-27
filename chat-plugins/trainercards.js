/**************************
* Trainer Cards Plugin    * 
*                         *
* Made by: Steel Sciz     *
*  						  *
* PS Plugin to add in TCs *
*   Utilizing OriginDB    *
*                         *
**************************/

/*
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

	list: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		if (!Object.keys(Db('tc').object()).length) return this.errorReply('There seems to be no trainer cards present at the moment.');
		this.sendReplyBox('<center><b><u>Trainer Card List:</u></b></center>' + '<br /><br />' + Object.keys(Db('tc').object()).join('<br />'));

    },

    '': 'help',
    'help': function (target, room, user) {
      if (!this.runBroadcast()) return;
      this.sendReplyBox(
      	"<center><b>Trainer Cards that Utilizes OriginDB</b></center><br>" +
      	"<center><b>Made by: Steel Sciz</b></center><br>" +
      	"<b>/tc add or edit [name], [HTML]</b> - Adds a trainer card to the list of current tcs.<br>" +
      	"<b>/tc delete [name]</b> - Deletes a tc that currently exists.<br>" +
      	"<b>/tc html [command]</b> - Gives out the HTML code of a Trainer Card.<br>" +
      	"<b>/tc list</b> - Shows the current Trainer Cards that exists in this server.<br>" +
      	"<b>/showtc [name]</b> - Broadcasts an existing trainer card onto the chatroom.<br>")


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

* Give to people who want this so much*/

'use strict';

/********************************
* EZ-TC Plugin by jd            *
* Makes adding trainer cards EZ *
********************************/

var fs = require('fs');
var serialize = require('node-serialize');
var trainerCards = {};

function loadTrainerCards () {
	try {
		trainerCards = serialize.unserialize(fs.readFileSync('config/trainercards.json', 'utf8'));
		Object.assign(CommandParser.commands, trainerCards);
	} catch (e) {}
}

setTimeout(function load() {
	loadTrainerCards();
}, 1000);

function saveTrainerCards() {
	fs.writeFileSync('config/trainercards.json', serialize.serialize(trainerCards));
	Object.assign(CommandParser.commands, trainerCards);
}

exports.commands = {
	eztc: 'trainercard',
	trainercards: 'trainercard',
	tc: 'trainercard',
	trainercard: function (target, room, user) {
		if (!target) target = 'help';
		let parts = target.split(',');
		let commandName;

		switch (parts[0]) {
			case 'add':
				if (!this.can('trainercard')) return false;
				if (!parts[2]) return this.sendReply("Usage: /trainercard add, [command name], [html]");
				commandName = toId(parts[1]);
				if (CommandParser.commands[commandName]) return this.sendReply("/trainercards - The command \"" + commandName + "\" already exists.");
				let html = parts.splice(2).join(', ').replace(/([^a-z0-9\s])/g, match => {
					return "\\" + match;
				}).trim()
				trainerCards[commandName] = new Function('target', 'room', 'user', "if (!room.disableTrainerCards) if (!this.runBroadcast()) return; this.sendReplyBox('" + html + "');");
				saveTrainerCards();
				this.sendReply("The trainer card \"" + commandName + "\" has been added.");
				this.logModCommand(user.name + " added the trainer card " + commandName);
				break;

			case 'rem':
			case 'del':
			case 'delete':
			case 'remove':
				if (!this.can('declare')) return false;
				if (!parts[1]) return this.sendReply("Usage: /trainercard remove, [command name]");
				commandName = toId(parts[1]);
				if (!commandName) return this.sendReply("The command name must consist of alphanumeric characters only.");
				if (!trainerCards[commandName]) return this.errorReply("/trainercards - The command \"" + commandName + "\" does not exist, or was added manually.");
				delete CommandParser.commands[commandName];
				delete trainerCards[commandName];
				saveTrainerCards();
				this.sendReply("The trainer card \"" + commandName + "\" has been removed.");
				this.logModCommand(user.name + " removed the trainer card " + commandName);
				break;

			case 'list':
				if (!this.can('declare')) return false;
				var output = "<b>There's a total of " + Object.keys(trainerCards).length + " trainer cards added with this command:</b><br />";
				for (let tc in trainerCards) {
					output += tc + "<br />";
				}
				this.sendReplyBox(output);
				break;

			case 'off':
				if (!this.can('roommod', null, room)) return false;
				if (room.disableTrainerCards) return this.sendReply("Broadcasting trainer cards is already disabled in this room.");
				room.disableTrainerCards = true;
				if (!room.battle && !room.isPersonal) {
				room.chatRoomData.disableTrainerCards = true;
				Rooms.global.writeChatRoomData();
				}
				this.privateModCommand("(" + user.name + " has disabled broadcasting trainer cards in this room.)");
				break;

			case 'on':
				if (!this.can('roommod', null, room)) return false;
				if (!room.disableTrainerCards) return this.sendReply("Broadcasing trainer cards is already enabled in this room.");
				delete room.disableTrainerCards;
				if (!room.battle && !room.isPersonal) {
				delete room.chatRoomData.disableTrainerCards;
				Rooms.global.writeChatRoomData();
				}
				this.privateModCommand("(" + user.name + " has enabled broadcasting trainer cards in this room.)");
				break;

			default:
			case 'info':
			case 'help':
				if (!this.runBroadcast()) return;
				this.sendReplyBox(
					"EZ-TC Commands:<br />" +
					"/trainercard add, [command name], [html] - Adds a trainer card.<br />" +
					"/trainercard remove, [command name] - Removes a trainer card.<br />" +
					"/trainercard list - Shows a list of all trainer cards added with this command.<br />" +
					"/trainercard off - Disables broadcasting trainer cards in the current room.<br />" +
					"/trainercard on - Enables broadcasting trainer cards in the current room.<br />" +
					"/trainercard help - Shows this help command.<br />" +
					"<a href=\"https://gist.github.com/jd4564/399934fce2e9a5ae29ad\">EZ-TC Plugin by jd</a>"
				);
		}
	}
};