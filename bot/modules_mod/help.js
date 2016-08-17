/**
  * This is the mod Plugin
  * Using it will show the user all the mod commands we got
  */
const config  = require("./../../config/config.json");

var mod = {
  name: "help",
  enabled: true,
  on: ["help"],
  usage: "",
  description: "Telling you the truth about the mod bot commands",
  cooldown: 10,
  deleteCommand: true,
  process: function(clientBot, msg, suffix) {
    let toSend = [];
    if (!suffix) {
      toSend.push("Use `" + config.mod_command_prefix + "help <command name>` to get more info on a mod command.\n");
      toSend.push("Mod commands you can use:```glsl\n");
      Object.keys(commands_mod).forEach(cmd => {
        if (!commands_mod[cmd].hasOwnProperty("shouldDisplay") || (commands_mod[cmd].hasOwnProperty("shouldDisplay") && commands_mod[cmd].shouldDisplay))
          toSend.push("\n" + config.mod_command_prefix + commands_mod[cmd].on[0] + " " + commands_mod[cmd].usage + "\n\t#" + commands_mod[cmd].description);
      });
      toSend = toSend.join('');
      if (toSend.length >= 1990) {
        clientBot.sendMessage(msg.author, toSend.substr(0, 1990).substr(0, toSend.substr(0, 1990).lastIndexOf('\n\t')) + "```"); //part 1
        setTimeout(() => {clientBot.sendMessage(msg.author, "```glsl" + toSend.substr(toSend.substr(0, 1990).lastIndexOf('\n\t')) + "```");}, 1000); //2
      } else clientBot.sendMessage(msg.author, toSend + "```");
    } else {
      suffix = suffix.toLowerCase();
      var buff;
      for (var i = 0; i < commands_mod.length; i++) {
        if(commands_mod[i].on.indexOf(suffix) > -1) {
          buff = commands_mod[i];
        }
      }
      if (buff) {
        toSend.push("Mod command ``" + config.mod_command_prefix + suffix + "``\n```glsl\n");
        if (buff.description) toSend.push("Description:# " + buff.description);
        if (buff.usage) toSend.push("\nUsage:# " + buff.usage);
        if (buff.cooldown) toSend.push("\nCooldown:# " + buff.cooldown + " seconds");
        if (buff.on) toSend.push("\nShortcuts:# [ " + buff.on + " ] can be used");
        if (buff.by) toSend.push("\nCoded by:# [" + buff.by + "]");
        toSend = toSend.join('');
        clientBot.sendMessage(msg, toSend + "\n```");
      } else {
        clientBot.sendMessage(msg, "Command `" + suffix + "` not found.", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); });
      }
    }
  }
};

function findShortcuts(short) {
  console.log(short.on);
  return short.on === short.on;
}

module.exports = mod;
