export function nodeType(node) {
	const { status, notes, panoramas, links, sectors } = node;
	const lowerNotes = notes ? notes.toLowerCase() : null;
	const isSupernode = notes && lowerNotes.indexOf("supernode") > -1;
	const isHub = notes && lowerNotes.indexOf("hub") > -1;
	const notPotentialHub = !notes || lowerNotes.indexOf("hub?") === -1;
	const isOmni = notes && lowerNotes.indexOf("omni") > -1;
	const hasPanoramas = panoramas && panoramas.length;
	const hasSectors = sectors && sectors.length;

	if (status === "active") {
		if (isSupernode) return "supernode";
		if ((isHub && notPotentialHub) || hasSectors) return "hub";
		if (isOmni) return "omni";
		if (!links || !links.filter(l => l.status === "active").length)
			return "vpn";
		return "active";
	}

	if (isSupernode) return "potential-supernode";
	if (isHub) return "potential-hub";
	if (hasPanoramas) return "potential";
	return "dead";
}

export function nodeStatus(node) {
	const { status } = node;
	const isActive = status === "Installed";
	return isActive ? "active" : "potential";
}

// TODO: Move this to node-db
export function linkStatus(link) {
	const { status, fromNode, toNode } = link;
	if (!fromNode || !toNode) return "invalid";
	if (
		status === "active" &&
		fromNode.status === "active" &&
		toNode.status === "active"
	)
		return "active";
	return "potential";
}

export const nodeColors = {
	active: "rgb(255,45,85)",
	dead: "#aaa",
	hub: "rgb(90,200,250)",
	omni: "rgb(90,200,250)",
	kiosk: "#01a2eb",
	linkNYC: "#01a2eb",
	"potential-hub": "#777",
	"potential-supernode": "#777",
	potential: "#777",
	supernode: "#007aff",
	sectors: "#007aff",
	backbone: "#007aff"
};

export const sectorColors = {
	supernode: "#007aff",
	"potential-hub": "#aaa",
	"potential-supernode": "#aaa",
	potential: "#aaa",
	default: "#007aff"
};
