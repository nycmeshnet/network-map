const getNodesAndLinks = require("./spreadsheet");
const getKiosks = require("./kiosks");
const { writeFile } = require("./utils");

getNodesAndLinks(network => {
	const { active, potential, links } = network;
	writeFile("./src/data/active.json", active);
	writeFile("./src/data/potential.json", potential);
	writeFile("./src/data/links.json", links);
	getKiosks(kiosks => {
		writeFile("./src/data/kiosks.json", kiosks);
	});
});
