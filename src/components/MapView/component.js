import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Polygon,
	OverlayView
} from "react-google-maps";
import { withRouter, Route } from "react-router";
import DocumentTitle from "react-document-title";
import PropTypes from "prop-types";
import { uniq, isEqual } from "lodash";

import NodeMarker from "./NodeMarker";
import KioskMarker from "./KioskMarker";
import LinkLine from "./LinkLine";
import NodeDetail from "../NodeDetail";
import Gallery from "../Gallery";

import { mapStyles } from "./styles";

const getPixelPositionOffset = (width, height) => ({
	x: -width / 2,
	y: -height
});

const DEFAULT_ZOOM = 11;
const DEFAULT_CENTER = { lat: 40.72, lng: -73.9595798 };

const options = {
	styles: mapStyles,
	fullscreenControl: false,
	streetViewControl: false,
	zoomControlOptions: {
		position: "9"
	},
	mapTypeControlOptions: {
		position: "3"
	},
	backgroundColor: "#f5f5f5",
	gestureHandling: "greedy",
	clickableIcons: false
};

const MapComponent = withScriptjs(
	withGoogleMap(props => (
		<GoogleMap ref={props.mapRef} {...props}>
			{props.children}
		</GoogleMap>
	))
);

class MapView extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	state = {
		commandPressed: false
	};

	constructor(props) {
		super(props);
		this.map = React.createRef();
		this.markerRefs = {};
		this.lineRefs = {};
		this.lastDoubleClick = Date.now();
	}

	componentDidMount() {
		this.keyDownHandler = this.handleKeyDown.bind(this);
		this.keyUpHandler = this.handleKeyUp.bind(this);
		window.addEventListener("keydown", this.keyDownHandler, false);
		window.addEventListener("keyup", this.keyUpHandler, false);

		if (this.props.match) {
			try {
				setTimeout(() => {
					this.handleSelectedChange(this.props);
				}, 500);
			} catch (e) {
				console.error(e);
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.keyDownHandler, false);
		window.removeEventListener("keyup", this.keyUpHandler, false);
	}

	// This is a kinda hacky way to improve performance
	// Instead of rerending the entire map, rerender specific nodes
	shouldComponentUpdate(nextProps) {
		const nodesChanged = !isEqual(this.props.nodes, nextProps.nodes);
		const matchChanged = this.props.match !== nextProps.match;
		const filtersChanged = this.props.filters !== nextProps.filters;
		if (nodesChanged || matchChanged || filtersChanged) {
			this.handleSelectedChange(nextProps);
			return true;
		}

		return false;
	}

	handleKeyDown(event) {
		const { keyCode } = event;
		if (keyCode === 27) {
			const { history } = this.context.router;
			history.push("/");
		}

		// Command key
		if (keyCode === 91 || keyCode === 93) {
			this.setState({ commandPressed: true });
		}
	}

	handleKeyUp(event) {
		const { keyCode } = event;

		// Command key
		if (keyCode === 91 || keyCode === 93) {
			this.setState({ commandPressed: false });
		}
	}

	handleSelectedChange(nextProps) {
		// If selected node is unchanged, do not rerender
		if (!this.props.match && !nextProps.match) return false;

		// If one was selected but none now selected, reset all nodes
		if (!nextProps.match) {
			this.resetAllNodes();
			return false;
		}

		const nextSelectedNodeIds = this.selectedNodeIds(nextProps.match);
		const nextSelectedMarkers = nextSelectedNodeIds
			.map(id => this.markerRefs[id])
			.filter(m => m); // filter null

		if (!nextSelectedMarkers.length) {
			return;
		}

		const nextSelectedNodes = nextSelectedMarkers.map(
			marker => marker.props.node
		);
		this.updateNodes(nextSelectedNodes, nextSelectedMarkers);

		const matchChanged = this.props.match !== nextProps.match;
		const nodesChanged = this.props.nodes !== nextProps.nodes;
		const fitBounds = !matchChanged && !nodesChanged;

		const filtersChanged = this.props.filters !== nextProps.filters;

		if (!filtersChanged) {
			this.updateLinks(nextSelectedNodes);
			this.panToNodes(nextSelectedNodes, fitBounds);
		}
	}

	render() {
		const { history } = this.context.router;
		return (
			<MapComponent
				mapRef={this.map}
				defaultZoom={DEFAULT_ZOOM}
				defaultCenter={DEFAULT_CENTER}
				defaultOptions={options}
				onClick={() => {
					// TODO: Make this less hacky
					setTimeout(() => {
						const now = Date.now();
						if (now - this.lastDoubleClick > 2000) {
							history.push("/");
						}
					}, 500);
				}}
				onDblClick={() => {
					const now = Date.now();
					this.lastDoubleClick = now;
				}}
				loadingElement={<div className="h-100" />}
				containerElement={<div className="h-100" />}
				mapElement={<div className="h-100" />}
				googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
			>
				{this.renderDistricts()}
				{this.renderLinks()}
				{this.renderKiosks()}
				{this.renderNodes()}
				{this.renderNodeDetail()}
				<Route
					exact
					path="/nodes/:nodeId/panoramas/:panoId"
					component={Gallery}
				/>
			</MapComponent>
		);
	}

	renderDistricts() {
		const { districts } = this.props;
		const { features } = districts;
		return features.map((feature, featureIndex) => {
			const { geometry, properties } = feature;
			const { coordinates } = geometry;
			const { coun_dist, shape_area, shape_leng } = properties;

			const areaPaths = [],
				areaMarkers = [];
			coordinates.forEach((area, index) => {
				let [minLat, minLng, maxLat, maxLng] = [
					Number.MAX_SAFE_INTEGER,
					Number.MAX_SAFE_INTEGER,
					0,
					0
				];
				const paths = area.map(area =>
					area.map(([lng, lat]) => {
						minLat = Math.min(lat, minLat || lat);
						minLng = Math.min(lng, minLng || lng);
						maxLat = Math.max(lat, maxLat || lat);
						maxLng = Math.max(lng, maxLng || lng);
						return { lat, lng };
					})
				);
				areaPaths.push(...paths);
				if (index === 0) {
					const midLat = minLat + (maxLat - minLat) / 2;
					const midLng = minLng + (maxLng - minLng) / 2;
					areaMarkers.push({
						label: coun_dist,
						lat: midLat,
						lng: midLng
					});
				}
			});

			return (
				<Fragment key={coun_dist + featureIndex}>
					{areaPaths.map((path, areaIndex) => (
						<Polygon
							key={coun_dist + areaIndex}
							defaultPath={path}
							options={{
								strokeColor: "rgba(0,0,0,1)",
								fillColor: colorForDistrict(coun_dist)
							}}
						/>
					))}
					{
						// 	areaMarkers.map(marker => (
						// 	<OverlayView
						// 		defaultPosition={
						// 			new window.google.maps.LatLng(
						// 				marker.lat,
						// 				marker.lng
						// 			)
						// 		}
						// 		mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
						// 		getPixelPositionOffset={getPixelPositionOffset}
						// 	>
						// 		<div>
						// 			<span>{marker.label}</span>
						// 		</div>
						// 	</OverlayView>
						// ))
					}
				</Fragment>
			);
		});

		function colorForDistrict(num) {
			const colors = {
				0: "red",
				1: "orange",
				2: "yellow",
				3: "green",
				4: "blue",
				5: "violet"
			};
			const key = num % 6;
			return colors[key];
		}
	}

	renderNodes() {
		const { nodes, filters } = this.props;

		// TODO: Refactor
		const selectedIds = this.selectedNodeIds().reduce(
			(idMap, nodeId) => ({ ...idMap, [nodeId]: true }),
			{}
		);
		return nodes.map(node => {
			const isFiltered = filters[node.type] === false;
			const isSelected = selectedIds[node.id] === true;
			const visible = !isFiltered || isSelected;

			return (
				<NodeMarker
					key={node.id}
					node={node}
					visible={visible}
					filters={filters}
					onClick={() => this.handleNodeClick(node)}
					ref={ref => this.handleMarkerRef(ref)}
				/>
			);
		});
	}

	renderLinks() {
		const { links, filters } = this.props;
		return links.map((link, index) => {
			const { fromNode, toNode, status } = link;
			if (!fromNode || !toNode) return null;

			const isFiltered =
				filters[fromNode.type] === false ||
				filters[toNode.type] === false ||
				(status === "potential" && filters.potential === false);
			const visible = !isFiltered;
			return (
				<LinkLine
					key={this.linkId(link)}
					ref={ref => {
						this.handleLineRef(ref);
					}}
					visible={visible}
					link={link}
				/>
			);
		});
	}

	renderKiosks() {
		const { kiosks } = this.props;
		return kiosks.map(kiosk => (
			<KioskMarker key={kiosk.id} kiosk={kiosk} />
		));
	}

	renderNodeDetail() {
		const { match } = this.props;
		if (!match || !match.params) {
			return null;
		}
		const nodeIds = this.selectedNodeIds();

		const nodeTitles = nodeIds.join(", ");
		const title = `${nodeTitles} - Map - NYC Mesh`;
		return (
			<DocumentTitle title={title}>
				<Fragment>
					{nodeIds.map(id => (
						<NodeDetail key={id} nodeId={id} />
					))}
				</Fragment>
			</DocumentTitle>
		);
	}

	handleNodeClick(node) {
		const { match } = this.props;
		const { history } = this.context.router;

		// Command click selects multiple nodes
		if (this.state.commandPressed && match && match.params.nodeId) {
			const nodeIds = this.selectedNodeIds();
			const selectedId = node.id.toString();

			let newNodeIds = [];
			if (nodeIds.indexOf(selectedId) > -1) {
				newNodeIds = nodeIds.filter(nodeId => nodeId !== selectedId);
			} else {
				nodeIds.push(selectedId);
				newNodeIds = nodeIds;
			}

			const newNodeIdString = uniq(newNodeIds)
				.sort()
				.join("-");
			history.replace(`/nodes/${newNodeIdString}`);
		} else {
			history.push(`/nodes/${node.id}`);
		}
	}

	resetAllNodes() {
		ReactDOM.unstable_batchedUpdates(() => {
			Object.values(this.markerRefs).forEach(marker =>
				marker.setVisibility("default")
			);

			Object.values(this.lineRefs).forEach(line =>
				line.setVisibility("default")
			);
		});
	}

	updateNodes(selectedNodes, markers) {
		ReactDOM.unstable_batchedUpdates(() => {
			// Dim all nodes
			Object.values(this.markerRefs).forEach(marker => {
				marker.setVisibility("dim");
			});

			// Highlight directly connected nodes
			selectedNodes.forEach(node => {
				if (node.connectedNodes) {
					node.connectedNodes.forEach(nodeId => {
						const connectedMarker = this.markerRefs[nodeId];
						if (connectedMarker) {
							connectedMarker.setVisibility("secondary");
						}
					});
				}
			});

			// Highlight selected nodes
			markers.forEach(marker => marker.setVisibility("highlight"));
		});
	}

	updateLinks(nodes) {
		ReactDOM.unstable_batchedUpdates(() => {
			// Dim all links
			Object.values(this.lineRefs).forEach(line =>
				line.setVisibility("dim")
			);

			// Highlight direct links
			nodes.forEach(node => {
				if (node.links) {
					node.links.forEach(link => {
						const line = this.lineRefs[this.linkId(link)];
						if (line) {
							line.setVisibility("highlight");
						}
					});
				}
			});
		});
	}

	panToNodes(nodes, fitBounds) {
		if (nodes.length === 1) {
			const [lng, lat] = nodes[0].coordinates;
			this.map.current.panTo({ lng, lat });
			return;
		}

		let minLng = 9999,
			minLat = 9999,
			maxLng = -9999,
			maxLat = -9999;

		nodes.forEach(node => {
			const [lng, lat] = node.coordinates;
			if (lng < minLng) minLng = lng;
			if (lng > maxLng) maxLng = lng;
			if (lat < minLat) minLat = lat;
			if (lat > maxLat) maxLat = lat;
		});

		const newBounds = {
			east: maxLng,
			north: maxLat,
			south: minLat,
			west: minLng
		};

		if (fitBounds) {
			this.map.current.fitBounds(newBounds, window.innerWidth / 10);
		} else {
			this.map.current.panToBounds(newBounds, window.innerWidth / 10);
		}
	}

	handleMarkerRef(ref) {
		if (ref) {
			this.markerRefs[ref.props.node.id] = ref;
		}
	}

	handleLineRef(ref) {
		if (ref) {
			this.lineRefs[this.linkId(ref.props.link)] = ref;
		}
	}

	linkId(link) {
		return `${link.from}-${link.to} ${link.status}`;
	}

	selectedNodeIds(match = this.props.match) {
		if (!match || !match.params || !match.params.nodeId) {
			return [];
		}
		return match.params.nodeId.split("-");
	}
}

export default withRouter(MapView);
