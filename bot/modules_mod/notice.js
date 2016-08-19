/**
  * This is the notice Plugin
  */
const config  = require("./../../config/config.json");
const utils  = require("./../../bot/utils.js");
const chalk     = require('chalk');
const clk			  = new chalk.constructor({enabled: true});

cDebug = clk.bgWhite.black;
cGreen = clk.bold.green;
cRed = clk.bold.red;

debug = config.debug

//stuff for announce
var confirmCodes = [];
var announceMessages = [];

var mod = {
  name: "notice",
  enabled: true,
  on: ["notice"],
  usage: "[Text]",
  description: "Is sending to everyone from the Server a Private Message.",
  cooldown: 30,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg, suffix) {
      if (!suffix) { clientBot.sendMessage(msg, msg.author + " you must specify a message to announce", function(erro, wMessage) { clientBot.deleteMessage(wMessage, {"wait": 8000}); }); return; }
      if (msg.channel.isPrivate && !config.admin_id.includes(msg.author.id)) {
        clientBot.sendMessage(msg, "You can't do this outside of a server", function(erro, wMessage) {
          clientBot.deleteMessage(wMessage, {"wait": 10000});
          return;
        });
      }
      if (!msg.channel.isPrivate) {
        if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer") && !config.admin_id.includes(msg.author.id)) {
          clientBot.sendMessage(msg, "Server admins only", function(erro, wMessage) { clientBot.deleteMessage(wMessage, {"wait": 8000}); });
          return;
        }
      }
      if (!msg.channel.isPrivate) {
        if (/^\d+$/.test(suffix)) {
          let index = confirmCodes.indexOf(parseInt(suffix));
          if (index == -1) { clientBot.sendMessage(msg, "Code not found", function(erro, wMessage) { clientBot.deleteMessage(wMessage, {"wait": 8000}); }); return; }
          clientBot.sendMessage(msg, "Announcing to all users, this may take a while...");
          let loopIndex = 0;
          function annLoopS() {
            if (loopIndex >= msg.channel.server.members.length) { clearInterval(annTimerS); return; }
            clientBot.sendMessage(msg.channel.server.members[loopIndex], "📢 " + announceMessages[index] + " \n\n\tfrom " + msg.author + " on " + msg.channel.server.name);
            loopIndex++;
          }
          let annTimerS = setInterval(() => { annLoopS() }, 1100);
          delete confirmCodes[index];
          if (debug) { console.log(cDebug("[DEBUG]") + "Announced \"" + announceMessages[index] + "\" to members of " + msg.channel.server.name); }
        } else {
          announceMessages.push(suffix);
          let code = Math.floor(Math.random() * 100000);
          confirmCodes.push(code);
          clientBot.sendMessage(msg, "This will send a message to **all** users in this server ⚠ \nWrite this to continue: `" + ServerSettings[msg.channel.server.id].mod_command_prefix + "notice " + code + "`");
        }
      } else if (msg.channel.isPrivate && config.admin_id.includes(msg.author.id)) {
        if (/^\d+$/.test(suffix)) {
          let index = confirmCodes.indexOf(parseInt(suffix));
          if (index == -1) { clientBot.sendMessage(msg, "Code not found", function(erro, wMessage) { clientBot.deleteMessage(wMessage, {"wait": 8000}); }); return; }
          clientBot.sendMessage(msg, "Announcing to all servers, this may take a while...");
          let loopIndex = 0;
          function annLoop() {
            if (loopIndex >= clientBot.servers.length) { clearInterval(annTimer); return; }
            if (!clientBot.servers[loopIndex].name.includes("Discord API") && !clientBot.servers[loopIndex].name.includes("Discord Bots") && !clientBot.servers[loopIndex].name.includes("Discord Developers")) {
              clientBot.sendMessage(clientBot.servers[loopIndex].defaultChannel, "📢 " + announceMessages[index] + " \n\n\t``from " + msg.author.username + "``");
              loopIndex++;
            }
          }
          let annTimer = setInterval(() => { annLoop() }, 1100);
          delete confirmCodes[index];
          if (debug) { console.log(cDebug("[DEBUG]") + " Announced \"" + announceMessages[index] + "\" to all servers"); }
        } else {
          announceMessages.push(suffix);
          let code = Math.floor(Math.random() * 100000);
          confirmCodes.push(code);
          clientBot.sendMessage(msg, "This will send a message to **all** Servers in generel where I can talk ⚠ \nWrite this to continue: `" + config.mod_command_prefix + "notice " + code + "`");
        }
      }
  }
};

module.exports = mod;
