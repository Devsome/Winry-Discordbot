/**
  * Loading the Libarys
  */
const config  = require("./../config/config.json");
const utils   = require("./../bot/utils.js");

ServerSettings = require("./../database/servers.json");
Times = require("./../database/times.json");

/**
  * Some variables for the database
  */
let inactive = [];
let updatedS = false;
let updatedT = false;
let debug = config.debug;
/**
  * Checking every minute
  */
setInterval(() => {
	if (updatedS) {
		updatedS = false;
		utils.safeSave('database/servers', '.json', JSON.stringify(ServerSettings));
	}
	if (updatedT) {
		updatedT = false;
		utils.safeSave('database/times', '.json', JSON.stringify(Times));
	}
}, 60000);

exports.serverIsNew = function(server) {
	return !Times.hasOwnProperty(server.id);
}

exports.changeSetting = function(key, value, serverId) {
	if (!key || value == undefined || value == null || !serverId) return;
	switch (key) {
		case 'banAlerts':
			ServerSettings[serverId].banAlerts = value; break;
		case 'nameChanges':
			ServerSettings[serverId].nameChanges = value; break;
		case 'deleteCommands':
			ServerSettings[serverId].deleteCommands = value; break;
		case 'notifyChannel':
			ServerSettings[serverId].notifyChannel = value; break;
		case 'welcome':
			ServerSettings[serverId].welcome = value; break;
	}
	updatedS = true;
};

exports.checkServers = function(clientBot) {
  inactive = [];
	let now = Date.now();
	Object.keys(Times).map(id => {
		if (!clientBot.servers.find(s => s.id == id)) delete Times[id];
	});
  clientBot.servers.map(server => {
    if (server == undefined) return;
    if (!Times.hasOwnProperty(server.id)) {
      console.log(cGreen("Joined server: ") + server.name);
      if (config.banned_server_ids && config.banned_server_ids.includes(server.id)) {
        console.log(cRed("Joined server but it was on the ban list") + ": " + server.name);
        clientBot.sendMessage(server.defaultChannel, `It's me **${clientBot.user.username.replace(/@/g, '@\u200b')}** , banned from your Server !`);
        setTimeout(() => {clientBot.leaveServer(server);}, 1000);
      } else {
        if (!config.whitelist.includes(server.id)) {
          if(config.bot_msg_joining){
            clientBot.sendMessage(server.defaultChannel, `Hi! I'm **${clientBot.user.username.replace(/@/g, '@\u200b')}** 👋🏻 \nYou can use with **\`${config.command_prefix}help\`** to see what I can do.\nHope we have a great time together :3`);
          }
        }
        Times[server.id] = now;
      }
    } else if (!config.whitelist.includes(server.id) && now - Times[server.id] >= 604800000) {
      inactive.push(server.id);
      if (debug) console.log(`${cDebug("[DEBUG]")}\t${server.name} (${server.id}) hasn't used the bot for ${((now - Times[server.id]) / 1000 / 60 / 60 / 24).toFixed(1)} days.`);
    }
  });
  updatedT = true;
	if (inactive.length > 0) console.log("Can leave " + inactive.length + " servers that don't use the bot");
	if (debug) console.log(cDebug("[DEBUG]") + "\tChecked for inactive servers");
};

exports.addRole = function(roleId, serverId) {
	if (!roleId || !serverId) return;
	if (!ServerSettings[serverId].roles.includes(roleId)) {
		ServerSettings[serverId].roles.push(roleId);
		updatedS = true;
	}
};

exports.delRole = function(roleId, serverId) {
	if (!roleId || !serverId) return;
	if (ServerSettings[serverId].roles.includes(roleId)) {
		ServerSettings[serverId].roles.splice(ServerSettings[serverId].ignore.indexOf(roleId), 1);
		updatedS = true;
	}
};

exports.ignoreChannel = function(channelId, serverId) {
	if (!channelId || !serverId) return;
	if (!ServerSettings[serverId].ignore.includes(channelId)) {
		ServerSettings[serverId].ignore.push(channelId);
		updatedS = true;
	}
};

exports.unignoreChannel = function(channelId, serverId) {
	if (!channelId || !serverId) return;
	if (ServerSettings[serverId].ignore.includes(channelId)) {
		ServerSettings[serverId].ignore.splice(ServerSettings[serverId].ignore.indexOf(channelId), 1);
		updatedS = true;
	}
};

exports.handleLeave = function(server) {
	if (!server || !server.id) return;
	if (Times.hasOwnProperty(server.id)) {
		delete Times[server.id];
		updatedT = true;
		if (debug) console.log(cDebug("[DEBUG]") + "\tRemoved server from times.json");
	}
};

exports.addServerToTimes = function(server) {
	if (!server || !server.id) return;
	if (!Times.hasOwnProperty(server.id)) {
		Times[server.id] = Date.now();
		updatedT = true;
	}
};

var addServer = function(server) {
	if (!server) return
	if (!ServerSettings.hasOwnProperty(server.id)) {
		ServerSettings[server.id] = {"ignore":[], "roles":[], "banAlerts":false, "nameChanges":false, "welcome":"none", "deleteCommands":false, "notifyChannel":"general"};
		updatedS = true;
	}
}

exports.addServer = addServer;

exports.updateTimestamp = function(server) {
	if (!server || !server.id) return;
	if (Times.hasOwnProperty(server.id)) {
		Times[server.id] = Date.now();
		updatedT = true;
	}
	if (inactive.includes(server.id)) inactive.splice(inactive.indexOf(server.id), 1);
};
