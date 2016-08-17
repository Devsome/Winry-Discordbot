/**
  * This is the roles Plugin
  */
const config  = require("./../../config/config.json");
const db      = require("./../../bot/db.js");
const utils   = require("./../../bot/utils.js");

var mod = {
  name: "role",
  enabled: true,
  on: ["role", "iam"],
  usage: "rolename",
  description: "Will add you to the role",
  cooldown: 3,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg, suffix) {
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
        if (ServerSettings[msg.channel.server.id].roles.includes(role)) {
          if (clientBot.memberHasRole(msg.author, role)) {
            clientBot.reply(msg, 'You got the role already!', (erro, wMessage) => {
              clientBot.deleteMessage(wMessage, {"wait": 8000});
            });
          }else{
            clientBot.addMemberToRole(msg.author, role, (erro) => {
              if (show_warn) console.log(cRed("[WARN]") + "\tI do not have permissions to add users to role");
            });
            clientBot.reply(msg, 'Added!', (erro, wMessage) => {
              clientBot.deleteMessage(wMessage, {"wait": 8000});
            });
          }
        } else {
          clientBot.reply(msg, 'This role is not added', (erro, wMessage) => {
            clientBot.deleteMessage(wMessage, {"wait": 8000});
          });
        }
      }
    } else {
      utils.correctUsage("role", this.usage, msg, clientBot, config.mod_command_prefix, 15000);
    }
  }
};


module.exports = mod;
