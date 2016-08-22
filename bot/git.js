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
}, 30000)

/*
Add Github:
	server: Server ID
	repo: The git repo
*/
exports.addGithub = function(server, repo) {
	if (!server || !repo) return;
	repo = repo.toLowerCase();
	if (git[repo]) {
		git[repo].server.push(server);
	} else {
		git[repo] = { "server": [], "sha": "" };
		git[repo].server.push(server);
	}
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
	console.log(git[repo]);
	console.log(git[repo].server);
	if (git[repo].server.includes(server)) {
		git[repo].server.splice(git[repo].server.indexOf(server), 1);
		if (debug) console.log(cDebug("[DEBUG]") + "\tDeleted Repository("+repo+") from Server" , server);
		updatedR = true;
	}
};

/*
Checking for new Commits:
	clientbot: Elite Bot
*/
exports.checkCommits = function(clientBot) {
	if (debug) console.log(cDebug("[DEBUG]") + "\tPulling newest Repositorys");
	for (var a in git) {
		if (git.hasOwnProperty(a)) {
			(function(j){
	        setTimeout( function timer(){
							unirest.get("https://api.github.com/repos/" + j + "/commits")
							.headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Devsome'})
							.end(function(result) {
								if(result.status == 200 && result.body[0].sha) {
									if(git[j].sha !== result.body[0].sha) {
										for (var i = 0; i < git[j].server.length; i++) {
											let toSend = [];
											toSend.push("Neuer Commit für **"+j+"**\n```md\n");
											toSend.push(`[Author](${result.body[0].author.login})\n`);
											toSend.push(`[Date](${result.body[0].commit.author.date})\n`);
											toSend.push(`[Message][${result.body[0].commit.message}]\n`);
											toSend.push("```");
											toSend.push(`\nLink: <${result.body[0].html_url}>\n`);
											toSend = toSend.join('');
											clientBot.sendMessage(ServerSettings[git[j].server[i]].notifyChannel, toSend);
										}
										git[j].sha = result.body[0].sha;
										updatedR = true;
										if (debug) console.log(cDebug("[DEBUG]") + "\tRepository("+j+") updated new SHA" , git[j].sha);
									}
								} else {
									if (show_warn) console.log(cRed("[WARN]") + "\tRepository("+j+") Error getting newest commit");
								}
							});
	        }, j*3000 );
	    })( a );
		}
	}
};
