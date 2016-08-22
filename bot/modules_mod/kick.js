/**
  * This is the mod kick Plugin
  */

var mod = {
  name: "kick",
  enabled: true,
  on: ["kick", "getout"],
  usage: "<@users> [message]",
  description: "Kick a user with a message",
  cooldown: 5,
  by: "Devsome",
  process: function(clientBot, msg, suffix) {
    if (msg.channel.isPrivate) return;
    if (!msg.channel.permissionsOf(msg.author).hasPermission("kickMembers") && !config.admin_id.includes(msg.author.id))
      clientBot.sendMessage(msg, "You don't have permission", (e, m) => { bot.deleteMessage(m, {"wait": 10000}); });
    else if (!msg.channel.permissionsOf(clientBot.user).hasPermission("kickMembers"))
      clientBot.sendMessage(msg, "I don't have permission", (e, m) => { clientBot.deleteMessage(m, {"wait": 10000}); });
    else if (suffix && msg.mentions.length > 0) {
      let kickMessage = suffix.replace(/<@\d+>/g, "").trim();
      msg.mentions.map(unlucky => {
        msg.channel.server.kickMember(unlucky);
        if (kickMessage)
          clientBot.sendMessage(unlucky, "You were kicked from " + msg.channel.server.name + " for reason: " + kickMessage);
        }
      });
      clientBot.sendMessage(msg, msg.author.username + " 👌🏻", (e, m) => { clientBot.deleteMessage(m, {"wait": 10000}); });
    } else utils.correctUsage("kick", this.usage, msg, clientBot, config.mod_command_prefix);
  }
};

module.exports = mod;
