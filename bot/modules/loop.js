/**
  * This is the loop Plugin
  */
const utils   = require("./../../bot/utils.js");

var mod = {
  name: "loop",
  enabled: false,
  on: ["loop", "+"],
  usage: "<text> | <text>",
  description: "Is looping some stuff you want",
  cooldown: 30,
  by: "Devsome",
  deleteCommand: true,
  process: function(clientBot, msg, suffix) {
    if(!suffix) {
      utils.correctUsage("loop", this.usage, msg, clientBot, ServerSettings[msg.channel.server.id].command_prefix);
      return;
    }
    let loopStr = suffix.split(/ ?\| ?/);
    var count = true;
    clientBot.sendMessage(msg.channel, loopStr[0] , (e,sentMsg) => {
      asyncLoop({
          length : 5,
          functionToLoop : function(loop, i){
              setTimeout(function(){
                  if (count) {
                    count = false;
                    clientBot.updateMessage(sentMsg, loopStr[1]);
                  } else {
                    count = true;
                    clientBot.updateMessage(sentMsg, loopStr[0]);
                  }
                  loop();
              },1000);
          },
          callback : function(){
              clientBot.deleteMessage(sentMsg, {"wait": 1000});
          }
      });
    });
  }
};

var asyncLoop = function(o){
    var i=-1,
        length = o.length;

    var loop = function(){
        i++;
        if(i==length){o.callback(); return;}
        o.functionToLoop(loop, i);
    }
    loop();//init
}

module.exports = mod;
