/**
  * This is the help Plugin
  * Using it will show the user all the commands we got
  */

var mod = {
  enabled: true,
  on: ["hello", "h"],
  usage: "<no needed>",
  description: "Giving out a small hallo",
  cooldown: 10,
  process: function(clientBot, msg) {
    clientBot.sendMessage(msg.channel, "pong!" , (e,sentMsg) => {
        clientBot.updateMessage(sentMsg, "pong!!" + "\t(" + (sentMsg.timestamp - msg.timestamp) + " ms)");
    });
  }
};

module.exports = mod;
