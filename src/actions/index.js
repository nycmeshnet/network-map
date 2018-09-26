export function selectNode(node, dispatch) {
	dispatch({ type: "SELECT_NODE", node });
}

export function toggleFilter(label, dispatch) {
	dispatch({ type: "TOGGLE_FILTER", label });
}
