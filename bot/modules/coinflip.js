/**
  * This is the Coinflip Plugin
  */
const config  = require("./../../config/config.json");
const games  = require("./../../config/games.json");

var mod = {
  name: "coinflip",
  enabled: true,
  on: ["coinflip", "cf"],
  usage: "<red or black>",
  description: "Red or Black to coinflip",
  cooldown: 30,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg, suffix) {
    var suffix = suffix.toLowerCase();
    if(suffix === "black" || suffix === "red") {
      if (suffix) {
        var rand = Math.floor((Math.random() * 2) + 1);
        if (rand == 1) {
          var col = "black";
        } else {
          var col = "red";
        }
        if (suffix === col) {
          clientBot.sendMessage(msg, msg.author.username.replace(/@/g, '@\u200b') + " said :" + suffix + "_circle: and won this round ! :tada: :moneybag:" );
        } else {
          clientBot.sendMessage(msg, msg.author.username.replace(/@/g, '@\u200b') + " said :" + suffix + "_circle: You lost this round :cry:" );
        }
      } else {
        clientBot.sendMessage(msg.channel, "Please use a <suffix> :point_up:", function(err, msg){
          clientBot.deleteMessage(msg , {wait: 5000 * 1});
        });
      }
    } else {
      clientBot.sendMessage(msg.channel, "Please use a <suffix> :point_up:", function(err, msg){
        clientBot.deleteMessage(msg , {wait: 5000 * 1});
      });
    }
  }
};

module.exports = mod;
