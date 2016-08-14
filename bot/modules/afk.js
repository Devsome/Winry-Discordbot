/**
  * This is the afk Plugin
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");
const away  = require("./../../bot/away.js");
const awayDB  = require("./../../database/away.json");

var mod = {
  name: "afk",
  enabled: true,
  on: ["afk", "away"],
  usage: "<message>",
  description: "Is setting your away and the Bot is answering with a message",
  cooldown: 10,
  by: "Devsome",
  deleteCommand: true,
  process: function(clientBot, msg, suffix) {
    if(!suffix) {
      clientBot.sendMessage(msg.channel, msg.author + " What message should I send when you're AFK? Use the syntax `" + config.command_prefix + this.on + this.usage + "`");
    } else if(suffix==".") {
      if (debug) { console.log(cDebug("[DEBUG]") + "\t" + + msg.author.id + " deleted his away status"); }
      if (awayDB[msg.author.id].user.includes(msg.author.id)) {
        away.removeAway(msg.author.id);
        clientBot.sendMessage(msg.channel, msg.author + " OK, I won't show that message anymore.");
      } else {
        clientBot.sendMessage(msg.channel, msg.auhtor + " I didn't have an AFK message set for you in the first place. Use `" + config.command_prefix + this.on + this.usage + "`");
      }
    } else {
      if (awayDB[msg.author.id]) {
        if (awayDB[msg.author.id].user.includes(msg.author.id)) {
          clientBot.sendMessage(msg.channel, msg.author + " You have already a AFK message.");
        } else {
          away.addAway(msg.author.id, suffix);
          clientBot.sendMessage(msg.channel, msg.author + " saved. I will answer anyone who mention you");
        }
      } else { // only when the file is empty
        away.addAway(msg.author.id, suffix);
        clientBot.sendMessage(msg.channel, msg.author + " saved. I will answer anyone who mention you");
      }

    }
  }
};

module.exports = mod;
