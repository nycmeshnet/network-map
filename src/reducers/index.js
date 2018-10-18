import { nodeType } from "../utils";

import nodeData from "../data/nodes";
import linkData from "../data/links";
import sectorData from "../data/sectors";
import kiosks from "../data/kiosks";

const initialFilters = {
	linkNYC: false,
	potential: false,
	dead: false,
	"potential-hub": false,
	"potential-supernode": false
};

const { nodes, links, sectors, nodesById } = addGraphData(
	nodeData,
	linkData,
	sectorData
);
const initialState = {
	nodes,
	links,
	sectors,
	kiosks: initialFilters.linkNYC === false ? [] : kiosks,
	nodesById,
	filters: initialFilters,
	statusCounts: getCounts(nodes, kiosks)
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
			if (action.label === "potential") {
				const hasValue = state.filters["potential"] === undefined;
				const newValue = hasValue ? false : !state.filters["potential"];
				newFilters["dead"] = newValue;
				newFilters["potential-hub"] = newValue;
				newFilters["potential-supernode"] = newValue;
			}
			return {
				...state,
				filters: newFilters,
				kiosks: newFilters.linkNYC === false ? [] : kiosks
			};
		case "FETCH_NODES_SUCCESS":
			const { nodes: newNodes } = addGraphData(action.nodes, state.links);
			const newStatusCounts = getCounts(action.nodes);
			return {
				...state,
				nodes: newNodes,
				statusCounts: newStatusCounts
			};
		case "FETCH_LINKS_SUCCESS":
			const { links: newLinks } = addGraphData(state.nodes, action.links);
			return {
				...state,
				links: newLinks
			};
		case "FETCH_KIOSKS_SUCCESS":
			return {
				...state,
				kiosks: action.kiosks,
				statusCounts: {
					...state.statusCounts,
					linkNYC: action.kiosks.length
				}
			};
		default:
			return state;
	}
};

function addGraphData(nodes, links, sectors) {
	const nodesById = {};

	// Add links to nodes
	nodes.forEach(node => {
		node.type = nodeType(node);
		node.links = links.filter(
			link =>
				link.status === "active" &&
				(link.from === parseInt(node.id, 10) ||
					link.to === parseInt(node.id, 10))
		);

		nodesById[node.id] = node;
	});

	// Add nodes to links
	links.forEach(link => {
		link.fromNode = nodesById[link.from];
		link.toNode = nodesById[link.to];
	});

	// Add sectors to nodes
	// TODO: Calculate this in node-db
	const sectorsByNodeId = {};
	sectors.forEach(sector => {
		sector.node = nodesById[sector.nodeId];
		sectorsByNodeId[sector.nodeId] = sectorsByNodeId[sector.nodeId] || [];
		sectorsByNodeId[sector.nodeId].push(sector);
	});
	nodes.forEach(node => {
		node.sectors = sectorsByNodeId[node.id];
	});

	// Calculate connected nodes for each active node
	nodes.filter(node => node.status === "Installed").forEach(node => {
		const connectedNodes = [node.id];

		links.forEach(link => {
			if (link.status !== "active") return;
			if (link.from === parseInt(node.id, 10)) {
				connectedNodes.push(link.to);
			}

			if (link.to === parseInt(node.id, 10)) {
				connectedNodes.push(link.from);
			}
		});

		node.connectedNodes = connectedNodes;
	});

	return { nodes, links, sectors, nodesById };
}

function getCounts(nodes, kiosks) {
	const counts = {};
	nodes.forEach(node => {
		const { type } = node;
		counts[type] = (counts[type] || 0) + 1;

		if (type.indexOf("potential-") > -1 || type === "dead") {
			counts["potential"] = (counts["potential"] || 0) + 1;
		}

		if (type === "supernode" || type === "hub") {
			counts["active"] = (counts["active"] || 0) + 1;
		}
	});
	counts.linkNYC = kiosks.length;
	return counts;
}

export default reducer;
