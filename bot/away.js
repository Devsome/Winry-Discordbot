const away = require('./../database/away.json');
var updatedR = false;
const utils   = require("./../bot/utils.js");

setInterval(() => {
	if (updatedR) {
		updatedR = false;
		utils.safeSave('database/away', '.json', JSON.stringify(away));
	}
}, 60000)

/*
Add Away:
	user: A user's ID
	text: The away text
*/
exports.addAway = function(user, text) {
	if (!user || !text) return;
	away[user] = {"user": user, "away": text};
	updatedR = true;
};

/*
Remove Away:
	user: A user's ID
*/
exports.removeAway = function(user) {
	if (!user) return;
	let found = false;
	Object.keys(away).map(t => {
		if (found) return;
		if (away[t].user == user) {
			delete away[t];
			updatedR = true;
			if (debug) console.log(cDebug("[DEBUG]") + "\tRemoved Away for user " + user);
			found = true;
		}
	});
};
