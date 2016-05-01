'use strict';

let fs = require('fs');
let path = require('path');
let color = require('../config/color')
var bingoStatus = false;
var bingoNumbers = [];
var bingoSaidNumbers = {};
var actualValue = 0;
var tables = {};
var bingoPrize = 0;

let shop = [
	['Fix', 'Buys the ability to alter your current custom avatar or trainer card. (don\'t buy if you have neither)', 1],
	['Ticket', 'Buys a lottery ticket, that adds you to the lottery draw. You could win major bucks.', 2],
	['Avatar', 'Buys an custom avatar to be applied to your name (You supply. Images larger than 80x80 may not show correctly)', 5],
	['Symbol', 'Buys a custom symbol to go infront of name and puts you at top of userlist. (Temporary until restart, certain symbols are blocked)', 5],
	['Night Club', 'Buys access to enabling Night Club for your room so you can have a party all night with your friends!', 10],	
	['Trainer Card', 'Buys a trainer card which shows information through a command. (You supply, can be refused)', 10],
	['Custom Title', 'Buys a custom title that will be applied to your profile. (PM an Administrator (~) after purchase)', 15],
	['Declare', 'Buys a declare that will be broadcasted to all rooms. (Can be league advertisement, buck tours, etc)', 15],
 	['POTD', 'Buys the ability to set the Pokemon of the Day. The pokemon you set as POTD will be shown in Random Battles just for one day.', 20],
 	['PM', 'Buys a Global PM that will be broadcasted to all rooms. (Can be league advertisement, buck tours, etc)', 20],
	['Icon', 'Buy a custom icon that can be applied to the rooms you want. You must take into account that the provided image should be 32 x 32', 75],
	['Custom Emote', 'Buys a custom emote that will be added onto the list of emotes.', 50],
	['Custom Message', 'Buys a custom message which can be applied to your username and will be shown when you talk in the chat or talk in PMs.', 50],
	['Userlist Icon', 'Buys a userlist icon that can be applied to the userlist of 3 rooms.', 50],
	['Room Shop', 'Buys a room/league shop that will be applied onto your room. Use /help roomshop for more information in knowing how to manage the room shop once you bought it.', 55],
	['Custom Color', 'Buys a custom color which can be applied to your username and will be shown when you talk in the chat or talk in PMs.', 75],
];

let shopDisplay = getShopDisplay(shop);

/**
 * Gets an amount and returns the amount with the name of the currency.
 *
 * @examples
 * currencyName(0); // 0 bucks
 * currencyName(1); // 1 buck
 * currencyName(5); // 5 bucks
 *
 * @param {Number} amount
 * @returns {String}
 */
global.currencyName = function(amount) {
	let name = " buck";
	return amount === 1 ? name : name + "s";
}

/**
 * Checks if the money input is actually money.
 *
 * @param {String} money
 * @return {String|Number}
 */
global.isMoney = function(money) {
	let numMoney = Number(money);
	if (isNaN(money)) return "Must be a number.";
	if (String(money).includes('.')) return "Cannot contain a decimal.";
	if (numMoney < 1) return "Cannot be less than one buck.";
	return numMoney;
}

/**
 * Log money to logs/money.txt file.
 *
 * @param {String} message
 */
function logMoney(message) {
	if (!message) return;
	let file = path.join(__dirname, '../logs/money.txt');
	let date = "[" + new Date().toUTCString() + "] ";
	let msg = message + "\n";
	fs.appendFile(file, date + msg);
}

/**
 * Displays the shop
 *
 * @param {Array} shop
 * @return {String} display
 */
function getShopDisplay(shop) {
	let display = '<table style="width: 100%; border-top-right-radius: 4px; border-top-left-radius: 4px; background: rgba(230, 0, 115, 0.6)"' +
					'<tr><th color="#fff">Item</th><th color="#fff">Description</th><th color="white">Cost</th></tr>';
	let start = 0;
	while (start < shop.length) {
		display += "<tr>" +
						'<td style="background: rgba(128, 0, 64, 0.6); border: 1px solid black; padding: 5px; border-radius: 4px; text-align: center; color: white;"><button name="send" value="/buy ' + shop[start][0] + '" style="border: 1px solid black; background: #cc3399; color: black; padding: 2px; border-radius: 4px;">' + shop[start][0] + '</button>' + '</td>' +
						'<td style="background: rgba(128, 0, 64, 0.6); border: 1px solid black; padding: 5px; border-radius: 4px; text-align: center; color: white;">' + shop[start][1] + '</td>' +
						'<td style="background: rgba(128, 0, 64, 0.6); border: 1px solid black; padding: 5px; border-radius: 4px; text-align: center; color: white;">' + shop[start][2] + '</td>' +
		
					"</tr>";
		start++;
	}
	display += '</table><div style="border: 1px solid rgba(255, 26, 140, 0.6); border-top: none; background: rgba(255, 26, 140, 0.6); color: black; text-shadow: 0px 0px 2px ; padding: 5px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px;">To buy an item from the shop, use /buy command.</div>';
	return display;
}

/**
 * Casino Game: Bingo
 *
 * These functions are used for managing a game of bingo.
 *
 *
 */

function getUserName (user) {
	var targetUser = Users.get (user);
	if (!targetUser) return toId(user);
	return targetUser.name;
}

function getBingoNumbers() {
	var data = [];
	for (var i = 0; i < 50; ++i) {
		data.push(i + 1);
	}
	return data;
}

function checkBingo(room) {
	var winners = [];
	var endGame = false;
	var targetTable;
	var tableComplete;
	for (var i in tables) {
		targetTable = tables[i];
		tableComplete = 0
		for (var j = 0; j < targetTable.length; ++j) {
			if (!bingoSaidNumbers[targetTable[j]]) break;
			++tableComplete;
		}
		if (tableComplete === targetTable.length) {
			endGame = true;
			winners.push(i);
		}
	}
	if (endGame) {
		var winData = '';
		for (var n = 0; n < (winners.length - 1); ++n) {
				var amnt = Db('money').get(winners[n]);
				var tt = Db('money').set(winners[n], amnt + bingoPrize).get(winners[n]);
			//Shop.giveMoney(toId(winners[n]), bingoPrize);
			if (n === 0) {
				winData += getUserName(winners[n]);
			} else {
				winData += ', ' + getUserName(winners[n]);
			}
		}
				var amnt = Db('money').get(toId(winners[winners.length - 1]));
				var tt = Db('money').set(toId(winners[winners.length - 1]), amnt + bingoPrize).get(winners[winners.length - 1]);
		//Shop.giveMoney(toId(winners[winners.length - 1]), bingoPrize);
		if (winners.length > 1) winData += ' et ';
		winData += getUserName(winners[winners.length - 1]);
		room.addRaw("<div class=\"broadcast-blue\"><b><h1>Someone has gotten a Bingo!<h1></b><br />Congratulations to  " + winData + " for winning the game of Bingo. He has won " + bingoPrize + " bucks for winning!</div>");
		room.update();
		bingoStatus = false;
	}
}


/**
 * Find the item in the shop.
 *
 * @param {String} item
 * @param {Number} money
 * @return {Object}
 */
function findItem(item, money) {
	let len = shop.length;
	let price = 0;
	let amount = 0;
	while (len--) {
		if (item.toLowerCase() !== shop[len][0].toLowerCase()) continue;
		price = shop[len][2];
		if (price > money) {
			amount = price - money;
			this.errorReply("You don't have you enough money for this. You need " + amount + currencyName(amount) + " more to buy " + item + ".");
			return false;
		}
		return price;
	}
	this.errorReply(item + " not found in shop.");
}

/**
 * Handling the bought item from the shop.
 *
 * @param {String} item
 * @param {Object} user
 * @param {Number} cost - for lottery
 */
function handleBoughtItem(item, user, cost) {
	if (item === 'symbol') {
		user.canCustomSymbol = true;
		this.sendReply("You have purchased a custom symbol. You can use /customsymbol to get your custom symbol.");
		this.sendReply("You will have this until you log off for more than an hour.");
		this.sendReply("If you do not want your custom symbol anymore, you may use /resetsymbol to go back to your old symbol.");
    } else if (item === 'pm') {
        user.canShopPM = true;
        this.sendReply('You have purchased a pm. You can use /shoppm to declare your message.');  
    } else if (item === 'declare') {
        user.canShopDeclare = true;
        this.sendReply('You have purchased a declare. You can use /shopdeclare to declare your message.');
	} else if (item === 'userlisticon') {
		this.sendReply('You purchased an icon, contact an administrator to obtain the icon.');
	} else if (item === 'customcolor') {
		this.sendReply('You purchased an Custom Color, contact an administrator to obtain the color.');
    } else if (item === 'potd') {
        user.setpotd = true;
        this.sendReply("You have bought the ability to set the POTD of the day.");
        this.sendReply("Use /setpotd [pokémon] to set the Pokémon of the day.");
	} else if (item === 'ticket') {
		let generatedTicket = giveTicket(user.userid);
		this.sendReplyBox('You have bought a ticket: <b>' + generatedTicket + '</b>. Use /tickets to see how many tickets do you have.');
	} else {
		let msg = '**' + user.name + " has bought " + item + ".**";
		Rooms.rooms.staff.add('|c|~Shop Alert|' + msg);
		Rooms.rooms.staff.update();
		Users.users.forEach(function (user) {
			if (user.group === '~' || user.group === '&') {
				user.send('|pm|~Shop Alert|' + user.getIdentity() + '|' + msg);
			}
		});
	}
}

exports.commands = {
	atm: 'wallet',
	purse: 'wallet',
	wallet: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) target = user.name;

		const amount = Db('money').get(toId(target), 0);
		this.sendReplyBox(Tools.escapeHTML(target) + " has " + amount + currencyName(amount) + ".");
	},
	wallethelp: ["/wallet [user] - Shows the amount of money a user has."],

	givebuck: 'givemoney',
	givebucks: 'givemoney',
	givemoney: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help givemoney');

		let parts = target.split(',');
		let username = parts[0];
		let amount = isMoney(parts[1]);

		if (typeof amount === 'string') return this.errorReply(amount);

		let total = Db('money').set(toId(username), Db('money').get(toId(username), 0) + amount).get(toId(username));
		amount = amount + currencyName(amount);
		total = total + currencyName(total);
		this.sendReply(username + " was given " + amount + ". " + username + " now has " + total + ".");
		if (Users.get(username)) Users(username).popup(user.name + " has given you " + amount + ". You now have " + total + ".");
		logMoney(username + " was given " + amount + " by " + user.name + ". " + username + " now has " + total);
	},
	givemoneyhelp: ["/givemoney [user], [amount] - Give a user a certain amount of money."],

	takebuck: 'takemoney',
	takebucks: 'takemoney',
	takemoney: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help takemoney');

		let parts = target.split(',');
		let username = parts[0];
		let amount = isMoney(parts[1]);

		if (typeof amount === 'string') return this.errorReply(amount);

		let total = Db('money').set(toId(username), Db('money').get(toId(username), 0) - amount).get(toId(username));
		amount = amount + currencyName(amount);
		total = total + currencyName(total);
		this.sendReply(username + " losted " + amount + ". " + username + " now has " + total + ".");
		if (Users.get(username)) Users(username).popup(user.name + " has taken " + amount + " from you. You now have " + total + ".");
		logMoney(username + " had " + amount + " taken away by " + user.name + ". " + username + " now has " + total);
	},
	takemoneyhelp: ["/takemoney [user], [amount] - Take a certain amount of money from a user."],

	resetbuck: 'resetmoney',
	resetbucks: 'resetmoney',
	resetmoney: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		Db('money').set(toId(target), 0);
		this.sendReply(target + " now has 0 bucks.");
		logMoney(user.name + " reset the money of " + target + ".");
	},
	resetmoneyhelp: ["/resetmoney [user] - Reset user's money to zero."],

	transfer: 'transfermoney',
	transferbuck: 'transfermoney',
	transferbucks: 'transfermoney',
	transfermoney: function (target, room, user) {
		if (!target || target.indexOf(',') < 0) return this.parse('/help transfermoney');

		let parts = target.split(',');
		let username = parts[0];
		let uid = toId(username);
		let amount = isMoney(parts[1]);

		if (toId(username) === user.userid) return this.errorReply("You cannot transfer to yourself.");
		if (username.length > 19) return this.errorReply("Username cannot be longer than 19 characters.");
		if (typeof amount === 'string') return this.errorReply(amount);
		if (amount > Db('money').get(user.userid, 0)) return this.errorReply("You cannot transfer more money than what you have.");

		Db('money')
			.set(user.userid, Db('money').get(user.userid) - amount)
			.set(uid, Db('money').get(uid, 0) + amount);

		let userTotal = Db('money').get(user.userid) + currencyName(Db('money').get(user.userid));
		let targetTotal = Db('money').get(uid) + currencyName(Db('money').get(uid));
		amount = amount + currencyName(amount);

		this.sendReply("You have successfully transferred " + amount + ". You now have " + userTotal + ".");
		if (Users.get(username)) Users(username).popup(user.name + " has transferred " + amount + ". You now have " + targetTotal + ".");
		logMoney(user.name + " transferred " + amount + " to " + username + ". " + user.name + " now has " + userTotal + " and " + username + " now has " + targetTotal + ".");
	},
	transfermoneyhelp: ["/transfer [user], [amount] - Transfer a certain amount of money to a user."],

	store: 'shop',
	shop: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReply("|raw|" + shopDisplay);
	},
	shophelp: ["/shop - Display items you can buy with money."],

	buy: function (target, room, user) {
		if (!target) return this.parse('/help buy');
		let amount = Db('money').get(user.userid, 0);
		let cost = findItem.call(this, target, amount);
		if (!cost) return;
		// Adds limit for tickets here
		if (toId(target) === 'ticket') {
			if (Db('tickets').has(toId(user))) {
				if (Db('tickets').object()[toId(user)]['Tickets'].length >= 15) return this.errorReply('You can only have a maximum of 15 tickets at a moment.');
			}
		}
		let total = Db('money').set(user.userid, amount - cost).get(user.userid);
		this.sendReply("You have bought " + target + " for " + cost +  currencyName(cost) + ". You now have " + total + currencyName(total) + " left.");
		room.addRaw(user.name + " has bought <b>" + target + "</b> from the shop.");
		logMoney(user.name + " has bought " + target + " from the shop. This user now has " + total + currencyName(total) + ".");
		handleBoughtItem.call(this, target.toLowerCase(), user, cost);
	},
	buyhelp: ["/buy [command] - Buys an item from the shop."],

	customsymbol: function (target, room, user) {
		if (!user.canCustomSymbol && user.id !== user.userid) return this.errorReply("You need to buy this item from the shop.");
		if (!target || target.length > 1) return this.parse('/help customsymbol');
		if (target.match(/[A-Za-z\d]+/g) || '|?!+$%@\u2605=&~#\u03c4\u00a3\u03dd\u03b2\u039e\u03a9\u0398\u03a3\u00a9'.indexOf(target) >= 0) {
			return this.errorReply("Sorry, but you cannot change your symbol to this for safety/stability reasons.");
		}
		user.customSymbol = target;
		user.updateIdentity();
		user.canCustomSymbol = false;
		user.hasCustomSymbol = true;
	},
	customsymbolhelp: ["/customsymbol [symbol] - Get a custom symbol."],

	resetcustomsymbol: 'resetsymbol',
	resetsymbol: function (target, room, user) {
		if (!user.hasCustomSymbol) return this.errorReply("You don't have a custom symbol.");
		user.customSymbol = null;
		user.updateIdentity();
		user.hasCustomSymbol = false;
		this.sendReply("Your symbol has been reset.");
	},
	resetsymbolhelp: ["/resetsymbol - Resets your custom symbol."],

	moneylog: function (target, room, user, connection) {
		if (!this.can('modlog')) return;
		target = toId(target);
		let numLines = 15;
		let matching = true;
		if (target.match(/\d/g) && !isNaN(target)) {
			numLines = Number(target);
			matching = false;
		}
		let topMsg = "Displaying the last " + numLines + " lines of transactions:\n";
		let file = path.join(__dirname, '../logs/money.txt');
		fs.exists(file, function (exists) {
			if (!exists) return connection.popup("No transactions.");
			fs.readFile(file, 'utf8', function (err, data) {
				data = data.split('\n');
				if (target && matching) {
					data = data.filter(function (line) {
						return line.toLowerCase().indexOf(target.toLowerCase()) >= 0;
					});
				}
				connection.popup('|wide|' + topMsg + data.slice(-(numLines + 1)).join('\n'));
			});
		});

    },

    shopdeclare: function (target, room, user) {
        if (!user.canShopDeclare) return this.errorReply('You need to buy this item from the shop to use.');
        if (!target) return this.sendReply('/shopdeclare [message] - Send message to all rooms.');

        for (var id in Rooms.rooms) {
            if (id !== 'global') {
                Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>' + target + '</b></div>');
            }
        }
        this.logModCommand(user.name + " globally declared " + target);
        user.canShopDeclare = false;
    },
 
 	serverpm: 'shoppm',
	shoppm: function (target, room, user) {
        if (!user.canShopPM) return this.errorReply('You need to buy this item from the shop to use.');
        if (!target) return this.sendReply('/shoppm [message] - PM all users in the server.');
        if (target.indexOf('/html') >= 0) return this.sendReply('Cannot contain /html.');

		let pmName = ' Server Shop PM';

		Users.users.forEach(function (user) {
			let message = '|pm|' + pmName + '|' + user.getIdentity() + '|' + target;
			user.send(message);
			});
        
        user.canShopPM = false;

    },

    setpotd: function (target, room, user) {
        if (!user.setpotd) return this.errorReply("You need to buy this item from the shop to use.");
        if (user.alreadysetpotd) return this.sendReply("The POTD was already set.");
 
        Config.potd = target;
        Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
        if (!target) return this.sendRepply("You need to choose a Pokémon to set as the POTD.");
        if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokémon of the Day is now ' + target + '!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>');
        this.logModCommand('The Pokemon of the Day was changed to ' + target + ' by ' + user.name + '.');
        user.setpotd = false;
        user.alreadysetpotd = true;

	},

	newbingo: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Bingo can only be played in the Casino.");
		if (room.game) return this.errorReply("There is already a game of " + room.game.title + " in progress in this room.");
		if (!this.can('minigame', null, room)) return false;
		if (bingoStatus) return this.sendReply("There is no ongoing Bingo game taking place.");
		bingoStatus = true;
		bingoNumbers = getBingoNumbers().randomize();
		bingoSaidNumbers = {};
		actualValue = 0;
		tables = {};
		bingoPrize = 0;
		this.privateModCommand('(' + user.name + ' has started a game of Bingo.)');
		room.addRaw("<div class=\"broadcast-blue\"><b>A Bingo game has started!</b><br />To participate, 15 bucks are required for you to buy a table (using /buytable).<br><center><button name='send' value='/buytable'>Join the Bingo Game!</button></center></div>");
		Rooms('lobby').add("|raw|<div class=\"broadcast-blue\"><center>A session of <b>Bingo</b> is being played in the <button name=\"joinRoom\" value=" + room.id +">" + room.title + "</button>!</center></div>");
		Rooms('lobby').update();
		room.update();
		var loop = function () {
			setTimeout(function () {
				if (!bingoStatus) return;
				if (actualValue >= bingoNumbers.length) {
					bingoStatus = false;
		            clearRoom(room);
					room.addRaw("<div class=\"broadcast-blue\"><b>Bingo has been terminated!</b><br />Try again after sometime.</div>");
					room.update();
					return;
				}
				room.add('|c| [Bingo Game]|**Bingo:** Number chosen: **' + bingoNumbers[actualValue] + '**');
				bingoSaidNumbers[bingoNumbers[actualValue]] = 1;
				++actualValue;
				room.update();
				checkBingo(room);
				loop();
			}, 1000 * 3);
		};
		loop();
	},
	

	buytable: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Bingo Commands can only be played in Casino.");
		if (!bingoStatus) return this.sendReply("There is no ongoing Bingo game taking place.");
		if (tables[user.userid]) return this.sendReply("You have already purchased a Bingo ticket.");
		var amount = Db('money').get(user.userid, 0);
		if (amount < 15) return this.sendReply("You do not have enough bucks to buy a table.");
		var cost = 15;
		var total = Db('money').set(user.userid, amount - cost).get(user.userid);

		//if (Shop.getUserMoney(user.name) < 10) return this.sendReply("Vous n'avez pas assez d'argent.");
		//Shop.removeMoney(user.name, 10);
		//Shop.giveMoney('casino', 5);
		var numbers = getBingoNumbers().randomize();
		var cells = [];
		for (var i = 0; i < 5; ++i) {
			cells.push(numbers[i]);
		}
		tables[user.userid] = cells;
		bingoPrize += 15;
		this.sendReply("You have bought a ticket in order to participate in bingo. Type /bingo to see the current status of your table after the game of Bingo begins.");
		this.parse('/bingo');
		checkBingo(room);
	},
	
	bingo: function (target, room, user) {
		if (room.id !== 'casino') return this.sendReply("Bingo Commands can only be played in Casino.");
		if (!this.canBroadcast()) return;
		if (!bingoStatus) return this.sendReply("There is no ongoing Bingo game taking place.");
		var targetUserId = user.userid;
		if (tables[toId(target)]) targetUserId = toId(target);
		if (tables[targetUserId]) {
			var html = '<b>Bingo Table of</b>: ' + getUserName(targetUserId) + '<br /><br />';
			html += '<table border="1" cellspacing="0" cellpadding="3" target="_blank"><tbody><tr>';
			for (var n = 0; n < tables[targetUserId].length; ++n) {
				if (!bingoSaidNumbers[tables[targetUserId][n]]) {
					html += '<td><center><b>' + tables[targetUserId][n] + '</b></center></td>';
				} else {
					html += '<td><center><font color="red"><b>' + tables[targetUserId][n] + '</b></font></center></td>';
				}
			}
			html += '</tr></tbody></table><br />';
		} else {
			var html = 'You need to purchase a ticket to participate in the current game of bingo. Do /buytable before it begins.<br /><br />';
		}
		html += '<b>Pot Money: </b>' + bingoPrize + ' bucks.';
		this.sendReplyBox(html);

    },

	moneyladder: 'richestuser',
	richladder: 'richestuser',
	richestusers: 'richestuser',
	richestuser: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let display = '<center><u><b>Richest Users</b></u></center><br><table border="1" cellspacing="0" cellpadding="5" width="100%"><tbody><tr><th>Rank</th><th>Username</th><th>Money</th></tr>';
		let keys = Object.keys(Db('money').object()).map(function (name) {
			return {name: name, money: Db('money').get(name)};
		});
		if (!keys.length) return this.sendReplyBox("Money ladder is empty.");
		keys.sort(function (a, b) {
			return b.money - a.money;
		});
		keys.slice(0, 10).forEach(function (user, index) {
			display += "<tr><td>" + (index + 1) + "</td><td>" + user.name + "</td><td>" + user.money + "</td></tr>";
		});
		display += "</tbody></table>";
		this.sendReply("|raw|" + display);

     },	
/***********
    Dice
************/
	dicegame: 'startdice',
	dicestart: 'startdice',
	startdice: function (target, room, user) {
        if (room.id !== 'casino') return this.errorReply('Dice games can only be played in Casino.');
		if (!this.can('broadcast', null, room)) return false;
		if (!target) return this.parse('/help startdice');
		if (!this.canTalk()) return this.errorReply("You can not start dice games while unable to speak.");

		let amount = isMoney(target);

		if (typeof amount === 'string') return this.errorReply(amount);
		if (!room.dice) room.dice = {};
		if (room.dice.started) return this.errorReply("A dice game has already started in this room.");

		room.dice.started = true;
		room.dice.bet = amount;
		// Prevent ending a dice game too early.
		room.dice.startTime = Date.now();

		room.addRaw('<div class="infobox"><h2><center><font color="' + color(user.userid) + '">' + user.name + '</font> <font color=black>has started a dice game for </font><font color="purple">' + target + 
	 	         	' </font><font color=black>' + ((target === 1) ? " buck." : " bucks.") + '</font><br /><button class=supernova-button name="send" value="/joindice">Join the dice.</button></center></h2></div>');
	},
	startdicehelp: ["/startdice [bet] - Start a dice game to gamble for money."],

	joindice: function (target, room, user) {
        if (room.id !== 'casino') return this.errorReply('Dice games can only be played in Casino.');
		if (!room.dice || (room.dice.p1 && room.dice.p2)) return this.errorReply("There is no dice game in it's signup phase in this room.");
		if (!this.canTalk()) return this.errorReply("You may not join dice games while unable to speak.");
		if (room.dice.p1 === user.userid) return this.errorReply("You already entered this dice game.");
		if (Db('money').get(user.userid, 0) < room.dice.bet) return this.errorReply("You don't have enough bucks to join this game.");
		Db('money').set(user.userid, Db('money').get(user.userid) - room.dice.bet);
		if (!room.dice.p1) {
			room.dice.p1 = user.userid;
			room.addRaw("<font color=" + color(user.userid) +"><b>" + user.name + " </font><b>has joined the dice game.</b>");
			return;
		}
		room.dice.p2 = user.userid;
		room.addRaw("<font color=" + color(user.userid) +"><b>" + user.name + " </font><b>has joined the dice game.</b>");
		let p1Number = Math.floor(6 * Math.random()) + 1;
		let p2Number = Math.floor(6 * Math.random()) + 1;
		let output = "<div class='infobox'>Game has two players, starting now.<br>Rolling the dice.<br>" + room.dice.p1 + " has rolled a " + p1Number + ".<br>" + room.dice.p2 + " has rolled a " + p2Number + ".<br>";
		while (p1Number === p2Number) {
			output += "Tie... rolling again.<br>";
			p1Number = Math.floor(6 * Math.random()) + 1;
			p2Number = Math.floor(6 * Math.random()) + 1;
			output += room.dice.p1 + " has rolled a " + p1Number + ".<br>" + room.dice.p2 + " has rolled a " + p2Number + ".<br>";
		}
		let winner = room.dice[p1Number > p2Number ? 'p1' : 'p2'];
		output += "<font color='purple'><b>" + winner + "</b></font> has won <font color=purple><b>" + room.dice.bet + "</b></font>" + currencyName(room.dice.bet) + ".<br>Better luck next time " + room.dice[p1Number < p2Number ? 'p1' : 'p2'] + "!</div>";
		room.addRaw(output);
		Db('money').set(winner, Db('money').get(winner, 0) + room.dice.bet * 2);
		delete room.dice;
	},

	enddice: function (target, room, user) {
        if (room.id !== 'casino') return this.errorReply('Dice games can only be played in Casino.');
		if (!user.can('broadcast', null, room)) return false;
		if (!room.dice) return this.errorReply("There is no dice game in this room.");
		if ((Date.now() - room.dice.startTime) < 15000 && !user.can('broadcast', null, room)) return this.errorReply("Regular users may not end a dice game within the first minute of it starting.");
		if (room.dice.p2) return this.errorReply("Dice game has already started.");
		if (room.dice.p1) Db('money').set(room.dice.p1, Db('money').get(room.dice.p1, 0) + room.dice.bet);
		room.addRaw("<font color=" + color(user.userid) +"><b>" + user.name + " </font><b>ended the dice game.</b>");
		delete room.dice;

	},

	bucks: 'economystats',
	economystats: function (target, room, user) {
		if (!this.runBroadcast()) return;
		const users = Object.keys(Db('money').object());
		const total = users.reduce(function (acc, cur) {
			return acc + Db('money').get(cur);
		}, 0);
		let average = Math.floor(total / users.length);
		let output = "There is " + total + currencyName(total) + " circulating in the economy. ";
		output += "The average user has " + average + currencyName(average) + ".";
		this.sendReplyBox(output);
	},

};
