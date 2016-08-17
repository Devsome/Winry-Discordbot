/**
  * This is the Dragonball Quote Plugin
  */

var mod = {
  name: "dragonball",
  enabled: true,
  on: ["dragonball", "db"],
  usage: "",
  description: "Gives you are random Dragonball Quote",
  cooldown: 180,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg) {
    var sentences = [
        "``It's not a waste of time, if we're having fun.`` — Android 17",
        "``You'll laugh at your fears when you find out who you really are.`` — Piccolo training Gohan for the first time",
        "``Life is good, but living in fear is not my idea of living.`` — Android 16",
        "``Limitations only exist, if you let them!`` — Vegeta",
        "``Bulma! Your balls are gone!`` — Goku",
        "``You may have taken my mind and my body, but there is one thing a Saiyan always keeps! HIS PRIDE!!!`` — Vegeta",
        "``YEEEAAAAAH`` — Mr. Satan",
        "``There's only one certainty in life. A strong man stands above and conquers all!`` — Vegeta",
        "``Let me ask you. Does a machine like yourself ever experience fear. `` — Vegeta",
        "``It looks like they only want me, and that's exactly who they'll get.`` — Goku",
        "``Trunks, I never hugged you as a baby... let me hug you.`` — Vegeta",
        "``I'll do it slowly, so you can watch me better.`` — Gohan",
        "``Kaio-Ken! Times Ten!`` — Goku",
        "``Sorry, I saw an opening that just screamed 'ATTACK,' so I did, ha!`` — Goku",
        "``Eternal Dragon, by your name, I summon you forth, Shenron.`` — Dende",
        "`` We can't give up just because things aren't the way we want them to be.`` — Piccolo",
        "``Let's see what you got Kakarot. Galic Gun Fire!`` — Vegeta",
        "``I have yet to show you, young warrior, what I'm truly capable of.`` — Cell",
        "``What went wrong? You had me! `` — Vegeta",
        "``~evil laugh~... And then there was one...`` — Vegeta",
        "``I am the prince of all Saiyans once again!`` — Vegeta",
        "``As long as I have the power to destroy you Cell, I'm willing to sacrifice everything.`` — Trunks",
        "``I can go one step farther if I wanted to.`` — Goku",
        "``Strength is the only thing that means anything to me!`` — Vegeta",
        "``Piccolo! You big jerk! I take back all the nice things I said about you!`` — Gohan",
        "``Your real strength is your bravery.`` — Pan",
        "``Now that we have the vermin out of the way. You're next Piccolo. `` — Cell",
        "``Is uh, # 18 your real name? `` — Tournament Announcer",
        "``Buu turn you into candy. `` — Majin Buu",
        "``Hey! Don't piss off the god of love! `` — Dende"
    ];
    var index= Math.floor(Math.random() * (sentences.length));
    clientBot.sendMessage(msg , sentences[index] );
  }
};

module.exports = mod;
