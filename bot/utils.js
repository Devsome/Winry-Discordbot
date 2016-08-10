/**
  * Loading the Libarys
  * Setting the debug
  */
const config  = require("./../config/config.json");
const fs = require('fs');
const	request = require('request');
let debug = config.debug;

/*
Save a file safely
	dir: path from root folder (EX: db/servers)
	ext: file extension (EX: .json)
	data: data to be written to the file
	minSize: will not save if less than this size in bytes (optional, defaults to 5)
*/
exports.safeSave = function(dir, ext, data, minSize = 5) {
	if (!dir || !ext || !data) return;
	if (dir.startsWith('/')) dir = dir.substr(1);
	if (!ext.startsWith('.')) ext = '.' + ext;

	fs.writeFile(`${__dirname}/../${dir}-temp${ext}`, data, error => {
		if (error) console.log(error);
		else {
			fs.stat(`${__dirname}/../${dir}-temp${ext}`, (err, stats) => {
				if (err) console.log(err);
				else if (stats["size"] < minSize)
					console.log('safeSave: Prevented file from being overwritten');
				else {
					fs.rename(`${__dirname}/../${dir}-temp${ext}`, `${__dirname}/../${dir}${ext}`, e => {if(e)console.log(e)});
					if (debug) console.log(cDebug("[DEBUG]") + "\tUpdated " + dir + ext);
				}
			});
		}
	});
}

//comma sperate a number
exports.comma = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//sort messages by earliest first
exports.sortById = (a, b) => a.id - b.id;
