/**
  * This is the server settings Plugin
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");
const utils   = require("./../../bot/utils.js");

var mod = {
  name: "settings",
  enabled: true,
  on: ["settings"],
  usage: "<setting> <true|false> | info | list",
  description: "Server Settings",
  cooldown: 3,
  by: "Devsome",
  deleteCommand: true,
  process: function(clientBot, msg, suffix) {
    if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer")) { clientBot.sendMessage(msg, "You must have permission to manage the server!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (msg.channel.isPrivate) {
      clientBot.sendMessage(msg, "Can't do this in a PM!", (e, m) => { clientBot.deleteMessage(m, {"wait": 10000}); });
      return;
    }
    if (!suffix || !/(.+ .+|info|list)/.test(suffix)) {
      utils.correctUsage("settings", this.usage, msg, clientBot, ServerSettings[msg.channel.server.id].mod_command_prefix);
      return;
    }
    if (!ServerSettings.hasOwnProperty(msg.channel.server.id)) db.addServer(msg.channel.server);

    // Information about the server settings
    if (suffix.trim().toLowerCase() == "info") {
      var buffer = [];
      for (var i = 0; i < msg.channel.server.roles.length; i++) {
        buffer.push( {
          "id": msg.channel.server.roles[i].id,
          "name": msg.channel.server.roles[i].name
        } );
      }
      let toSend = '__**Current Settings**__ ⚙\n';
      toSend += `__Delete Commands:__\n\t[ **${ServerSettings[msg.channel.server.id].deleteCommands}** ]\n`;
      toSend += `__Normal Prefix:__\n\t[ **${ServerSettings[msg.channel.server.id].command_prefix}** ]\n`;
      toSend += `__Mod Prefix:__\n\t[ **${ServerSettings[msg.channel.server.id].mod_command_prefix}** ]\n__Notification Channel:__\n\t`;
      toSend += (ServerSettings[msg.channel.server.id].notifyChannel === "general") ? `[ <#${msg.channel.server.id}>]` : `[<#${ServerSettings[msg.channel.server.id].notifyChannel}> ]`;
      toSend += (ServerSettings[msg.channel.server.id].ignore.length > 0) ? '\n__Ignored Channels:__\n\t[ <#' + ServerSettings[msg.channel.server.id].ignore.join('> <#') + '> ]' : '\n__Ignored Channels:__\n\t[ none ]' ;
      toSend += ServerSettings[msg.channel.server.id].roles.length > 0 ? '\n__Roles user can Grant:__\n\t' : '\n__Roles user can Grant:__\n\t[ none ]  ';
      Object.keys(ServerSettings[msg.channel.server.id].roles).forEach(x => {
        found = buffer.filter(y => y.id === ServerSettings[msg.channel.server.id].roles[x]);
        toSend += found[0].name + ", ";
      });
      clientBot.sendMessage(msg.author, toSend.substring(0,toSend.length-2));
    }

    // Information about the settings you can change
    if (suffix.trim().toLowerCase() == "list") {
      toSend = '__**Current changeable Settings**__ ⚙\n```md';
      toSend += '\n# Will show you the current list of commands';
      toSend += '\n\t' + ServerSettings[msg.channel.server.id].mod_command_prefix + this.on[0] + ' list';
      toSend += '\n# Showing the Server settings !';
      toSend += '\n\t' + ServerSettings[msg.channel.server.id].mod_command_prefix + this.on[0] + ' info';
      toSend += '\n# Is changing the Bot Notification channel';
      toSend += '\n\t' + ServerSettings[msg.channel.server.id].mod_command_prefix + this.on[0] + ' notify here';
      toSend += '\n\t' + ServerSettings[msg.channel.server.id].mod_command_prefix + this.on[0] + ' notify #channl-name';
      toSend += '\n# Is changing the Normal Command Prefix to [~] for example';
      toSend += '\n\t' + ServerSettings[msg.channel.server.id].mod_command_prefix + this.on[0] + ' prefix ~';
      toSend += '\n# Is changing the Moderator Command Prefix to [%] for example';
      toSend += '\n\t' + ServerSettings[msg.channel.server.id].mod_command_prefix + this.on[0] + ' mod %';
      toSend += '\n# Is changing the delete message to [true] or [false]';
      toSend += '\n\t' + ServerSettings[msg.channel.server.id].mod_command_prefix + this.on[0] + ' delete true or false';
      clientBot.sendMessage(msg.author, toSend + '\n```');
    }

    // notify channel
    // notify here || notify #channel
    var regex = /^notify (here|.*?)$/i;
    if (regex.test(suffix.trim())) {
      var match = regex.exec(suffix.trim());
      if (match[1] === 'here') { match = msg.channel.id; } else { match = match[1].match(/<#([^']+)>/)[1]; }
      if (ServerSettings[msg.channel.server.id].notifyChannel === match) {
        clientBot.sendMessage(msg, "You already have that channel!", (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      } else {
        db.changeSetting('notifyChannel', match, msg.channel.server.id);
        clientBot.sendMessage(msg, '⚙ Channel changed to <#' + match + '>', (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      }

    }

    // mod prefix, only one Char
    // mod PREFIX
    var regex = /^mod (.{1})$/i;
    if (regex.test(suffix.trim())) {
      var match = regex.exec(suffix.trim())[1];
      if (ServerSettings[msg.channel.server.id].mod_command_prefix === match) {
        clientBot.sendMessage(msg, "You already have that mod command prefix!", (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      } else {
        db.changeSetting('modPrefix', match, msg.channel.server.id);
        clientBot.sendMessage(msg, '⚙ Mod command prefix changed to ``' + match + '``', (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      }
    }

    // normal prefix, only one Char
    // Command PREFIX
    var regex = /^prefix (.{1})$/i;
    if (regex.test(suffix.trim())) {
      var match = regex.exec(suffix.trim())[1];
      if (ServerSettings[msg.channel.server.id].command_prefix === match) {
        clientBot.sendMessage(msg, "You already have that command prefix!", (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      } else {
        db.changeSetting('prefixPrefix', match, msg.channel.server.id);
        clientBot.sendMessage(msg, '⚙ Normale command prefix changed to ``' + match + '``', (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      }
    }

    // delete true or false
    // Use: delete true || delete false
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
