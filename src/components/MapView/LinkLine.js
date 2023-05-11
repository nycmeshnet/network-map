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
		const { link, filters } = this.props;
		const { visibility } = this.state;
		switch (visibility) {
			case "highlight":
				if (filters.backbone) {
					if (!isBackbone(link)) return defaultOpacity * 2;
				}
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
		const { link, filters } = this.props;
		const { status } = link;

		const defaultOpacity = 1;
		var activeColor = "#007aff";
		
		// added fiber and vpn color 2022-03-26, added 60GHz 2023-5-11
		if (status === "fiber"){
			activeColor = "#f6be00"
		} else if (status === "vpn"){
			activeColor = "#cc99ff"
		} else if (status === "60GHz"){
			activeColor = "#03fcf8"
		}


		if (status === "fiber"||status === "vpn"||status === "active"||status === "60GHz") {
			if (filters.backbone && !isBackbone(link))
				return {
					strokeColor: "#ff2d55",
					strokeOpacity: defaultOpacity * 0.25,
					zIndex: 10
				};

			return {
				strokeColor: activeColor,
				strokeOpacity: defaultOpacity,
				zIndex: 20
			};
		}

		return {
			strokeColor: "#aaa",
			strokeOpacity: defaultOpacity,
			zIndex: 0
		};
	}
}

function isBackbone(link) {
	const { fromNode, toNode } = link;
	return fromNode.type !== "active" && toNode.type !== "active";
}
