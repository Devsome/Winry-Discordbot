/**
  * This is the jlaw Watson Plugin
  */

var mod = {
  name: "jlaw",
  enabled: true,
  on: ["jlaw"],
  usage: "",
  description: "Giving your random images from Jennifer Lawrence",
  cooldown: 60,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg) {
    var file = getAsset("jlaw", "*");
    clientBot.sendFile( msg.channel, file, file, (err, msg) => {
      if (err) {
        clientBot.sendMessage(msg.channel, "I do not have the rights to send a **file** :cry:!");
      }
    });
  }
};



module.exports = mod;
