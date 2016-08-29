/**
  * This is the Emma Watson Plugin
  */

var mod = {
  name: "emma",
  enabled: true,
  on: ["emma"],
  usage: "",
  description: "Giving your random images from Emma Watson",
  cooldown: 60,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg) {
    var file = getAsset("emma", "*");
    clientBot.sendFile( msg.channel, file, file, (err, msg) => {
      if (err) {
        clientBot.sendMessage(msg.channel, "I do not have the rights to send a **file** :cry:!");
      }
    });
  }
};



module.exports = mod;
