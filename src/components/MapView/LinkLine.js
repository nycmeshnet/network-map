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
					strokeOpacity: this.getOpacity(strokeOpacity)
				}}
				visible={visible}
				zIndex={this.getZIndex(zIndex)}
			/>
		);
	}

	getOpacity(defaultOpacity) {
		const { visibility } = this.state;
		if (visibility === "highlight") return 1;
		if (visibility === "dim") return defaultOpacity * 0.125;
		return defaultOpacity;
	}

	getZIndex(defaultZIndex) {
		const { visibility } = this.state;
		if (visibility === "highlight") return 60;
		return defaultZIndex;
	}

	setVisibility(visibility) {
		this.setState({ visibility });
	}

	getLineProps() {
		const { link } = this.props;
		const { status } = link;

		if (status === "active")
			return {
				strokeColor: "#007aff",
				strokeOpacity: 1,
				zIndex: 50
			};

		return {
			strokeColor: "#aaa",
			strokeOpacity: 0.25,
			zIndex: 50
		};
	}
}
