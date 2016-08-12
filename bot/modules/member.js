/**
  * This is the Member adding Plugin
  */
const config  = require("./../../config/config.json");

var mod = {
  name: "member",
  enabled: false,
  on: ["member", "role"],
  usage: "",
  description: "Adding you to the Role: " + config.member_role_name,
  cooldown: 360,
  by: "Devsome",
  process: function(clientBot, msg, suffix) {
    var roles = msg.channel.server.roles;
    var role = roles.get("name", config.member_role_name).id; // get roleid of class
    console.log(role);
    console.log(config.member_role_name);
    if (clientBot.memberHasRole(msg.author, role)) {
      clientBot.reply(msg, " Plz you got the role already!");
    }else{
      clientBot.addMemberToRole(msg.author, role);
      clientBot.reply(msg, " You are now a " + config.member_role_name + "!");
    }
  }
};

module.exports = mod;
