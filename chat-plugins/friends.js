/**********************************
* Friends Plugin
* Made by: Dragotic
* Inspired by Nii-sama to make this
***********************************/
'use strict';

const color = require('../config/color');

exports.commands = {
	friend: 'friends',
	friends: {
		add: function (target, room, user) {
			if (!this.canTalk()) return false;
			let friendName = toId(target);

			if (friendName.length >= 20) return this.errorReply('Usernames should be less than 19 characters.');
			if (!friendName) return this.parse('/help friends');
			if (!Db('friends').has(user.userid)) {
				Db('friends').set([user.userid, 'Friends'], []);
			}
			if (friendName === user.userid) return this.errorReply('I know you\'re lonely, but friending yourself ? really ?');
			if (Db('friends').object()[user.userid]['Friends'].indexOf(friendName) >= 0) return this.errorReply(friendName + ' is already a friend of yours!');
			Db('friends').object()[user.userid]['Friends'].push(friendName);
			this.sendReply(friendName + ' has been added to your friend list!');
			Db('friends').set();
		},
		remove: function (target, room, user) {
			if (!this.canTalk()) return false;
			let friendName = toId(target);

			if (friendName.length >= 20) return this.errorReply('Usernames should be less than 19 characters.');
			if (!friendName) return this.parse('/help friends');
			if (!Db('friends').has(user.userid)) return this.errorReply('You need to have friends :/');
			if (friendName === user.userid) return this.sendReply('Removing yourself from your friend list ? nice...');
			let index = Db('friends').object()[user.userid]['Friends'].indexOf(friendName);

			if (index < 0) return this.errorReply(friendName + ' isn\'t your friend.');
			Db('friends').object()[user.userid]['Friends'].splice(index, 1);
			this.sendReply(friendName + ' has been removed from your friend list...');
			Db('friends').set();
		},
		'': 'list',
		list: function (target, room, user) {
			if (!this.canTalk()) return false;
			if (!this.runBroadcast()) return false;
			target = toId(target);

			if (!target) target = user.userid;
			if (!Db('friends').has(target) || !Db('friends').has(target, 'Friends')) return this.errorReply(target + ' doesn\'t have any friends :/');
			let onlineFriends = [];
			let offlineFriends = [];

			for (let name in Db('friends').object()[target]['Friends']) {
				let friendName = Db('friends').object()[target]['Friends'][name];
				if (Users.get(friendName) && Users.get(friendName).connected) {
					onlineFriends.push('<button style="color: ' + color(friendName) + '; background: transparent; border: none; outline: none;" name="parseCommand" value="/user ' + Users.get(friendName).name + '"><b>' + Users.get(friendName).name + '</b></button>');
				} else {
					offlineFriends.push('<button style="color: ' + color(friendName) + '; background: transparent; border: none; outline: none;" name="parseCommand" value="/user ' + friendName + '"><b>' + friendName + '</b></button>');
				}
			}

			let display = '<div style="padding: 5px; overflow-y: scroll;"><div style="float: left; width: 40%; background: #73E247; border: 1px solid #000000; border-radius: 5px; box-shadow: inset 1px 1px 3px #FFFFFF; padding: 10px;"><center><font style="font-size: 10.5pt;">Online</font> (' + onlineFriends.length + ')</center><hr style="background-color: #1D4813; height: 1px; border: 0px; box-shadow: 1px 1px 1px #000000;"><div style="background: url(&quot;http://img13.deviantart.net/f801/i/2012/185/9/8/simple_wallpaper_by_thegese-d55zmcd.jpg&quot;) no-repeat; background-size: cover; border-radius: 5px; box-shadow: inset 1px 1px 1px #000000; padding: 10px 0px 10px 30px;">' + onlineFriends.join('<br />') + '</div></div>' + 
			'<div style="float: right; width: 40%; background: #F24061; border: 1px solid #000000; border-radius: 5px; box-shadow: inset 1px 1px 3px #FFFFFF; padding: 10px;"><center><font style="font-size: 10.5pt;">Offline</font> (' + offlineFriends.length + ')</center><hr style="background-color: #D00027; height: 1px; border: 0px; box-shadow: 1px 1px 1px #000000;"><div style="background: url(&quot;http://img13.deviantart.net/f801/i/2012/185/9/8/simple_wallpaper_by_thegese-d55zmcd.jpg&quot;) no-repeat; background-size: cover; border-radius: 5px; box-shadow: inset 1px 1px 1px #000000; padding: 10px 0px 10px 45px;">' + offlineFriends.join('<br />') + '</div></div><div style="clear: both;"></div></div>'; 
			
			this.sendReplyBox(display);
		},
	},
	friendshelp: ['The friends plugin accepts the following commands:',
	'/friend add [user] - Adds a friend to your friend list.',
	'/friend remove [user] - Removes a user from your friend list.',
	'/friend list - Displays your friend list.'],
};