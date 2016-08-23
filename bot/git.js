const git = require('./../database/github.json');
const utils   = require("./../bot/utils.js");
var unirest = require("unirest");
var updatedR = false;
let pull = []

setInterval(() => {
	if (updatedR) {
		updatedR = false;
		utils.safeSave('database/github', '.json', JSON.stringify(git));
	}
}, 60000)

/*
Add Github:
	server: Server ID
	repo: The git repo
*/
exports.addGithub = function(server, repo, sha) {
	if (!server || !repo || !sha) return;
	repo = repo.toLowerCase();
	if (git[repo]) {
		git[repo].server.push(server);
	} else {
		git[repo] = { "server": [], "sha": "" };
		git[repo].server.push(server);
		git[repo].sha = sha;
	}
	if (debug) console.log(cDebug("[DEBUG]") + "\tAdded Repository("+repo+") to Server" , server);
	updatedR = true;
};

/*
Update Github
	server: Server ID
	repo: The git repo
*/
exports.updateGithub = function(server, repo) {
	if (!server || !repo) return;
	repo = repo.toLowerCase();
	git[repo].server.push(server);
	if (debug) console.log(cDebug("[DEBUG]") + "\tAdded Repository("+repo+") to Server" , server);
	updatedR = true;
};

/*
Remove Github:
	server: Server ID
	suffix: Repo name
*/
exports.removeGithub = function(server, repo) {
	if (!server || !repo) return;
	if (git[repo].server.includes(server)) {
		git[repo].server.splice(git[repo].server.indexOf(server), 1);
		if (debug) console.log(cDebug("[DEBUG]") + "\tDeleted Repository("+repo+") from Server" , server);
		if (git[repo].server.length === 0) {
			delete git[repo];
			if (debug) console.log(cDebug("[DEBUG]") + "\tDeleted Key("+repo+") from Github.json" , server);
		}
		updatedR = true;
	}
};

/*
Checking for new Commits:
	clientbot: Elite Bot
*/
exports.checkCommits = function(clientBot) {
	if (debug) console.log(cDebug("[DEBUG]") + "\tPulling newest Repositorys");
	var options = {
		weekday: "long", year: "numeric", month: "short",
		day: "numeric", hour: "2-digit", minute: "2-digit"
	};

	for (var i=0; i<=Object.keys(git).length; i++) {
    (function(j){
    	setTimeout( function timer(){
				repo = Object.keys(git)[j];
				unirest.get("https://api.github.com/repos/" + repo + "/commits")
				.headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Devsome'})
				.end(function(result) {
					if (result.status === 403 || result.status === 404) {
						if (debug) console.log(cRed("[WARN]") + "\t" + result.status + result.message);
					}
					for (var y = 0; y < result.body.length; y++) {
						if (result.body[y].sha === git[repo].sha) {
							git[repo].sha = result.body[0].sha; // 0 latest
							updatedR = true;
							return;
						}
						if (result.status == 200 && result.body[y].sha) {
							if (result.body[y].sha != git[repo].sha) {
								for (var i = 0; i < git[repo].server.length; i++) {
									if (debug) console.log(cDebug("[DEBUG]") + "\tSending commit", result.body[y].sha, "to", git[repo].server[i]);
									let toSend = [];
									var fDate = new Date(result.body[y].commit.author.date).toLocaleTimeString("de-DE", options) + ' CEST';
									toSend.push("Neuer Commit für **"+repo+"**\n\n```md\n");
									toSend.push(`[Author](${result.body[y].author.login})\n`);
									toSend.push(`[Date]  (${fDate})\n`);
									toSend.push(`[Commit](${result.body[y].commit.message})\n`);
									toSend.push("```");
									toSend.push(`\nLink: <${result.body[y].html_url}>\n`);
									toSend = toSend.join('');
									clientBot.sendMessage(ServerSettings[git[repo].server[i]].notifyChannel, toSend);
								}
							}
						} else {
							if (show_warn) console.log(cRed("[WARN]") + "\tRepository("+repo+") Error getting ("+result.body[y].sha+") commit");
						}
					}
				});
      }, j*20000 ); // 20 sec sleep before checking other Repo
    })( i );
	}
};
