import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Marker } from "react-google-maps";
import { withRouter } from "react-router";

class NodeMarker extends PureComponent {
	static contextTypes = {
		router: PropTypes.object
	};

	render() {
		const { node } = this.props;
		const { history } = this.context.router;
		const { id } = node;
		const [lng, lat] = node.coordinates;
		const { icon, zIndex } = this.getMarkerProps();

		return (
			<Marker
				defaultPosition={{ lat, lng }}
				icon={icon}
				options={{ opacity: this.getOpacity() }}
				zIndex={this.getZIndex(zIndex)}
				onClick={() => history.push(`/nodes/${id}`)}
			/>
		);
	}

	getOpacity() {
		const { visibility } = this.props;
		if (visibility === "highlight") return 1;
		if (visibility === "dim") return 0.25;
		return 1;
	}

	getZIndex(defaultZIndex) {
		const { visibility } = this.props;
		if (visibility === "highlight") return 999;
		return defaultZIndex;
	}

	getMarkerProps() {
		const { node } = this.props;
		const { status, notes, tickets } = node;
		const isActive = status === "Installed";
		const isSupernode = notes.toLowerCase().indexOf("supernode") > -1;
		const isHub = notes.toLowerCase().indexOf("hub") > -1;
		const isResponsive = tickets && tickets.length > 2;

		if (isActive) {
			if (isSupernode)
				return {
					icon: {
						url: "/img/map/supernode.svg",
						anchor: { x: 14, y: 14 }
					},
					zIndex: 100
				};

			if (isHub)
				return {
					icon: {
						url: "/img/map/hub.svg",
						anchor: { x: 10, y: 10 }
					},
					zIndex: 99
				};

			return {
				icon: {
					url: "/img/map/active.svg",
					anchor: { x: 10, y: 10 }
				},
				zIndex: 98
			};
		}

		if (isSupernode)
			return {
				icon: {
					url: "/img/map/potential-supernode.svg",
					anchor: { x: 14, y: 14 }
				},
				zIndex: 89
			};

		if (isHub)
			return {
				icon: {
					url: "/img/map/potential-hub.svg",
					anchor: { x: 10, y: 10 }
				},
				zIndex: 88
			};

		if (isResponsive)
			return {
				icon: {
					url: "/img/map/potential.svg",
					anchor: { x: 8, y: 8 }
				},
				zIndex: 87
			};

		return {
			icon: {
				url: "/img/map/dead.svg",
				anchor: { x: 7, y: 7 }
			},
			zIndex: 86
		};
	}
}

const RouterNodeMarker = withRouter(NodeMarker);

export default class CombinedMarker extends PureComponent {
	state = {
		visibility: "default"
	};

	render() {
		return (
			<RouterNodeMarker
				{...this.props}
				visibility={this.state.visibility}
			/>
		);
	}

	setVisibility(visibility) {
		this.setState({ visibility });
	}
}
