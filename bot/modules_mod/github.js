/**
  * This is the github Plugin
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");
const git  = require("./../../bot/git.js");
const utils   = require("./../../bot/utils.js");
const gitDB  = require("./../../database/github.json");
var unirest = require("unirest");

var mod = {
  name: "github",
  enabled: true,
  on: ["git", "github"],
  usage: "add <owner> <repo> | del <owner> <repo> | list",
  description: "Adding a Repo to the list",
  cooldown: 5,
  by: "Devsome",
  deleteCommand: true,
  process: function(clientBot, msg, suffix) {
    if (!msg.channel.permissionsOf(msg.author).hasPermission("manageServer") && !config.admin_id.includes(msg.author.id)) { clientBot.sendMessage(msg, "You must have permission to manage the server!", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 10000}); }); return; }
    if (msg.channel.isPrivate) {
      clientBot.sendMessage(msg, "Can't do this in a PM!", (e, m) => { clientBot.deleteMessage(m, {"wait": 10000}); });
      return;
    }

    if (!suffix || !/(.+ .+|list)/.test(suffix)) {
      utils.correctUsage("git", this.usage, msg, clientBot, ServerSettings[msg.channel.server.id].mod_command_prefix);
      return;
    }
    if (!ServerSettings.hasOwnProperty(msg.channel.server.id)) db.addServer(msg.channel.server);

    if (suffix.trim().toLowerCase() == "list") {
      let toSend = [];
      toSend.push("Repository's\n```md\n");
      for (var a in gitDB) {
        if (gitDB.hasOwnProperty(a)) {
          if (gitDB[a].server.indexOf(msg.channel.server.id) >= 0) {
            toSend.push("\n" + a);
          }
        }
      }
      toSend = toSend.join('');
      clientBot.sendMessage(msg, toSend + "\n```", (erro, wMessage) => {
        clientBot.deleteMessage(wMessage, {"wait": 10000});
      });
    }

    // add owner reponame
    var regex = /^add\s([\w-]+)\s([\w-]+)$/i;
    if (regex.test(suffix.trim())) {
      var match = regex.exec(suffix.trim());
      repo = match[1].toLowerCase() + "\\" + match[2].toLowerCase();
      if (!gitDB[repo]) { // does not exist, check if valid repo
        unirest.get("https://api.github.com/repos/" + repo + "/commits")
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Devsome'})
        .end(function(result) {
          if (result.status == 200 && result.body[0].sha) {
            git.addGithub(msg.channel.server.id, repo, result.body[0].sha);
            clientBot.sendMessage(msg, "🆕 Successfully added this Repository.", (erro, wMessage) => {
              clientBot.deleteMessage(wMessage, {"wait": 8000});
            });
          } else {
            clientBot.sendMessage(msg, "This Repository can not be found.", (erro, wMessage) => {
              clientBot.deleteMessage(wMessage, {"wait": 8000});
            });
          }
        });
        return;
      } else {
        git.updateGithub(msg.channel.server.id, repo);
        clientBot.sendMessage(msg, "🆕 Successfully added this Repository.", (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
        return;
      }
      if (gitDB[repo].server.includes(msg.channel.server.id)) {
        clientBot.sendMessage(msg, "This Repository is already in your Server list.", (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      }
    }

    // del owner reponame
    var regex = /^del\s([\w-]+)\s([\w-]+)$$/i;
    if (regex.test(suffix.trim())) {
      var match = regex.exec(suffix.trim());
      repo = match[1].toLowerCase() + "\\" + match[2].toLowerCase();
      if (!gitDB[repo]) {clientBot.sendMessage(msg, "This Repository does not exist.", (erro, wMessage) => { clientBot.deleteMessage(wMessage, {"wait": 8000});}); return;}
      if (gitDB[repo].server.includes(msg.channel.server.id)) {
        clientBot.sendMessage(msg, "🚮 Successfully deleted this Repository.", (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
        git.removeGithub(msg.channel.server.id, repo);
      } else {
        clientBot.sendMessage(msg, "This Repository is not in your Server list.", (erro, wMessage) => {
          clientBot.deleteMessage(wMessage, {"wait": 8000});
        });
      }
    }
  }
};

module.exports = mod;
