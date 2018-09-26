export function nodeStatus(node) {
	const { status, notes, tickets, panoramas } = node;
	const isActive = status === "Installed";
	const isSupernode = notes.toLowerCase().indexOf("supernode") > -1;
	const isHub = notes.toLowerCase().indexOf("hub") > -1;
	const isResponsive = tickets && tickets.length > 2;
	const hasPanoramas = panoramas && panoramas.length;

	if (isActive) {
		if (isSupernode) return "supernode";
		if (isHub) return "hub";
		return "active";
	}

	if (isSupernode) return "potential-supernode";
	if (isHub) return "potential-hub";
	if (isResponsive || hasPanoramas) return "potential";
	return "dead";
}

export const nodeColors = {
	active: "rgb(255,59,48)",
	dead: "#aaa",
	hub: "rgb(90,200,250)",
	kiosk: "#01a2eb",
	linkNYC: "#01a2eb",
	"potential-hub": "#777",
	"potential-supernode": "#777",
	potential: "#777",
	supernode: "#007aff"
};
