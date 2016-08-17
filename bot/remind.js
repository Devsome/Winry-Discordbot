const reminders = require('./../database/reminders.json');
var updatedR = false;
const utils   = require("./../bot/utils.js");

setInterval(() => {
	if (updatedR) {
		updatedR = false;
		utils.safeSave('database/reminders', '.json', JSON.stringify(reminders));
	}
}, 60000)

/*
Add Reminder:
	user: A user's ID
	date: The date in milliseconds
	text: The reminder to be sent
*/
exports.addReminder = function(user, date, text) {
	if (!user || !date || !text) return;
	reminders[date] = {"user": user, "text": text};
	updatedR = true;
};

exports.countForUser = function(user) {
	let count = 0;
	Object.keys(reminders).map(date => {
		if (reminders[date].user == user) count++;
	});
	return count;
};

exports.listForUser = function(user) {
	let list = [];
	Object.keys(reminders).map(date => {
		if (reminders[date].user == user) {
			var timeLeft = Math.floor((parseInt(date) - new Date().getTime()) / 60000);
			var textLeft = (timeLeft * 60) < 60 ? 'less then a minute*' : timeLeft > 120 ? (Math.round(timeLeft / 60) > 72 ? Math.round((timeLeft / 60) / 24) + ' day(s) left*' : Math.round((timeLeft / 60)) + ' hour(s) left*') : Math.round(timeLeft) + ' minute(s) left*';
			list.push('\t' + reminders[date].text + '\t• *' + textLeft );
		}
	});
	return list;
};

exports.checkReminders = function(bot) {
	let now = Date.now();
	Object.keys(reminders).map(date => {
		if (date <= now) {
			let recipent = bot.users.get('id', reminders[date].user);
			if (recipent) bot.sendMessage(recipent, "⏰ **Reminder:** "+reminders[date].text);
			if (debug) console.log(cDebug("[DEBUG]") + "\tReminded user");
			delete reminders[date];
			updatedR = true;
		}
	});
};

/*
Remove Reminder:
	user: A user's ID
	text: The reminder to be removed
	success: function to run on completion
	fail: function to run if not found
*/
exports.removeReminder = function(text, user, success, fail) {
	if (!text || !user) return;
	let found = false;
	Object.keys(reminders).map(t => {
		if (found) return;
		if (reminders[t].user == user && (reminders[t].text).toLowerCase().includes(text.toLowerCase())) {
			delete reminders[t];
			updatedR = true;
			if (debug) console.log(cDebug("[DEBUG]") + "\tRemoved reminder for user " + user);
			found = true;
		}
	});
	if (found && typeof success == 'function') success();
	else if (!found && typeof fail == 'function') fail();
};
