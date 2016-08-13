/**
  * This is the choose Plugin
  */
const config  = require("./../../config/config.json");
const utils   = require("./../../bot/utils.js");

var mod = {
  name: "choose",
  enabled: true,
  on: ["choose", "ch"],
  usage: "<option 1> | <option 2> | [option 3] ...",
  description: "Change the current playing game",
  cooldown: 20,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg, suffix) {
    if (!suffix) {
			utils.correctUsage("choose", this.usage, msg, clientBot, config.command_prefix);
			return;
		}
		let choices = suffix.split(/ ?\| ?/);
		if (choices.length < 2 && suffix.includes(',')) choices = suffix.split(/, ?/);
		if (choices.length < 2) utils.correctUsage("choose", this.usage, msg, clientBot, config.command_prefix);
		else {
			let choice = Math.floor(Math.random() * (choices.length));
			choices.forEach((c, i) => {
				if (c.includes('homework') || c.includes('sleep') || c.includes('study') || c.includes('productiv')) {
					if (Math.random() > 0.3) choice = i;
				}
			});
			clientBot.sendMessage(msg, "I chose **" + choices[choice].replace(/@/g, '@\u200b') + "**");
		}
  }
};

module.exports = mod;
