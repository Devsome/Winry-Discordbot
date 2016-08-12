/**
  * This is the ping Plugin
  * Only answers and edit his message with a ping (time needed to reply)
  */

var mod = {
  name: "ping",
  enabled: true,
  on: ["ping", "p"],
  usage: "",
  description: "Checking the reaction from the bot",
  cooldown: 15,
  by: "Devsome",
  process: function(clientBot, msg) {
    if(msg.author.game){
      clientBot.sendMessage(msg.channel, "Why not playing ``" + msg.author.game.name + "`` :rolling_eyes: " , (e,sentMsg) => {
          clientBot.updateMessage(sentMsg, "Why not playing ``" + msg.author.game.name + "`` :rolling_eyes: " + "\t(" + (sentMsg.timestamp - msg.timestamp) + " ms)");
      });
    }else{
      clientBot.sendMessage(msg.channel, "pong!" , (e,sentMsg) => {
          clientBot.updateMessage(sentMsg, "pong!!" + "\t(" + (sentMsg.timestamp - msg.timestamp) + " ms)");
      });
    }
  }
};

module.exports = mod;
