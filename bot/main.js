/**
  * This is the heart of the EliteBot
  * If you have any Question, will free to contact me
  * info@devsome.com
  * Thanks for using EliteBot
  */

/**
  * Loading the Libarys
  */
const Discord   = require("discord.js");
const fs        = require("fs");
const db        = require("./db.js");
const cleverbot = require("./cleverbot.js").cleverbot;
const config    = require("./../config/config.json");
const games     = require("./../config/games.json");
const clientBot = new Discord.Client();
const chalk     = require('chalk');
const clk			  = new chalk.constructor({enabled: true});

/**
  * Setting the colors
  */
cDebug = clk.bgWhite.black;
cGreen = clk.bold.green;
cRed = clk.bold.red;


/**
  * Some variables for the application
  */
let lastExecTime = {},
		pmCoolDown = {};
setInterval( () => { lastExecTime = {};pmCoolDown = {} },3600000 ); // 3600 sekunden => 60 minuten
let show_warn = config.show_warn, debug = config.debug;
let commands = [];

/**
  * This will be run from ./../EliteBot.js
  */
exports.run = function() {
  process.stdout.write("\u001b[2J\u001b[0;0H");
  console.log(cGreen("[INFO]"), "\tStarting the application.");
  modules_load();
  bot_config();
  bot_start();
  bot_timer();
};

/**
  * Loading each module we wrote
  */
function modules_load() {
  try {
    fs.readdirSync("./bot/modules").forEach(file => {
      let name = file.split(".");
      if (name[name.length - 1] === "js") {
        let module = require("./modules/" + file);
        if(typeof module.enabled !== typeof undefined) {
          if(module.enabled === true) {
            loadPlugin(name, module);
          }else{
            if(debug) { console.log(cDebug("[DEBUG]") , "Plugin " + name + " is disabled."); }
          }
        }else {
          if(show_warn) { console.log(cRed("[WARN]") , "\tThe plugin " + name + " is missing the enabled attribute,"); }
        }
      }
    });
  } catch (e) {
    if(show_warn) { console.log(cRed("[WARN]") , "Loading the Plugin", e); }
  } finally {
    if(debug) { console.log(cDebug("[DEBUG]") , "Finally loaded all the Plugins"); }
  }
}

/**
  * Loading the modules into the bot
  */
function loadPlugin(filename, module) {
  if (module.on !== false) {
    if(debug) { console.log(cDebug("[DEBUG]") , "The module " + filename + " will react to " + module.on); }
  }
  commands.push(
    {
      "name": filename[0],
      "on": module.on,
      "usage": module.usage,
      "description": module.description,
      "cooldown": module.cooldown,
      "process": module.process
    }
  );
}

/**
  * Loading the Config
  */
function bot_config() {
  console.log(cGreen("[INFO]"), "\tLoading the config file.");
  if(!config.token) console.log(cRed("[WARN]") , "\tPlease fill out the " , cRed("token"));
  if(!config.app_id) console.log(cRed("[WARN]") , "\tPlease fill out the " , cRed("app_id"));
  if(!config.command_prefix || config.command_prefix.length !== 1) console.log(cRed("[WARN]") , "\tPrefix either not defined or more than one character");
	if(!config.mod_command_prefix || config.mod_command_prefix.length !== 1) console.log(cRed("[WARN]") , "\tMod prefix either not defined or more than one character");
  if(!config.time_playing_game) console.log(cRed("[WARN]") , "\tPlease fill out the " , cRed("time_playing_game"));
  if(!config.bot_msg_joining) console.log(cRed("[WARN]") , "\tPlease fill out the " , cRed("bot_msg_joining"));
  if(!config.admin_id) console.log(cRed("[WARN]") , "\tPlease fill out the " , cRed("admin_id"));
}

/**
  * Starting the Bot
  */
function bot_start() {
  clientBot.loginWithToken(config.token, (err, token) => {
    clientBot.on("error", m => console.log(`${cError(" WARN ")} ${m}`));
    clientBot.on("warn", m => { if (show_warn) console.log(`${cRed("[WARN]")}\t${m}`); });
    clientBot.on("debug", m => { if (debug) console.log(`${cDebug("[DEBUG]")}\t${m}`); });
  	if (!token) { console.log(cRed("[WARN]") , "\tfailed to connect with the token"); setTimeout(() => { process.exit(0); }, 2000); }
  });
}

/**
  * Setting some timers
  */
function bot_timer() {
  // Changing the playing game
  setInterval(() => {
    clientBot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
  }, (config.time_playing_game * 1000) * 60);

  // Checking the database
  setTimeout(() => {db.checkServers(clientBot)}, 10000);
}

/**
  * When the Bot is successfully logged in
  */
clientBot.on("ready", function () {
	console.log(cGreen("[INFO]"), `\tTo add me visit this url:\n\thttps://discordapp.com/oauth2/authorize?client_id=${config.app_id}&scope=bot&permissions=COMMING\n`);
	console.log(cGreen("[INFO]"), "\tReady to begin!");
	console.log(cGreen("[INFO]"), `\tYou're connected to [${clientBot.servers.length}] Server(s) with ${clientBot.channels.length} Channels!`);

	clientBot.setPlayingGame( games[Math.floor(Math.random() * (games.length))] );
	//clientBot.setAvatar("data:image/jpeg;base64,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");
});

/**
  * When the Bot got a disconnect, it will reconnct as soon as possible
  */
clientBot.on('disconnected', function() {
	console.log(cGreen("\n\t[INFO] "), "Disconnted ? Let me reconnect asap...");
	lastExecTime = {};
	bot_start();
});

/**
  * Channel got deleted
  */
clientBot.on("channelDeleted", channel => {
	if (channel.isPrivate)
		return;
	if (ServerSettings.hasOwnProperty(channel.server.id) && ServerSettings[channel.server.id].ignore.includes(channel.id)) {
		db.unignoreChannel(channel.id, channel.server.id);
		if (debug) console.log(cDebug("[DEBUG]") + "\tIgnored channel was deleted and removed from the DB");
	}
});

/**
  * Server got deleted
  */
clientBot.on("serverDeleted", server => {
	console.log(cGreen("[Left server]") + "\t" + server.name);
	db.handleLeave(server);
});

/**
  * Server got Created
  */
clientBot.on("serverCreated", server => {
	if (db.serverIsNew(server)) {
		console.log(cGreen("Joined server: ") + server.name);
		if (config.banned_server_ids && config.banned_server_ids.includes(server.id)) {
			console.log(cRed("Joined server but it was on the ban list") + `: ${server.name}`);
			clientBot.sendMessage(server.defaultChannel, `It's me **${clientBot.user.username.replace(/@/g, '@\u200b')}** , banned from your Server !`);
			setTimeout(() => {
				clientBot.leaveServer(server);
			}, 1000);
		} else {
			db.addServerToTimes(server);
      if(config.bot_msg_joining){
        clientBot.sendMessage(server.defaultChannel, `Hi! I'm **${clientBot.user.username.replace(/@/g, '@\u200b')}** 👋🏻 \nYou can use with **\`${config.command_prefix}help\`** to see what I can do.\nHope we have a great time together :3`);
      }
		}
	}
});

/**
  * When the user is cmd+c in console (terminating the application)
  */
process.on("SIGINT", function () {
  console.log(cGreen("\n[INFO]") , "\tWhoa wait, let me logout first...");
	clientBot.logout();
	process.exit(1);
});

/**
  * Message Function
  * Here are the most important stuff, when user x is sending any message
  * The bot will react on it
  */
clientBot.on("message", function (msg) {
  if (msg.author.id == clientBot.user.id) return;
	if (msg.channel.isPrivate) {
    if (/(^https?:\/\/discord\.gg\/[A-Za-z0-9]+$|^https?:\/\/discordapp\.com\/invite\/[A-Za-z0-9]+$)/.test(msg.content))
    			clientBot.sendMessage(msg.author, `Use this to bring me to your server: ${config.invite_link}`);
    		else if (msg.content[0] !== config.command_prefix && msg.content[0] !== config.mod_command_prefix && !msg.content.startsWith('(eval) ')) {
    			if (!pmCoolDown.hasOwnProperty(msg.author.id)) {
    				pmCoolDown[msg.author.id] = Date.now();
    			}
    			if (Date.now() - pmCoolDown[msg.author.id] > 4000) { // 4 seconds cooldown
    				if (/^(help|how do I use this\??)$/i.test(msg.content)) {
              console.log("user asked for help,how do i use this,??");
    					// commands.commands["help"].process(bot, msg);
    					return;
    				}
    				pmCoolDown[msg.author.id] = Date.now();
            cleverbot(clientBot, msg);
    				return;
    			}
    		}
    } else { // not Private Message (DM)
      if (msg.mentions.length !== 0) {
        if (msg.isMentioned(clientBot.user) && new RegExp('^<@!?' + clientBot.user.id + '>').test(msg.content)) { //if mentioned first
          if (!ServerSettings.hasOwnProperty(msg.channel.server.id) || (ServerSettings.hasOwnProperty(msg.channel.server.id) && !ServerSettings[msg.channel.server.id].ignore.includes(msg.channel.id))) { //if channel not ignored
            cleverbot(clientBot, msg);
            db.updateTimestamp(msg.channel.server);
          }
        }
      }
    }

    //no command or mod command
    if (!msg.content.startsWith(config.command_prefix) && !msg.content.startsWith(config.mod_command_prefix)) {
      return;
    }
    //if auto-inserted mobile space after prefix
    if (msg.content.indexOf(" ") === 1 && msg.content.length > 2) {
      msg.content = msg.content.replace(" ", "");
    }
    //if channel ignored
    if (!msg.channel.isPrivate && !msg.content.startsWith(config.mod_command_prefix) && ServerSettings.hasOwnProperty(msg.channel.server.id) && ServerSettings[msg.channel.server.id].ignore.includes(msg.channel.id)) {
      return;
    }

    let cmd = msg.content.split(" ")[0].substring(1).toLowerCase();
    let suffix = msg.content.substring(cmd.length + 2).trim();
    if (msg.content.startsWith(config.command_prefix)) {
      for (var i = 0; i < commands.length; i++) {
        if(commands[i].on.indexOf(cmd) > -1) {
          execCommand(msg, cmd, suffix, i);
        }
      }
    }

});


/**
  * ExecCommand
  * Running the Commands
  */
function execCommand(msg, cmd, suffix, i, type = "normal") {
  try {

    if(type === "normal") {

      if (!msg.channel.isPrivate) {
        console.log(cRed(msg.channel.server.name) + " > " + cGreen(msg.author.username) + " > " + msg.cleanContent.replace(/\n/g, " "));
      } else {
        console.log(cGreen(msg.author.username) + " > " + msg.cleanContent.replace(/\n/g, " ")); //console logs
      }

      cmd = commands[i].on[0];
      console.log("Main command used: " , commands[i].on[0]);
      console.log(commands[i].cooldown);
      console.log(commands[i].hasOwnProperty("cooldown"));
      console.log(cmd);

      if (!config.admin_id.includes(msg.author.id) && commands[i].hasOwnProperty("cooldown")) {
  			if (!lastExecTime.hasOwnProperty(cmd))
  				lastExecTime[cmd] = {}; //if no entry for command
  			if (!lastExecTime[cmd].hasOwnProperty(msg.author.id))
  				lastExecTime[cmd][msg.author.id] = Date.now(); //if no entry for author
  			else {
  				let now = Date.now();
  				if (now < lastExecTime[cmd][msg.author.id] + (commands[i].cooldown * 1000)) { //still on cooldown

  					clientBot.sendMessage(msg, msg.author.username.replace(/@/g, '@\u200b') + ", you need to *cooldown* (" + Math.round(((lastExecTime[cmd][msg.author.id] + commands[i].cooldown * 1000) - now) / 1000) + " seconds)", (e, m) => { clientBot.deleteMessage(m, {"wait": 6000}); });
  					if (!msg.channel.isPrivate) clientBot.deleteMessage(msg, {"wait": 10000});
  					return;

  				}
  				lastExecTime[cmd][msg.author.id] = now;
  			}
  		}
  		commands[i].process(clientBot, msg, suffix);
  		if (!msg.channel.isPrivate && commands[i].hasOwnProperty("deleteCommand")) {
  			if (commands[i].deleteCommand === true && ServerSettings.hasOwnProperty(msg.channel.server.id) && ServerSettings[msg.channel.server.id].deleteCommands == true)
  				clientBot.deleteMessage(msg, {"wait": 10000}); //delete command if needed
  		}

    }

  } catch (e) {

  } finally {

  }
}
