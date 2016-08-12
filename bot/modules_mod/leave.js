/**
  * This is the ping Plugin
  * Only answers and edit his message with a ping (time needed to reply)
  */

var mod = {
  name: "leave",
  enabled: true,
  on: ["leave"],
  usage: "",
  description: "Leaving the Server",
  cooldown: 15,
  by: "Devsome",
  deleteCommand: true,
  process: function(clientBot, msg) {
    clientBot.sendMessage(msg.server.defaultChannel, `It's me **${clientBot.user.username.replace(/@/g, '@\u200b')}** , I should leave your server !`);
    setTimeout(() => {
      clientBot.leaveServer(msg.server);
    }, 1000);
  }
};

module.exports = mod;
