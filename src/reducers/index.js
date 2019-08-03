import { nodeType, nodeStatus, linkStatus } from "../utils";

import nodeData from "../data/nodes";
import linkData from "../data/links";
import sectorData from "../data/sectors";
import kiosks from "../data/kiosks";

const initialFilters = {
	remote: true,
	linkNYC: false,
	potential: false,
	dead: false,
	"potential-hub": false,
	"potential-supernode": false,
	sector: true,
	backbone: false,
	changelog: false
};

const { nodes, links, sectors, nodesById } = addGraphData(
	nodeData,
	linkData,
	sectorData
);

const reducer = (
	state = {
		nodes,
		links,
		sectors,
		kiosks: initialFilters.linkNYC === false ? [] : kiosks,
		nodesById,
		filters: initialFilters,
		statusCounts: getCounts(nodes, kiosks),
		showFilters: false
	},
	action
) => {
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
		case "TOGGLE_FILTERS":
			return {
				...state,
				showFilters: !state.showFilters
			};

		default:
			return state;
	}
};

// TODO: Calculate a lot of this in node-db
function addGraphData(nodes, links, sectors) {
	const nodesById = {};

	const linksByNodeId = {};
	links.forEach(link => {
		linksByNodeId[link.from] = linksByNodeId[link.from] || [];
		linksByNodeId[link.to] = linksByNodeId[link.to] || [];
		linksByNodeId[link.from].push(link);
		linksByNodeId[link.to].push(link);
	});

	// Group nodes at same lat / lng
	const mergedNodes = {};

	// Add status, types and links to nodes
	nodes.forEach(node => {
		if (node.notes) {
			node.notes = String(node.notes);
		}
		nodesById[node.id] = node;
		node.links = linksByNodeId[node.id];
		node.status = nodeStatus(node);
		const key = geoKey(node);
		mergedNodes[key] = mergedNodes[key] || [];
		mergedNodes[key].push(node);
	});

	// Add status and nodes to links
	links.forEach(link => {
		link.fromNode = nodesById[link.from];
		link.toNode = nodesById[link.to];
		link.status = linkStatus(link);
	});

	// Add sectors to nodes
	const sectorsByNodeId = {};
	sectors.forEach(sector => {
		sector.node = nodesById[sector.nodeId];
		sectorsByNodeId[sector.nodeId] = sectorsByNodeId[sector.nodeId] || [];
		sectorsByNodeId[sector.nodeId].push(sector);
	});

	nodes.forEach(node => {
		node.sectors = sectorsByNodeId[node.id];

		// Calculate connected nodes for each active node
		const connectedNodes = [node.id];

		links.forEach(link => {
			if (link.from === parseInt(node.id, 10)) {
				connectedNodes.push(link.to);
			}

			if (link.to === parseInt(node.id, 10)) {
				connectedNodes.push(link.from);
			}
		});

		node.connectedNodes = connectedNodes;
		node.memberNodes = mergedNodes[geoKey(node)];

		node.type = nodeType(node);
		nodesById[node.id] = node;
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

		if (node.sectors) {
			counts["sector"] = (counts["sector"] || 0) + node.sectors.length;
		}
	});
	counts.linkNYC = kiosks.length;
	return counts;
}

function geoKey(node) {
	const precision = 5;
	const [lat, lng] = node.coordinates;
	const key = lat.toFixed(precision) + "-" + lng.toFixed(precision);
	return key;
}

export default reducer;
