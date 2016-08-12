/**
  * This is the remind me Plugin
  */
const config  = require("./../../config/config.json");
const db      = require("./../../bot/db.js");
const remind  = require("./../../bot/remind.js");
const utils   = require("./../../bot/utils.js");

var mod = {
  name: "remind",
  enabled: true,
  on: ["remind", "rm"],
  usage: "<reminder> in <0 days/hours/minutes or seconds> | remove <text in reminder> | list",
  description: "Will remind you when the time is expired",
  cooldown: 3,
  by: "Devsome",
  process: function(clientBot, msg, suffix) {
    if (/^remove/i.test(suffix)) {

      if (suffix.length > 7) {
        remind.removeReminder(suffix.replace(/^remove /i, ''), msg.author.id, () => {
          clientBot.sendMessage(msg.author, "Successfully removed reminder 👍");
        }, () => {
          clientBot.sendMessage(msg.author, "No matching reminder found 👎");
        });
      } else {
        let list = remind.listForUser(msg.author.id);
        if (list && list.length > 0) clientBot.sendMessage(msg.author, "__Use `" + config.command_prefix + "remind remove ` + the text from the reminder you wish to remove:__\n"+list.join('\n'));
        else clientBot.sendMessage(msg.author, "Looks like you don't have any reminders!");
      }

    } else if (suffix.toLowerCase() === 'list') {

      let list = remind.listForUser(msg.author.id);
      if (list && list.length > 0) clientBot.sendMessage(msg.author, "__Here are your reminders:__\n"+list.join('\n'));
      else clientBot.sendMessage(msg.author, "Looks like you don't have any reminders!");

    } else if (/^.* in( ((\d\d?\d?|a|one|two|three) ?d[ays]*)( and| &|,)?)?( ((\d\d?\d?|a|an|one|two|three) ?h[ours]*)( and| &|,)?)?( ((\d\d?\d?|a|one|two|three) ?m[inutes]*)( and| &|,)?)?( (\d\d?\d?|a|one|two|three) ?s[econds]*)?$/i.test(suffix)) {

      if (remind.countForUser(msg.author.id) >= 5) {
        clientBot.sendMessage(msg.author, "You can't add any more reminders because you already have 5. You can remove a reminder to make space with `" + config.command_prefix + "remind remove <text>`");
        return;
      }

      let millisecs = 0,
        timeString = suffix.replace(/.* in /i, '');
      if (/ ((\d\d?\d?\d?\d?|a|one|two|three) ?s[econds]*)$/i.test(suffix)) {
        millisecs += timeParser(/((\d\d?\d?\d?\d?|a|one|two|three) ?s[econds]*)$/i.exec(suffix)[2] + "", 1000);
        suffix = suffix.replace(/( and| &|,)? ((\d\d?\d?\d?\d?|a|one|two|three) ?s[econds]*)$/i, '');
      }
      if (/ ((\d\d?\d?|a|one|two|three) ?m[inutes]*)$/i.test(suffix)) {
        millisecs += timeParser(/((\d\d?\d?|a|one|two|three) ?m[inutes]*)$/i.exec(suffix)[2] + "", 60000);
        suffix = suffix.replace(/( and| &|,)? ((\d\d?\d?|a|one|two|three) ?m[inutes]*)$/i, '');
      }
      if (/ ((\d\d?\d?|a|an|one|two|three) ?h[ours]*)$/i.test(suffix)) {
        millisecs += timeParser(/((\d\d?\d?|a|an|one|two|three) ?h[ours]*)$/i.exec(suffix)[2] + "", 3600000);
        suffix = suffix.replace(/( and| &|,)? ((\d\d?\d?|a|an|one|two|three) ?h[ours]*)$/i, '');
      }
      if (/ ((\d\d?\d?|a|one|two|three) ?d[ays]*)$/i.test(suffix)) {
        let hours = /((\d\d?\d?|a|one|two|three) ?d[ays]*)$/i.exec(suffix)[2];
        if (/\d\d\d?/.test(hours)) {
          if (hours > 14) {
            clientBot.sendMessage(msg, "There is a 14 day limit on reminders", (e, m) => {clientBot.deleteMessage(m, {"wait": 10000});});
            return;
          }
        }
        millisecs += timeParser(hours + "", 86400000);
        suffix = suffix.replace(/( and| &|,)? ((\d|a|one|two|three) ?d[ays]*)$/i, '');
      }
      if (millisecs > 1209600000) {
        clientBot.sendMessage(msg, "There is a 14 day limit on reminders", (e, m) => {clientBot.deleteMessage(m, {"wait": 10000});});
        return;
      } else if (millisecs <= 0) {
        clientBot.sendMessage(msg, "You must specify a time in the future", (e, m) => {clientBot.deleteMessage(m, {"wait": 10000});});
        return;
      }

      let reminder = suffix.replace(/^(me )?(to )?/i, '').replace(/in ?$/i, '').trim();
      remind.addReminder(msg.author.id, Date.now() + millisecs, reminder);
      clientBot.sendMessage(msg, "⏰ Got it! I'll remind you in " + timeString);

    } else utils.correctUsage("remind", this.usage, msg, clientBot, config.command_prefix, 15000);
  }
};

function timeParser(ammount, mod) {
	switch (ammount) {
		case "a": case "an": case "one": case "1": //js pls
			return 1 * mod;
		case "two": case "2":
			return 2 * mod;
		case "three": case "3":
			return 3 * mod;
		default:
			return parseInt(ammount) * mod;
	}
}

module.exports = mod;
