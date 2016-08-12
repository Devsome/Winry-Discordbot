/**
  * This is the help Plugin
  * Using it will show the user all the commands we got
  */
const config  = require("./../../config/config.json");

var mod = {
  name: "help",
  enabled: true,
  on: ["help", "hilfe"],
  usage: "",
  description: "Telling you the truth about the bot commands",
  cooldown: 10,
  process: function(clientBot, msg, suffix) {
    let toSend = [];
    if (!suffix) {
      toSend.push("Use `" + config.command_prefix + "help <command name>` to get more info on a command.\n");
      toSend.push("Commands you can use:```glsl\n");
      toSend.push("@" + clientBot.user.username + " <text>\n\t#Talk to the bot (cleverbot)");
      Object.keys(commands).forEach(cmd => {
        if (!commands[cmd].hasOwnProperty("shouldDisplay") || (commands[cmd].hasOwnProperty("shouldDisplay") && commands[cmd].shouldDisplay))
          toSend.push("\n" + config.command_prefix + commands[cmd].on[0] + " " + commands[cmd].usage + "\n\t#" + commands[cmd].description);
      });
      toSend = toSend.join('');
      if (toSend.length >= 1990) {
        clientBot.sendMessage(msg.author, toSend.substr(0, 1990).substr(0, toSend.substr(0, 1990).lastIndexOf('\n\t')) + "```"); //part 1
        setTimeout(() => {clientBot.sendMessage(msg.author, "```glsl" + toSend.substr(toSend.substr(0, 1990).lastIndexOf('\n\t')) + "```");}, 1000); //2
      } else clientBot.sendMessage(msg.author, toSend + "```");
    } else {
      suffix = suffix.toLowerCase();
      var found = commands.filter(item => item.name === suffix);
      if (found[0]) {
        toSend.push("Command ``" + config.command_prefix + suffix + "``\n```glsl\n");
        if (found[0].description) toSend.push("Description:# " + found[0].description);
        if (found[0].usage) toSend.push("\nUsage:# " + found[0].usage);
        if (found[0].cooldown) toSend.push("\nCooldown:# " + found[0].cooldown + " seconds");
        if (found[0].on) toSend.push("\nShortcuts:# [ " + found[0].on + " ] can be used");
        if (found[0].by) toSend.push("\nCoded from:# [" + found[0].by + "]");
        toSend = toSend.join('');
        clientBot.sendMessage(msg, toSend + "\n```");
      } else {
        clientBot.sendMessage(msg, "Command `" + suffix + "` not found.", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); });
      }
    }
  }
};

module.exports = mod;
