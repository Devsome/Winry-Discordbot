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
const remind		= require("./remind.js");
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
global.commands = [];
global.commands_mod = [];

/**
  * This will be run from ./../EliteBot.js
  */
exports.run = function() {
  process.stdout.write("\u001b[2J\u001b[0;0H");
  console.log(cGreen("[INFO]"), "\tStarting the application.");
  modules_load("modules"); // directory name (For normal plugins)
  modules_load("modules_mod"); // directory name (For mod plugins)
  bot_config();
  bot_start();
  bot_timer();
};

/**
  * Loading each module we wrote
  */
function modules_load(dir) {
  try {
    fs.readdirSync("./bot/" + dir).forEach(file => {
      let name = file.split(".");
      if (name[name.length - 1] === "js") {
        let module = require("./" + dir + "/" + file);
        if(typeof module.enabled !== typeof undefined) {
          if(module.enabled === true) {
            loadPlugin(name, module, dir);
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
    if(debug) { console.log(cDebug("[DEBUG]") , "Finally loaded all the Plugins for" , dir); }
  }
}

/**
  * Loading the modules into the bot
  */
function loadPlugin(filename, module, dir) {
  if (module.on !== false) {
    if(debug) { console.log(cDebug("[DEBUG]") , "The module " + filename[0] + " will react to " + module.on); }
  }
	if(dir === "modules"){
	  commands.push(
	    {
	      "name": module.name,
	      "on": module.on,
	      "usage": module.usage,
	      "description": module.description,
	      "cooldown": module.cooldown,
				"by": module.by,
				"deleteCommand": module.deleteCommand,
	      "process": module.process
	    }
	  );
	} else if (dir === "modules_mod") {
		commands_mod.push(
	    {
	      "name": module.name,
	      "on": module.on,
	      "usage": module.usage,
	      "description": module.description,
	      "cooldown": module.cooldown,
				"by": module.by,
				"deleteCommand": module.deleteCommand,
	      "process": module.process
	    }
	  );
	}


}

/**
  * Loading the Config
  */
function bot_config() {
  console.log(cGreen("[INFO]"), "\tLoading the config file.");
  if(!config.token) console.log(cRed("[WARN]") , "\tPlease fill out the " , cRed("token"));
  if(!config.app_id) console.log(cRed("[WARN]") , "\tPlease fill out the " , cRed("app_id"));
	if(!config.invite_link) console.log(cRed("[WARN]") , "\tPlease fill out the " , cRed("invite_link"));
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
    clientBot.on("error", m => console.log(`${cRed(" WARN ")} ${m}`));
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
	setInterval(() => {
		remind.checkReminders(clientBot);
	}, 30000);
}

/**
  * When the Bot is successfully logged in
  */
clientBot.on("ready", function () {
	console.log(cGreen("[INFO]"), `\tTo add me visit this url:\n\thttps://discordapp.com/oauth2/authorize?client_id=${config.app_id}&scope=bot&permissions=60416\n`);
	console.log(cGreen("[INFO]"), "\tReady to begin!");
	console.log(cGreen("[INFO]"), `\tYou're connected to [${clientBot.servers.length}] Server(s) with ${clientBot.channels.length} Channels!`);
	remind.checkReminders(clientBot);
	clientBot.setPlayingGame( games[Math.floor(Math.random() * (games.length))] );
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
	*	Reloading the configs, whitout stopping the bot
	*/
function reload() {
	console.log("reload");
}

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
    			if (Date.now() - pmCoolDown[msg.author.id] > 3000) { // 3 seconds cooldown
    				if (/^(bitte helfen Sie mir|brauche hilfe|need help)$/i.test(msg.content)) {
							clientBot.sendMessage(msg.author, "Write this ``" +  config.command_prefix + "help`` to get some help :3");
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

		//if channel ignored
    if (!msg.channel.isPrivate && !msg.content.startsWith(config.mod_command_prefix) && ServerSettings.hasOwnProperty(msg.channel.server.id) && ServerSettings[msg.channel.server.id].ignore.includes(msg.channel.id)) {
      return;
    }
		if (config.kappa) {
			if(msg.content.toLowerCase().indexOf( "kappa" ) >= 0 ) {
				let emote = getAsset("emotes", "kappa.png");
				clientBot.sendFile(msg.channel, emote, emote, (err, msg) => {
					if (err) {
						clientBot.sendMessage(msg.channel, "I do not have the rights to send a **file** :cry:!");
					}
				});
			}
		}
		if (config.feelsbm) {
			if(msg.content.toLowerCase().indexOf( "feelsbadman" ) >= 0 ) {
				let emote = getAsset("emotes", "feelsbad.png");
				clientBot.sendFile(msg.channel, emote, emote, (err, msg) => {
					if (err) {
						clientBot.sendMessage(msg.channel, "I do not have the rights to send a **file** :cry:!");
					}
				});
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

    let cmd = msg.content.split(" ")[0].substring(1).toLowerCase();
    let suffix = msg.content.substring(cmd.length + 2).trim();
    if (msg.content.startsWith(config.command_prefix)) {

			if (!msg.channel.isPrivate) {
				db.updateTimestamp(msg.channel.server);
			}
      for (var i = 0; i < commands.length; i++) {
        if(commands[i].on.indexOf(cmd) > -1) {
          execCommand(msg, cmd, suffix, i);
        }
      }
    } else if (msg.content.startsWith(config.mod_command_prefix)) {
			if (cmd === "reload" && config.admin_id.includes(msg.author.id)) {
				reload();
				clientBot.deleteMessage(msg);
				return;
			}
			if (config.admin_id.includes(msg.author.id)) { // only for admin_id
				if (!msg.channel.isPrivate) {
					db.updateTimestamp(msg.channel.server);
				}
	      for (var i = 0; i < commands_mod.length; i++) {
	        if(commands_mod[i].on.indexOf(cmd) > -1) {
	          execCommand(msg, cmd, suffix, i, "mod");
	        }
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
    } else if (type == "mod") {
			if (!msg.channel.isPrivate) {
				console.log(cRed(msg.channel.server.name) + " > " + cGreen(msg.author.username) + " > " + cGreen(msg.cleanContent.replace(/\n/g, " ").split(" ")[0]) + msg.cleanContent.replace(/\n/g, " ").substr(msg.cleanContent.replace(/\n/g, " ").split(" ")[0].length));
			} else {
				console.log(cGreen(msg.author.username) + " > " + cGreen(msg.cleanContent.replace(/\n/g, " ").split(" ")[0]) + msg.cleanContent.replace(/\n/g, " ").substr(msg.cleanContent.replace(/\n/g, " ").split(" ")[0].length));
			}
			cmd = commands_mod[i].on[0];
			if (!config.admin_id.includes(msg.author.id) && commands_mod[i].hasOwnProperty("cooldown")) {
				if (!lastExecTime.hasOwnProperty(cmd))
  				lastExecTime[cmd] = {}; //if no entry for command
  			if (!lastExecTime[cmd].hasOwnProperty(msg.author.id))
  				lastExecTime[cmd][msg.author.id] = Date.now(); //if no entry for author
  			else {
  				let now = Date.now();
  				if (now < lastExecTime[cmd][msg.author.id] + (commands_mod[i].cooldown * 1000)) { //still on cooldown

  					clientBot.sendMessage(msg, msg.author.username.replace(/@/g, '@\u200b') + ", you need to *cooldown* (" + Math.round(((lastExecTime[cmd][msg.author.id] + commands_mod[i].cooldown * 1000) - now) / 1000) + " seconds)", (e, m) => { clientBot.deleteMessage(m, {"wait": 6000}); });
  					if (!msg.channel.isPrivate) clientBot.deleteMessage(msg, {"wait": 10000});
  					return;

  				}
  				lastExecTime[cmd][msg.author.id] = now;
  			}
			}
			commands_mod[i].process(clientBot, msg, suffix);
			if (!msg.channel.isPrivate && commands_mod[i].hasOwnProperty("deleteCommand")) {
				if (commands_mod[i].deleteCommand === true ) //&& ServerSettings.hasOwnProperty(msg.channel.server.id) && ServerSettings[msg.channel.server.id].deleteCommands == true)
					clientBot.deleteMessage(msg); //delete command if needed
			}

		}
  } catch (e) {
		if (show_warn) console.log(cRed("[WARN]") + "\tError while execCommand", e);
  } finally {

  }
}

/**
  * getAsset
  * Getting images / files
  */
global.getAsset = (prefix, file) => {
	const fs = require("fs");
	let path = `./assets/${prefix}/`;
	try {
		if(file == "*") {
			let dir = fs.readdirSync(path);
			let choice = Math.floor(Math.random() * dir.length);
			return path + dir[choice];
		} else {
			fs.statSync(path + file);
			return path + file;
		}
	} catch(e) {
		return false;
	}
};
