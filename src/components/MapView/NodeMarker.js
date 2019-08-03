import React, { PureComponent, Fragment } from "react";
import { Marker } from "react-google-maps";
import Sector from "./Sector";

class NodeMarker extends PureComponent {
	render() {
		const { node, visible, onClick } = this.props;
		const { notes, coordinates, memberNodes } = node;
		const [lng, lat] = coordinates;
		const title = `${memberNodes.map(n => n.id).join(", ")}${
			notes ? ` - ${notes}` : ""
		}`;
		const { icon, zIndex } = this.getMarkerProps();
		const adjustedZ = this.getZIndex(zIndex);
		const opacity = this.getOpacity();
		return (
			<Fragment>
				<Marker
					defaultPosition={{ lat, lng }}
					defaultTitle={title}
					icon={icon}
					options={{ opacity }}
					visible={visible}
					zIndex={adjustedZ}
					onClick={onClick}
				/>
				{this.renderSectors()}
			</Fragment>
		);
	}

	renderSectors() {
		const { node, visible, visibility, filters } = this.props;
		const { sectors } = node;

		if (!sectors || !visible) {
			return null;
		}

		return sectors.map(sector => {
			const isFiltered =
				sector.status === "potential" &&
				filters[sector.status] === false;
			if (isFiltered && visibility !== "highlight") {
				return null;
			}
			const key = node.id + sector.azimuth;
			return (
				<Sector
					key={key}
					sector={sector}
					visibility={visibility}
					node={node}
					filters={filters}
				/>
			);
		});
	}

	getOpacity() {
		const { visibility } = this.props;
		if (visibility === "highlight") return 1;
		if (visibility === "secondary") return 1;
		if (visibility === "dim") return 0.25;
		return 1;
	}

	getZIndex(defaultZIndex) {
		const { visibility } = this.props;
		if (visibility === "highlight") return defaultZIndex + 999;
		if (visibility === "secondary") return defaultZIndex + 998;
		return defaultZIndex;
	}

	getMarkerProps() {
		const { node, filters } = this.props;
		const { type } = node;

		if (type === "supernode")
			return {
				icon: {
					url: "/img/map/supernode.svg",
					anchor: { x: 14, y: 14 }
				},
				zIndex: 100
			};

		if (type === "hub")
			return {
				icon: {
					url: "/img/map/hub.svg",
					anchor: { x: 10, y: 10 }
				},
				zIndex: 93
			};

		if (type === "omni") {
			const url = filters.backbone
				? "/img/map/omni.svg"
				: "/img/map/active.svg";
			const zIndex = filters.backbone ? 92 : 91;
			return {
				icon: {
					url,
					anchor: { x: 7, y: 7 }
				},
				zIndex
			};
		}

		if (type === "remote") {
			const url = filters.backbone
				? "/img/map/remote.svg"
				: "/img/map/active.svg";
			const anchor = filters.backbone ? { x: 5, y: 5 } : { x: 7, y: 7 };

			return {
				icon: {
					url,
					anchor
				},
				zIndex: 90
			};
		}

		if (type === "kiosk") {
			const url = filters.backbone
				? "/img/map/remote.svg"
				: "/img/map/active.svg";
			const anchor = filters.backbone ? { x: 5, y: 5 } : { x: 7, y: 7 };

			return {
				icon: {
					url,
					anchor
				},
				zIndex: 90
			};
		}

		if (type === "active")
			return {
				icon: {
					url: "/img/map/active.svg",
					anchor: { x: 7, y: 7 }
				},
				zIndex: 91
			};

		if (type === "potential-supernode")
			return {
				icon: {
					url: "/img/map/potential-supernode.svg",
					anchor: { x: 14, y: 14 }
				},
				zIndex: 83
			};

		if (type === "potential-hub")
			return {
				icon: {
					url: "/img/map/potential-hub.svg",
					anchor: { x: 10, y: 10 }
				},
				zIndex: 82
			};

		if (type === "potential")
			return {
				icon: {
					url: "/img/map/potential.svg",
					anchor: { x: 7, y: 7 }
				},
				zIndex: 81
			};

		return {
			icon: {
				url: "/img/map/dead.svg",
				anchor: { x: 5, y: 5 }
			},
			zIndex: 80
		};
	}
}

export default class VisibilityMarker extends PureComponent {
	state = {
		visibility: "default"
	};

	render() {
		return (
			<NodeMarker {...this.props} visibility={this.state.visibility} />
		);
	}

	setVisibility(visibility) {
		this.setState({ visibility });
	}
}
