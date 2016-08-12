/**
  * This is the playing Plugin
  */
const config  = require("./../../config/config.json");
const games  = require("./../../config/games.json");

var mod = {
  name: "play",
  enabled: true,
  on: ["play", "playing"],
  usage: "[game]",
  description: "Change the current playing game",
  cooldown: 180,
  by: "Devsome",
  deleteCommand: true,
  process: function(clientBot, msg, suffix) {
      if (!suffix) {
        clientBot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
      } else {
        clientBot.setPlayingGame(suffix);
      }
  }
};

module.exports = mod;
