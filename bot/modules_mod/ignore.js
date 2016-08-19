/**
  * This is the ignore Channel Plugin
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");

var mod = {
  name: "ignore",
  enabled: true,
  on: ["ignore"],
  usage: "",
  description: "Put a channel on silence",
  cooldown: 3,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg) {
    if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer")) { clientBot.sendMessage(msg, "You must have permission to manage the server!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (!ServerSettings.hasOwnProperty(msg.channel.server.id)) db.addServer(msg.channel.server);
    if (ServerSettings[msg.channel.server.id].ignore.includes(msg.channel.id)) clientBot.sendMessage(msg, 'This channel is already ignored', (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); });
    else {
      db.ignoreChannel(msg.channel.id, msg.channel.server.id);
      clientBot.sendMessage(msg, "🔇 Ok, I'll ignore normal commands here now.");
    }
  }
};

module.exports = mod;
