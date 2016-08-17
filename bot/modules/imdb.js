/**
  * This is the imdb Plugin
  */

var unirest = require("unirest");

var mod = {
  name: "imdb",
  enabled: true,
  on: ["imdb", "movie"],
  usage: "<series, episode, movie>",
  description: "Is searching the IMDB Datebase",
  cooldown: 30,
  by: "Devsome",
  deleteCommand: false,
  process: function(clientBot, msg, suffix) {
    var query = suffix;
    var type = "";
    if(query.toLowerCase().indexOf("series ")==0 || query.toLowerCase().indexOf("episode ")==0 || query.toLowerCase().indexOf("movie ")==0) {
      type = "&type=" + query.substring(0, query.indexOf(" ")).toLowerCase();
      query = query.substring(query.indexOf(" ")+1);
    }
    if(query) {
      unirest.get("http://www.omdbapi.com/?t=" + encodeURI(query.replace(/&/g, '')) + "&r=json" + type)
      .header("Accept", "application/json")
      .end(function(result) {
        if(result.status==200 && result.body.Response=="True") {
          clientBot.sendMessage(msg.channel, "__**" + result.body.Title + (type ? "" : (" (" + result.body.Type.charAt(0).toUpperCase() + result.body.Type.slice(1) + ")")) + "**__```" + result.body.Plot + "```**Year:** " + result.body.Year + "\n**Runtime:** " + result.body.Runtime + "\n**Actors:**\n\t" + result.body.Actors.replaceAll(", ", "\n\t") + "\n**Genre(s):**\n\t" + result.body.Genre.replaceAll(", ", "\n\t") + "\n**Rating:** " + result.body.imdbRating + " out of " + result.body.imdbVotes + " votes\n**Country:** " + result.body.Country + "\nhttp://www.imdb.com/title/" + result.body.imdbID + "/");
        } else {
          // logMsg(Date.now(), "WARN", msg.channel.server.id, msg.channel.id, "No IMBD entries for '" + query + "'");
          clientBot.sendMessage(msg.channel, ":no_mouth: :no_entry_sign:");
        }
      });
    } else {
      // logMsg(Date.now(), "WARN", msg.channel.server.id, msg.channel.id, "Invalid IMDB parameters");
      clientBot.sendMessage(msg.channel, msg.author + " Error, please fix it.");
    }
  }
};

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

module.exports = mod;
