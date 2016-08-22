/**
  * This is the afk Plugin
  */
const config  = require("./../../config/config.json");
const db  = require("./../../bot/db.js");
const away  = require("./../../bot/away.js");
const awayDB  = require("./../../database/away.json");

var mod = {
  name: "afk",
  enabled: true,
  on: ["afk", "away"],
  usage: "<message>",
  description: "Is answering for you while you're away.",
  cooldown: 2,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg, suffix) {
    if(!suffix) {
      clientBot.sendMessage(msg.channel, msg.author + " Please set any afk message.", (e, m) => {
        clientBot.deleteMessage(m, {"wait": 5000});
      });
    } else {
      if (suffix.length > 50) {
        clientBot.sendMessage(msg.channel, msg.author + " Only 50 chars are allowed.", (e, m) => {
          clientBot.deleteMessage(m, {"wait": 5000});
        });
      } else {
        if (awayDB[msg.author.id]) {
          if (awayDB[msg.author.id].user.includes(msg.author.id)) {
            clientBot.sendMessage(msg.channel, msg.author + " You have already a AFK message.", (e, m) => {
              clientBot.deleteMessage(m, {"wait": 5000});
            });
          } else {
            away.addAway(msg.author.id, suffix);
            clientBot.sendMessage(msg.channel, msg.author + " saved. I will answer anyone who mention you.", (e, m) => {
              clientBot.deleteMessage(m, {"wait": 8000});
            });
          }
        } else {
          away.addAway(msg.author.id, suffix);
          clientBot.sendMessage(msg.channel, msg.author + " saved. I will answer anyone who mention you.", (e, m) => {
            clientBot.deleteMessage(m, {"wait": 8000});
          });
        }
      }
    }
  }
};

module.exports = mod;
