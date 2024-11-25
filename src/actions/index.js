export function fetchNodes(dispatch) {
	fetch("https://db.nycmesh.net/api/v1/mapdata/nodes/?format=json")
		.then(res => res.json())
		.then(json => {
			dispatch({ type: "FETCH_NODES_SUCCESS", nodes: json });
		})
		.catch(err => console.log(err));
}

export function fetchLinks(dispatch) {
	fetch("https://db.nycmesh.net/api/v1/mapdata/links/?format=json")
		.then(res => res.json())
		.then(json => {
			dispatch({ type: "FETCH_LINKS_SUCCESS", links: json });
		})
		.catch(err => console.log(err));
}

export function fetchSectors(dispatch) {
	fetch("https://db.nycmesh.net/api/v1/mapdata/sectors/?format=json")
		.then(res => res.json())
		.then(json => {
			dispatch({ type: "FETCH_SECTORS_SUCCESS", sectors: json });
		})
		.catch(err => console.log(err));
}

export function fetchKiosks(dispatch) {
	fetch("https://db.nycmesh.net/api/v1/mapdata/kiosks/?format=json")
		.then(res => res.json())
		.then(json => {
			dispatch({ type: "FETCH_KIOSKS_SUCCESS", kiosks: json });
		})
		.catch(err => console.log(err));
}

export function toggleFilter(label, dispatch) {
	dispatch({ type: "TOGGLE_FILTER", label });
}

export function toggleFilters(dispatch) {
	dispatch({ type: "TOGGLE_FILTERS" });
}
