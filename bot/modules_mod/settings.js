/**
  * This is the server settings Plugin
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");
const utils   = require("./../../bot/utils.js");

var mod = {
  name: "settings",
  enabled: true,
  on: ["settings", "change"],
  usage: "<setting> <true|false> | info",
  description: "Server Settings",
  cooldown: 3,
  by: "Devsome",
  deleteCommand: true,
  process: function(clientBot, msg, suffix) {
    if (msg.channel.isPrivate) { clientBot.sendMessage(msg, "Can't do this in a PM!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer")) { clientBot.sendMessage(msg, "You must have permission to manage the server!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (msg.channel.isPrivate) {
      clientBot.sendMessage(msg, "Can't do this in a PM!", (e, m) => { clientBot.deleteMessage(m, {"wait": 10000}); });
      return;
    }
    if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer")) { // && !config.admin_id.includes(msg.author.id)) {
      clientBot.sendMessage(msg, "You must have permission to manage the server!", (e, m) => { clientBot.deleteMessage(m, {"wait": 10000}); });
      return;
    }
    if (!suffix || !/(.+ .+|info)/.test(suffix)) {
      utils.correctUsage("settings", this.usage, msg, clientBot, config.mod_command_prefix);
      return;
    }
    if (!ServerSettings.hasOwnProperty(msg.channel.server.id)) db.addServer(msg.channel.server);

    if (suffix.trim().toLowerCase() == "info") {
      let toSend = '⚙ **Current Settings** ⚙\n**Delete Commands:** ' + ServerSettings[msg.channel.server.id].deleteCommands + '\n**Notification Channel:** ';
      toSend += (ServerSettings[msg.channel.server.id].notifyChannel == "general") ? 'Default' : '<#' + ServerSettings[msg.channel.server.id].notifyChannel + '>';
      toSend += (ServerSettings[msg.channel.server.id].ignore.length > 0) ? '\n**Ignored Channels:** <#' + ServerSettings[msg.channel.server.id].ignore.join('> <#') + '>' : '\n**Ignored Channels:** none' ;
      clientBot.sendMessage(msg, toSend, (erro, wMessage) => {
        clientBot.deleteMessage(wMessage, {"wait": 15000});
      });
    }

    // delete true or false
    var regex = /^delete (true|false)$/i;
    if (regex.test(suffix.trim())) {
      var match = regex.exec(suffix.trim());
      if (match[1] ? match[1] === "true" : match[1] === "false") {
        if (!ServerSettings[msg.channel.server.id].deleteCommands) {
          db.changeSetting('deleteCommands', true, msg.channel.server.id);
          clientBot.sendMessage(msg, '⚙ Enabled command deletion', (erro, wMessage) => {
            clientBot.deleteMessage(wMessage, {"wait": 8000});
          });
        } else {
          clientBot.sendMessage(msg, "Command deletion is already enabled!", (erro, wMessage) => {
            clientBot.deleteMessage(wMessage, {"wait": 8000});
          });
        }
      } else {
        if (ServerSettings[msg.channel.server.id].deleteCommands) {
          db.changeSetting('deleteCommands', false, msg.channel.server.id);
          clientBot.sendMessage(msg, '⚙ Disabled command deletion', (erro, wMessage) => {
            clientBot.deleteMessage(wMessage, {"wait": 8000});
          });
        } else {
          clientBot.sendMessage(msg, "Command deletion is already disabled!", (erro, wMessage) => {
            clientBot.deleteMessage(wMessage, {"wait": 8000});
          });
        }
      }
    }

  }
};

module.exports = mod;
