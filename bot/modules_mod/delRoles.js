/**
  * This is the del roles Plugin
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");
const utils   = require("./../../bot/utils.js");

var mod = {
  name: "delrole",
  enabled: true,
  on: ["delrole"],
  usage: "Rolename",
  description: "Delete a role from the list",
  cooldown: 3,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg, suffix) {
    if (msg.channel.isPrivate) { clientBot.sendMessage(msg, "Can't do this in a PM!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer")) { clientBot.sendMessage(msg, "You must have permission to manage the server!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (!ServerSettings.hasOwnProperty(msg.channel.server.id)) db.addServer(msg.channel.server);
    if (suffix) {
      var buffer = [];
      for (var i = 0; i < msg.channel.server.roles.length; i++) {
        buffer.push( {
          "id": msg.channel.server.roles[i].id,
          "name": msg.channel.server.roles[i].name
        } );
      }
      var found = buffer.filter(x => x.name.toLowerCase() === suffix.toLowerCase());
      if(found.length > 0) {
        suffix = found[0].name;
      }
      var role = msg.channel.server.roles.get("name", suffix);
      role = role ? role.id : 0;
      if (role === 0) {
        clientBot.sendMessage(msg, 'This role does not exist', (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      } else {
        if (!ServerSettings[msg.channel.server.id].roles.includes(role)) {
          clientBot.sendMessage(msg, 'This role is not in the list', (erro, wMessage) => {
            clientBot.deleteMessage(wMessage, {"wait": 8000});
          });
        } else {
          db.delRole(role, msg.channel.server.id);
          clientBot.sendMessage(msg, 'Role is deleted', (erro, wMessage) => {
            clientBot.deleteMessage(wMessage, {"wait": 8000});
          });
        }
      }
    } else {
      utils.correctUsage("delrole", this.usage, msg, clientBot, config.mod_command_prefix, 15000);
    }
  }
};

module.exports = mod;
