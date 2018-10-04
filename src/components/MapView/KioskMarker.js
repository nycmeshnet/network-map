import React, { PureComponent } from "react";
import { Marker } from "react-google-maps";

export default class KioskMarker extends PureComponent {
	render() {
		const { kiosk } = this.props;
		const [lng, lat] = kiosk.coordinates;
		const icon = {
			url: "/img/map/kiosk.svg",
			anchor: { x: 5, y: 5 }
		};
		return <Marker defaultPosition={{ lat, lng }} icon={icon} zIndex={1} />;
	}
}
