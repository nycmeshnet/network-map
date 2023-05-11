export function nodeType(node) {
	const { status, notes, panoramas } = node;
	const lowerNotes = notes ? notes.toLowerCase() : null;
	const isSupernode = notes && lowerNotes.indexOf("supernode") > -1;
	const isPop = notes && lowerNotes.indexOf("pop") > -1;
	const isAP = notes && notes.indexOf("AP") > -1;
	const isHub = notes && lowerNotes.indexOf("hub") > -1;
	const notPotentialHub = !notes || lowerNotes.indexOf("hub?") === -1;
	const isOmni = notes && lowerNotes.indexOf("omni") > -1;
	const isKiosk = notes && lowerNotes.indexOf("kiosk") > -1;
	const isRemote = notes && lowerNotes.indexOf("rem") > -1;
	const hasPanoramas = panoramas && panoramas.length;

	if (status === "active") {
		if (isSupernode) return "supernode";
		if (isPop) return "pop";
		if (isAP) return "ap";
		if (isHub && notPotentialHub) return "hub";
		if (isOmni) return "omni";
		if (isKiosk) return "kiosk";
		if (isRemote) return "remote";
		return "active";
	}
	if (status === "NN assigned") return "NN assigned"
	if (isSupernode) return "potential-supernode";
	if (isHub) return "potential-hub";
	if (hasPanoramas) return "potential";
	return "dead";
}

export function nodeStatus(node) {
	const { status } = node;
	const isActive = (status === "Installed" || status === "NN Assigned");
	return isActive ? "active" : "potential";
}

// TODO: Move this to node-db
export function linkStatus(link) {
	const { status, fromNode, toNode } = link;
	if (!fromNode || !toNode) return "invalid";
	if (
		(status === "active" || status === "fiber" || status === "vpn" || status === "60GHz") &&
		fromNode.status === "active" &&
		toNode.status === "active"
	)
		return status; // changed from: return "active" 2022-03-26
	return "potential";
}

export const nodeColors = {
	active: "rgb(255,45,85)",
	remote: "rgb(255,45,85)",
	"NN assigned": "rgb(255,166,201)",
	dead: "#aaa",
	hub: "rgb(90,200,250)",
	omni: "rgb(90,200,250)",
	linkNYC: "#01a2eb",
	kiosk: "rgb(255,45,85)",
	"potential-hub": "#777",
	"potential-supernode": "#777",
	potential: "#777",
	supernode: "#007aff",
	pop: "#F6BE00",
	ap: "#00FF00",
	sector: "#007aff",
	backbone: "#007aff"
};

export const sectorColors = {
	supernode: "#007aff",
	"potential-hub": "#aaa",
	"potential-supernode": "#aaa",
	potential: "#aaa",
	default: "#007aff"
};
