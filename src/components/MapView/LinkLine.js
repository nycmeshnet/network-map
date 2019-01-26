import React, { PureComponent } from "react";
import { Polyline } from "react-google-maps";

export default class LinkLine extends PureComponent {
	state = {
		visibility: "default"
	};

	render() {
		const { link, visible } = this.props;
		const { fromNode, toNode } = link;

		if (!fromNode || !toNode) {
			return null;
		}

		const [lng1, lat1] = fromNode.coordinates;
		const [lng2, lat2] = toNode.coordinates;
		const latlng1 = { lat: lat1, lng: lng1 };
		const latlng2 = { lat: lat2, lng: lng2 };

		const { strokeColor, strokeOpacity, zIndex } = this.getLineProps();

		return (
			<Polyline
				path={[latlng1, latlng2]}
				options={{
					strokeColor,
					strokeWeight: 2.5,
					strokeOpacity: this.getOpacity(strokeOpacity),
					zIndex: this.getZIndex(zIndex)
				}}
				visible={visible}
			/>
		);
	}

	getOpacity(defaultOpacity) {
		const { visibility } = this.state;
		switch (visibility) {
			case "highlight":
				return 1;
			case "dim":
				return defaultOpacity * 0.1;
			default:
				return defaultOpacity;
		}
	}

	getZIndex(defaultZIndex) {
		const { link } = this.props;
		const { visibility } = this.state;
		const bonus = link.status === "active" ? 20 : 0;
		if (visibility === "highlight") return 30 + bonus;
		return defaultZIndex + bonus;
	}

	setVisibility(visibility) {
		this.setState({ visibility });
	}

	getLineProps() {
		const { link } = this.props;
		const { status } = link;

		const defaultOpacity = 1;

		if (status === "active")
			return {
				strokeColor: "#007aff",
				strokeOpacity: defaultOpacity,
				zIndex: 10
			};

		return {
			strokeColor: "#aaa",
			strokeOpacity: defaultOpacity,
			zIndex: 0
		};
	}
}
