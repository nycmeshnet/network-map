import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";

import NodeMarker from "./NodeMarker";
import KioskMarker from "./KioskMarker";
import LinkLine from "./LinkLine";
import Sector from "./Sector";

import { mapStyles } from "./styles";

const options = {
	styles: mapStyles,
	fullscreenControl: false,
	mapTypeControl: false,
	backgroundColor: "#f5f5f5",
	gestureHandling: "greedy"
};

const MapComponent = withScriptjs(
	withGoogleMap(props => (
		<GoogleMap ref={props.mapRef} {...props}>
			{props.children}
		</GoogleMap>
	))
);

export default class MapView extends Component {
	constructor(props) {
		super(props);
		this.map = React.createRef();
		this.markerRefs = {};
		this.lineRefs = {};
	}

	componentDidMount() {
		if (this.props.match) {
			try {
				setTimeout(() => {
					if (!this.props.match) {
						return null;
					}

					const selectedNodeId = parseInt(
						this.props.match.params.nodeId,
						10
					);
					const selectedMarker = this.markerRefs[selectedNodeId];
					if (!selectedMarker) {
						return;
					}

					const { node: selectedNode } = selectedMarker.props;
					this.updateNodes(selectedNode, selectedMarker);
					this.updateLinks(selectedNode);
					this.panToNode(selectedNode);
				}, 500);
			} catch (e) {
				console.error(":(");
			}
		}
	}

	// This is a kinda hacky way to improve performance
	// Instead of rerending the entire map, rerender specific nodes
	shouldComponentUpdate(nextProps) {
		if (this.props.nodes !== nextProps.node) {
			this.handleSelectedChange(nextProps);
			return true;
		}

		return false;
	}

	handleSelectedChange(nextProps) {
		// If selected node is unchanged, do not rerender
		if (!this.props.match && !nextProps.match) return false;

		// If one was selected but none now selected, reset all nodes
		if (!nextProps.match) {
			this.resetAllNodes();
			return false;
		}

		const nextSelectedNodeId = parseInt(nextProps.match.params.nodeId, 10);
		const nextSelectedMarker = this.markerRefs[nextSelectedNodeId];

		if (!nextSelectedMarker) {
			return;
		}

		const { node: nextSelectedNode } = nextSelectedMarker.props;

		this.updateNodes(nextSelectedNode, nextSelectedMarker);
		this.updateLinks(nextSelectedNode);
		this.panToNode(nextSelectedNode);
	}

	render() {
		return (
			<MapComponent
				mapRef={this.map}
				defaultZoom={13}
				defaultCenter={{ lat: 40.7101809, lng: -73.9595798 }}
				defaultOptions={options}
				googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
				loadingElement={<div className="h-100 bg-map-beige" />}
				containerElement={<div className="h-100 bg-map-beige" />}
				mapElement={<div className="h-100 bg-map-beige" />}
			>
				{this.renderSectors()}
				{this.renderLinks()}
				{this.renderKiosks()}
				{this.renderNodes()}
			</MapComponent>
		);
	}

	renderNodes() {
		const { nodes, selectNode } = this.props;
		return nodes.map(node => (
			<NodeMarker
				key={node.id}
				ref={ref => {
					this.handleMarkerRef(ref);
				}}
				node={node}
				selectNode={selectNode}
			/>
		));
	}

	renderKiosks() {
		const { kiosks } = this.props;
		return kiosks.map(kiosk => (
			<KioskMarker key={kiosk.id} kiosk={kiosk} />
		));
	}

	renderLinks() {
		const { links } = this.props;
		return links.map((link, index) => (
			<LinkLine
				key={this.linkId(link)}
				ref={ref => {
					this.handleLineRef(ref);
				}}
				link={link}
			/>
		));
	}

	renderSectors() {
		return (
			<Fragment>
				<Sector
					lat={40.711137}
					lng={-74.001122}
					r={2}
					azimuth={55}
					width={90}
				/>
				<Sector
					lat={40.713991}
					lng={-73.929049}
					r={2}
					azimuth={180}
					width={220}
				/>
				<Sector
					lat={40.685823}
					lng={-73.917272}
					r={2}
					azimuth={180}
					width={360}
				/>
				<Sector
					potential={true}
					lat={40.657867}
					lng={-74.004904}
					r={2}
					azimuth={40}
					width={120}
				/>
				<Sector
					potential={true}
					lat={40.657867}
					lng={-74.004904}
					r={2}
					azimuth={160}
					width={120}
				/>
			</Fragment>
		);
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

	updateNodes(node, marker) {
		ReactDOM.unstable_batchedUpdates(() => {
			// Dim all nodes of same type

			// TODO: optimize performance by only resetting selected nodes
			// (selected node and all nodes of opposite type)
			Object.values(this.markerRefs).forEach(marker => {
				if (node.status === "Installed") {
					if (node.id !== marker.props.node.id) {
						marker.setVisibility("dim");
					}
				} else {
					if (marker.props.node.status === "Installed") {
						marker.setVisibility("default");
					} else {
						marker.setVisibility("dim");
					}
				}
			});

			// Highlight selected node
			marker.setVisibility("highlight");

			// Highlight directly connected nodes
			node.connectedNodes &&
				Object.keys(node.connectedNodes).forEach(connectedNodeId => {
					const connectedMarker = this.markerRefs[connectedNodeId];
					if (connectedMarker) {
						connectedMarker.setVisibility("highlight");
					}
				});
		});
	}

	updateLinks(node) {
		// Dim all links
		Object.values(this.lineRefs).forEach(line => line.setVisibility("dim"));

		// Highlight direct links
		node.links.forEach(link => {
			const line = this.lineRefs[this.linkId(link)];
			if (line) {
				line.setVisibility("highlight");
			}
		});
	}

	panToNode(node) {
		// TODO: only if out of viewport
		const [lng, lat] = node.coordinates;
		this.map.current.panTo({ lat, lng });
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
		return JSON.stringify(link.coordinates);
	}
}
