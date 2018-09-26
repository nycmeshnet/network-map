import { parse } from "date-fns";

// TODO: Get this client side, using auth tokens
import active from "../data/active.json";
import potential from "../data/potential.json";
import links from "../data/links.json";
import kiosks from "../data/kiosks.json";
import tickets from "../data/tickets.json";

import { nodeStatus } from "../utils";

// Calculate connected nodes for each node
active.forEach(node => {
	const connectedNodes = { [node.id]: true };

	links.forEach(link => {
		if (link.status !== "active") return;
		if (link.from === parseInt(node.id, 10)) {
			connectedNodes[link.to] = true;
		}

		if (link.to === parseInt(node.id, 10)) {
			connectedNodes[link.from] = true;
		}
	});

	node.connectedNodes = connectedNodes;
});

const nodes = [...active, ...potential].sort(sortNodes);

// Add links to node
nodes.forEach(node => {
	node.tickets = tickets[node.id];
	node.links = links.filter(
		link =>
			link.status === "active" &&
			(link.from === parseInt(node.id, 10) ||
				link.to === parseInt(node.id, 10))
	);
});

const initialFilters = {};

const initialState = {
	nodes,
	links,
	kiosks,
	filteredNodes: filterNodes(nodes, initialFilters),
	filters: initialFilters
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "TOGGLE_FILTER":
			const newFilters = {
				...state.filters,
				[action.label]:
					state.filters[action.label] === undefined
						? false
						: !state.filters[action.label]
			};
			return {
				...state,
				filters: newFilters,
				filteredNodes: filterNodes(nodes, newFilters),
				kiosks: newFilters.linkNYC === false ? [] : kiosks
			};
		default:
			return state;
	}
};

function filterNodes(nodes, filters) {
	return nodes.filter(
		node =>
			filters[nodeStatus(node)] === undefined || filters[nodeStatus(node)]
	);
}

function sortNodes(a, b, reverse = true) {
	const keyA = parse(a.id),
		keyB = parse(b.id);
	if (keyA < keyB) return reverse ? 1 : -1;
	if (keyA > keyB) return reverse ? -1 : 1;
	return 0;
}

export default reducer;
