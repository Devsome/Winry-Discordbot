/**
  * This is the unignore Channel Plugin
  * By using this the mod can mark channels as unignored
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");

var mod = {
  name: "unignore",
  enabled: true,
  on: ["unignore"],
  usage: "",
  description: "Delete a channel from being ignored",
  cooldown: 3,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg) {
    if (msg.channel.isPrivate) { bot.sendMessage(msg, "Can't do this in a PM!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer") && !config.admin_id.includes(msg.author.id)) { clientBot.sendMessage(msg, "You must have permission to manage the server!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (!ServerSettings.hasOwnProperty(msg.channel.server.id)) db.addServer(msg.channel.server);
    if (!ServerSettings[msg.channel.server.id].ignore.includes(msg.channel.id)) clientBot.sendMessage(msg, "This channel isn't ignored", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); });
    else {
      db.unignoreChannel(msg.channel.id, msg.channel.server.id);
      clientBot.sendMessage(msg, "🔉 Ok, I'll stop ignoring this channel.");
    }
  }
};

module.exports = mod;
