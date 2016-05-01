/**
 *
 * Lottery.js Made By Dragotic.
 * A Lottery plugin that allows you to draw lottery and gain great rewards.
 */

'use strict';

const color = require('../config/color');
const MAX_TICKETS = 20;

// Stores all the lottery tickets
let allLotteryTickets = [];

global.getAllTickets = function() {
	if (!Object.keys(Db('tickets').object()).length) return false;
    // Get all the tickets.
	for (let i in Db('tickets').object()) {
	    for (let v in Db('tickets').object()[i]['Tickets']) {
    		allLotteryTickets.push(Db('tickets').object()[i]['Tickets'][v]);
	    }
	}
};

// Generates Tickets
function generateTicket() {
	let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let lotteryTicket = '';
	while (lotteryTicket.length < 8) {
		lotteryTicket += chars[Math.floor(Math.random() * chars.length)];
	}
	return lotteryTicket;
};

global.giveTicket = function (user) {
	user = toId(user);
	if (!user) return false;
	if (!Db('tickets').has(user)) {
		Db('tickets').set([user, 'Tickets'], []);
	}
	let generatedTicket = generateTicket();
	getAllTickets();
	// To avoid 2 tickets with same number
	while (allLotteryTickets.indexOf(generatedTicket) >= 0) {
	    generatedTicket = generateTicket();
	}
	Db('tickets').object()[user]['Tickets'].push(generatedTicket);
	// Add 5 bucks more to the pot
	Db('pots').set('lotteryPot', Db('pots').get('lotteryPot', 0) + 2);
	return generatedTicket;
};

function pickLottery() {
	if (!Object.keys(Db('tickets').object()).length) return false;
	// LOOPS EVERYWHERE KAPPA
	getAllTickets();
	let winningTicket = allLotteryTickets[Math.floor(Math.random() * allLotteryTickets.length)];
	let winningUser = '';
	
	// Get the winning user
	for (let user in Db('tickets').object()) {
		if (Db('tickets').object()[user]['Tickets'].indexOf(winningTicket) >= 0) {
		    winningUser = user;
		}
	}
	
	// Remove the current participants of lottery
	for (let u in Db('tickets').object()) {
		Db('tickets').delete(u)
	}
	
	// Return the user
	return [winningUser, winningTicket];
};

exports.commands = {

	tickets: 'ticket',
	ticket: {
		show: function (target, room, user) {
			if (!this.runBroadcast()) return false;
			if (!target) target = user.userid;
			target = toId(target);
			if (!Db('tickets').has(target)) return this.errorReply(target + ' has no tickets.');
			let userTickets = Db('tickets').object()[target]['Tickets'].join(', ');
			this.sendReplyBox('<center><b><u>' + Users.get(target).name + '\'s Tickets' + '</u></b></center><br />' + Db('tickets').object()[target]['Tickets'].join(', '));
		},
		give: function (target, room, user) {
			if (!this.can('makechatroom')) return false;
			if (!target) return this.parse('/help ticket');
			let ticketId = giveTicket(toId(target));
			this.sendReply(target + ' has been given a ticket with the id **' + ticketId + '**.');
		},
	},

	lottery: {
	    pick: function (target, room, user) {
	    	if (!this.can('makechatroom')) return false;
	        if (!Object.keys(Db('tickets').object()).length) return this.errorReply('No one seems to have bought tickets.');
	        let results = pickLottery();
	        let winningUser = results[0];
	        let winningTicket = results[1];
	        let userMoney = Db('money').get(toId(winningUser), 0);
	        let pot = Db('pots').get('lotteryPot', 0);
	        Db('money').set(toId(winningUser), userMoney + pot);
	        Db('pots').set('lotteryPot', 0);
			let msg = "<center><h2>Lottery!</h2><h4><br /><font color="+ color(user) +"><b>" + winningUser + "</b></font> has won the lottery with the ticket id of " + winningTicket + "! This user has gained " + pot + " bucks for winning the lottery.</h4></center>";
			this.parse('/gdeclare ' + msg);
		},

	    pot: function (target, room, user) {
	        if (!this.runBroadcast()) return false;
	        let pot = Db('pots').get('lotteryPot', 0);
	        this.sendReplyBox('<b>Current Pot Worth:</b> ' + pot + ' bucks.');
	    },
	},
};