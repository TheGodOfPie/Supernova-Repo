/*******************
* Bingo Plugin     *
* Made By: Dragotic*
********************/
'use strict';

let userCards = {};

let numbersCalled = [];

function generateNumbers() {
        let generatedNumbers = [];
        let numbers = {
                0: 15,
                1: 30,
                2: 45,
                3: 60,
                4: 75,
        };

        for (let numbersGenerated = 0; numbersGenerated < 25; numbersGenerated++) {
                let i = Math.floor(numbersGenerated / 5);

                // To gain a random number from specific range
                let eqOne = (i > 0 ? numbers[i--] : 1);
                let eqTwo = ((numbers[i]) - eqOne + 1);
                let generateNumber = Math.floor(Math.random() * eqTwo) + eqOne;

                // To ensure that the same number doesn't get repeated;
                if (generatedNumbers.length > 0) {
                        while (generatedNumbers.indexOf(generateNumber) >= 0) {
                                generateNumber = Math.floor(Math.random() * eqTwo) + eqOne;;
                        }
                }

                generatedNumbers.push(generateNumber)        
        }

        return generatedNumbers;
};

function generateCard(user) {
        let display = '<table border="1" cellpadding="1" cellspacing="1">';
        let generatedNumbers = userCards[user]['Numbers'];

        for (let i = 0; i < 25; i++) {
                // Get table display
                let tableBreak = false;

                if (i > 0 && tableBreak && i % 5 === 0) display += '</tr>';
                if (i % 5 === 0) {
                        display += '<tr>';
                        tableBreak = true;
                }
                display += '<td>' + generatedNumbers[i] + '</td>';
        }

        return display + '</table>';
};

function callNumbers() {
        let numberToCall = Math.floor(Math.random() * 75) + 1;
        if (numbersCalled.length > 0) {
                while (numbersCalled.indexOf(numberToCall) >= 0) {
                        numberToCall = Math.floor(Math.random() * 75) + 1;
                }
        }
        numbersCalled.push(numberToCall);
        return numberToCall;
};

function checkUserCards(numberCalled) {
        for (let i in userCards) {
                let index = userCards[i]['Numbers'].indexOf(numberCalled);
                if (index >= 0) {
                        userCards[i]['Numbers'][index] = '<font color="red">' + numberCalled + '</font>';
                        if (!userCards[i]['Called Numbers']) userCards[i]['Called Numbers'] = [];
                        userCards[i]['Called Numbers'].push(numberCalled);
                        if (userCards[i]['Called Numbers'].length === 25) return i;
                }
        }
};

exports.commands = {
        bingo: {
                join: function (target, room, user) {
                        if (userCards[user.userid]) return this.errorReply('You\'ve already joined the game of bingo!');

                        userCards[user.userid] = {};
                        userCards[user.userid]['Numbers'] = generateNumbers();

                        this.sendReplyBox(generateCard(user.userid));
                },
                start: function (target, room, user) {
                        //if (!Object.keys(userCards).length || Object.keys(userCards).length < 4) return this.errorReply('Needs at least 4 users to begin the game.');
                        this.add('A game of bingo is about to begin! Good Luck!!');
                        let loop = function () {
                                setTimeout(function() {
                                        let numberCalled = callNumbers();
                                        room.add('|c|' + '~Bingo Caller| I drew the number: ' + numberCalled);
                                        room.update();
                                        let winningUser = checkUserCards(numberCalled);
                                        console.log(winningUser);
                                        if (winningUser) {
                                                room.add('Congratulations to ' + winningUser + ' for winning!');
                                                room.update();
                                                userCards = {};
                                                numbersCalled = [];
                                                return;
                                        }
                                        loop();                                
                                }.bind(this), 1000 * 3);
                        };
                        loop();
                },
                status: function (target, room, user) {
                        this.sendReplyBox(generateCard(user.userid));
                },
        },
};
