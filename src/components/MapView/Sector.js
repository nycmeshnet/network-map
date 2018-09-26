import React, { PureComponent } from "react";
import { Polygon } from "react-google-maps";

export default class LinkLine extends PureComponent {
	render() {
		const { lat, lng, r, azimuth, width, potential } = this.props;
		var centerPoint = { lat, lng };
		var PRlat = r / 3963 * (180 / Math.PI); // using 3963 miles as earth's radius
		var PRlng = PRlat / Math.cos(lat * (Math.PI / 180));
		var PGpoints = [];
		PGpoints.push(centerPoint);

		const lat1 =
			lat + PRlat * Math.cos(Math.PI / 180 * (azimuth - width / 2));
		const lon1 =
			lng + PRlng * Math.sin(Math.PI / 180 * (azimuth - width / 2));
		PGpoints.push({ lat: lat1, lng: lon1 });

		const lat2 =
			lat + PRlat * Math.cos(Math.PI / 180 * (azimuth + width / 2));
		const lon2 =
			lng + PRlng * Math.sin(Math.PI / 180 * (azimuth + width / 2));

		var theta = 0;
		var gamma = Math.PI / 180 * (azimuth + width / 2);

		for (var a = 1; theta < gamma; a++) {
			theta = Math.PI / 180 * (azimuth - width / 2 + a);
			const PGlon = lng + PRlng * Math.sin(theta);
			const PGlat = lat + PRlat * Math.cos(theta);

			PGpoints.push({ lat: PGlat, lng: PGlon });
		}

		PGpoints.push({ lat: lat2, lng: lon2 });
		PGpoints.push(centerPoint);

		const fillOpacity = 0.125;

		return (
			<Polygon
				path={PGpoints}
				defaultOptions={{
					strokeColor: "transparent",
					strokeOpacity: 0,
					strokeWidth: 0,
					fillColor: potential ? "#777" : "#007aff",
					fillOpacity
				}}
			/>
		);
	}
}
