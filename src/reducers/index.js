import { nodeStatus } from "../utils";

import nodeData from "../data/nodes";
import linkData from "../data/links";
import sectorData from "../data/sectors";
import kiosks from "../data/kiosks";

const initialFilters = {};

const { nodes, links, sectors } = addGraphData(nodeData, linkData, sectorData);
const initialState = {
	nodes,
	links,
	sectors,
	kiosks,
	filteredNodes: nodes,
	filteredLinks: links,
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
				newFilters["dead"] =
					state.filters["dead"] === undefined
						? false
						: !state.filters["dead"];
				newFilters["potential-hub"] =
					state.filters["potential-hub"] === undefined
						? false
						: !state.filters["potential-hub"];
				newFilters["potential-supernode"] =
					state.filters["potential-supernode"] === undefined
						? false
						: !state.filters["potential-supernode"];
			}
			return {
				...state,
				filters: newFilters,
				filteredNodes: filterNodes(state.nodes, newFilters),
				filteredLinks: filterLinks(state.links, newFilters)
				// kiosks: newFilters.linkNYC === false ? [] : state.kiosks
			};
		case "FETCH_NODES_SUCCESS":
			const { nodes: newNodes } = addGraphData(action.nodes, state.links);
			const newStatusCounts = getCounts(action.nodes);
			return {
				...state,
				nodes: newNodes,
				filteredNodes: filterNodes(newNodes, state.filters),
				statusCounts: newStatusCounts
			};
		case "FETCH_LINKS_SUCCESS":
			const { links: newLinks } = addGraphData(state.nodes, action.links);
			return {
				...state,
				links: newLinks,
				filteredLinks: filterLinks(newLinks, state.filters)
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

function filterNodes(nodes, filters) {
	return nodes.filter(
		node =>
			filters[nodeStatus(node)] === undefined || filters[nodeStatus(node)]
	);
}

function filterLinks(links, filters) {
	return links.filter(link => {
		if (!link.fromNode || !link.toNode) {
			return true;
		}

		if (
			filters[nodeStatus(link.fromNode)] !== undefined &&
			filters[nodeStatus(link.fromNode)] === false
		) {
			return false;
		}

		if (
			filters[nodeStatus(link.toNode)] !== undefined &&
			filters[nodeStatus(link.toNode)] === false
		) {
			return false;
		}

		return true;
	});
}

function addGraphData(nodes, links, sectors) {
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

	const nodeMap = {};

	nodes.forEach(node => {
		// Add links to node
		node.links = links.filter(
			link =>
				link.status === "active" &&
				(link.from === parseInt(node.id, 10) ||
					link.to === parseInt(node.id, 10))
		);

		nodeMap[node.id] = node;
	});

	links.forEach(link => {
		link.fromNode = nodeMap[link.from];
		link.toNode = nodeMap[link.to];
	});

	sectors.forEach(sector => {
		console.log(sector);
		sector.node = nodeMap[sector.nodeId];
	});

	return { nodes, links, sectors };
}

function getCounts(nodes, kiosks) {
	const counts = {};
	nodes.forEach(node => {
		const status = nodeStatus(node);
		counts[status] = (counts[status] || 0) + 1;

		if (status.indexOf("potential-") > -1 || status === "dead") {
			counts["potential"] = (counts["potential"] || 0) + 1;
		}

		if (status === "supernode" || status === "hub") {
			counts["active"] = (counts["active"] || 0) + 1;
		}
	});
	counts.linkNYC = kiosks.length;
	return counts;
}

export default reducer;
