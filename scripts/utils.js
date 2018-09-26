const fs = require("fs");

function writeFile(path, json) {
	fs.writeFile(path, JSON.stringify(json, null, 2), function(err) {
		if (err) console.error("Error writing to " + path, err);
	});
}

module.exports = {
	writeFile
};
