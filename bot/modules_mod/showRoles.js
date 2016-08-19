/**
  * This is the show roles Plugin
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");

var mod = {
  name: "showroles",
  enabled: true,
  on: ["roles", "list"],
  usage: "",
  description: "Show all roles in the list",
  cooldown: 3,
  by: "Devsome",
  deleteCommand: true,
  process: function(clientBot, msg) {
    if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer")) { clientBot.sendMessage(msg, "You must have permission to manage the server!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (!ServerSettings.hasOwnProperty(msg.channel.server.id)) db.addServer(msg.channel.server);
    var buffer = [];
    for (var i = 0; i < msg.channel.server.roles.length; i++) {
      buffer.push( {
        "id": msg.channel.server.roles[i].id,
        "name": msg.channel.server.roles[i].name
      } );
    }
    let toSend = [];
    toSend.push("Roles user can grant\n```glsl\n");
    if (!ServerSettings[msg.channel.server.id].roles.length > 0) {
      toSend.push("\nEmpty\n\t#ID:0");
      toSend.push("\nYou need to add roles first:");
      toSend.push("\n\t" + ServerSettings[msg.channel.server.id].mod_command_prefix + "addrole " + "Rolename");
    } else {
      Object.keys(ServerSettings[msg.channel.server.id].roles).forEach(x => {
        found = buffer.filter(y => y.id === ServerSettings[msg.channel.server.id].roles[x]);
        toSend.push("\n" + found[0].name + "\n\t#ID:" + found[0].id);
      });
    }
    toSend = toSend.join('');
    clientBot.sendMessage(msg.author, toSend + "\n```");

  }
};

module.exports = mod;
