import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Marker } from "react-google-maps";
import { withRouter } from "react-router";

import { nodeStatus } from "../../utils";

class NodeMarker extends PureComponent {
	static contextTypes = {
		router: PropTypes.object
	};

	render() {
		const { node } = this.props;
		const { history } = this.context.router;
		const { id, notes } = node;
		const [lng, lat] = node.coordinates;
		const { icon, zIndex } = this.getMarkerProps();

		return (
			<Marker
				defaultPosition={{ lat, lng }}
				icon={icon}
				title={`${id}${notes ? ` - ${notes}` : ""}`}
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

		const status = nodeStatus(node);

		if (status === "supernode")
			return {
				icon: {
					url: "/img/map/supernode.svg",
					anchor: { x: 14, y: 14 }
				},
				zIndex: 100
			};

		if (status === "hub")
			return {
				icon: {
					url: "/img/map/hub.svg",
					anchor: { x: 10, y: 10 }
				},
				zIndex: 99
			};

		if (status === "active")
			return {
				icon: {
					url: "/img/map/active.svg",
					anchor: { x: 10, y: 10 }
				},
				zIndex: 98
			};

		if (status === "potential-supernode")
			return {
				icon: {
					url: "/img/map/potential-supernode.svg",
					anchor: { x: 14, y: 14 }
				},
				zIndex: 89
			};

		if (status === "potential-hub")
			return {
				icon: {
					url: "/img/map/potential-hub.svg",
					anchor: { x: 10, y: 10 }
				},
				zIndex: 88
			};

		if (status === "potential")
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
