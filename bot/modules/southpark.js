/**
  * This is the Southpark Quote Plugin
  */

var mod = {
  name: "southpark",
  enabled: true,
  on: ["southpark", "sp"],
  usage: "",
  description: "Gives you are random Southpark Quote",
  cooldown: 180,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg) {
    var sentences = [
        "``Mom — kitty is being a dildo.`` — Cartman",
        "``There’s a time and a place for everything, and it’s called college.`` — Chef",
        "``Too bad drinking scotch isn’t a paying job or Kenny’s dad would be a millionare!`` — Cartman",
        "``It’s been six weeks since Saddam Hussein was killed by wild boars and the world is still glad to be rid of him.`` — Newscaster",
        "``I'm not fat, I'm big-boned.`` — Cartman",
        "``No, Jay Leno's chin is big-boned. You are a big fat ass.`` — Stan",
        "``Mmmmf mmmf mmmmmf mmmmmmm mmmmf mmmmf mmmmmmmmf mmmf.`` — Kenny",
        "``Why don't we all sing, \"Kyle's Mom is a Stupid Bitch\" in D-minor?`` — Cartman",
        "``TIMAH.`` — Timmy",
        "``You go to hell. You go to hell and you die.`` — Garrison",
        "``I don't want to do it if it hurts or if it makes you get all sticky.`` — Butters",
        "``Butters, remind me to cut your balls off later.`` — Cartman",
        "``WhatwhatWHAT?`` — Mrs. Broflovski",
        "``I'm so high man, I don't think I can take it.`` — Towelie",
        "``Cartman, that's the dumbest thing you've ever said... this week.`` — Kyle",
        "``Oh, Jesus Christ.`` — Mr.Slave",
        "``I got my period.`` — Eric Cartman"
    ];
    var index= Math.floor(Math.random() * (sentences.length));
    clientBot.sendMessage(msg , sentences[index] );
  }
};

module.exports = mod;
