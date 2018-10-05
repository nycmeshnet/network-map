import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import NodeMarker from "./NodeMarker";
import KioskMarker from "./KioskMarker";
import LinkLine from "./LinkLine";
import Sector from "./Sector";
import NodeDetail from "../NodeDetail";

import { mapStyles } from "./styles";

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

	constructor(props) {
		super(props);
		this.map = React.createRef();
		this.markerRefs = {};
		this.lineRefs = {};
	}

	componentDidMount() {
		this.keyDownHandler = this.handleKeyDown.bind(this);
		window.addEventListener("keydown", this.keyDownHandler, false);

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

	componentWillUnmount() {
		window.removeEventListener("keydown", this.keyDownHandler, false);
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

	handleKeyDown(event) {
		if (event.keyCode === 27) {
			const { history } = this.context.router;
			history.push("/");
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
		const { history } = this.context.router;
		return (
			<MapComponent
				mapRef={this.map}
				defaultZoom={13}
				defaultCenter={{ lat: 40.7101809, lng: -73.9595798 }}
				defaultOptions={options}
				onClick={() => history.push("/")}
				googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
				loadingElement={<div className="h-100 bg-map-beige" />}
				containerElement={<div className="h-100 bg-map-beige" />}
				mapElement={<div className="h-100 bg-map-beige" />}
			>
				{this.renderSectors()}
				{this.renderLinks()}
				{this.renderKiosks()}
				{this.renderNodes()}
				<NodeDetail match={this.props.match} />
			</MapComponent>
		);
	}

	renderNodes() {
		const { nodes } = this.props;
		return nodes.map(node => (
			<NodeMarker
				key={node.id}
				ref={ref => {
					this.handleMarkerRef(ref);
				}}
				node={node}
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
		const { sectors } = this.props;
		return (
			<Fragment>
				{sectors.map(sector => {
					const [lng, lat] = sector.node.coordinates;
					const { radius, azimuth, width, active } = sector;
					return (
						<Sector
							key={lat + lng + radius + azimuth + width}
							lat={lat}
							lng={lng}
							radius={radius}
							azimuth={azimuth}
							width={width}
							active={active}
						/>
					);
				})}
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
				node.connectedNodes.forEach(connectedNodeId => {
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
		if (node.links) {
			node.links.forEach(link => {
				const line = this.lineRefs[this.linkId(link)];
				if (line) {
					line.setVisibility("highlight");
				}
			});
		}
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
		return `${link.from}-${link.to} ${link.coordinates} ${link.status}`;
	}
}

export default withRouter(MapView);
