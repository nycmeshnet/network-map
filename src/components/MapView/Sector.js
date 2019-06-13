import React, { PureComponent } from "react";
import { Polygon } from "react-google-maps";
import { sectorColors } from "../../utils";

const MAX_OPACITY = 0.3;
const INTERVAL_PER_MILE = 10;

const visibilityMultipliers = {
	highlight: 1,
	secondary: 0,
	dim: 0
};

const zIndexes = {
	highlight: 3,
	dim: 1
};

export default class Sector extends PureComponent {
	render() {
		const { sector, visibility } = this.props;
		const { status } = sector
		if (status !== "active" && status !== "potential") {
			return null
		}

		const [lng, lat] = sector.node.coordinates;
		const { radius, azimuth, width } = sector;

		const visibilityMultiplier = visibilityMultipliers[visibility];
		const multiplier =
			visibilityMultiplier === undefined ? 1 : visibilityMultiplier;
		const intervalCount = Math.ceil(INTERVAL_PER_MILE * radius);
		const fillOpacity = (MAX_OPACITY / intervalCount) * multiplier;
		const fillColor = this.getFillColor();
		const zIndex = zIndexes[visibility] || 1;

		const interval = radius / intervalCount;
		const radiusIndices = [...Array(intervalCount).keys()];

		return radiusIndices.map(index => {
			const circleRadius = interval * index;
			const path = getPath(lat, lng, circleRadius, azimuth, width);
			return (
				<Polygon
					key={index}
					path={path}
					options={{
						strokeColor: "transparent",
						strokeOpacity: 0,
						strokeWidth: 0,
						fillColor,
						fillOpacity,
						clickable: false,
						zIndex
					}}
				/>
			);
		});
	}

	getFillColor() {
		const { sector, node } = this.props;
		// TODO: Make this not hacky
		return (
			sectorColors[sector.status] ||
			sectorColors[node.type] ||
			sectorColors.default
		);
	}
}

function getPath(lat, lng, radius, azimuth, width) {
	var centerPoint = { lat, lng };
	var PRlat = (radius / 3963) * (180 / Math.PI); // using 3963 miles as earth's radius
	var PRlng = PRlat / Math.cos(lat * (Math.PI / 180));
	var PGpoints = [];
	PGpoints.push(centerPoint);

	const lat1 =
		lat + PRlat * Math.cos((Math.PI / 180) * (azimuth - width / 2));
	const lon1 =
		lng + PRlng * Math.sin((Math.PI / 180) * (azimuth - width / 2));
	PGpoints.push({ lat: lat1, lng: lon1 });

	const lat2 =
		lat + PRlat * Math.cos((Math.PI / 180) * (azimuth + width / 2));
	const lon2 =
		lng + PRlng * Math.sin((Math.PI / 180) * (azimuth + width / 2));

	var theta = 0;
	var gamma = (Math.PI / 180) * (azimuth + width / 2);

	for (var a = 1; theta < gamma; a++) {
		theta = (Math.PI / 180) * (azimuth - width / 2 + a);
		const PGlon = lng + PRlng * Math.sin(theta);
		const PGlat = lat + PRlat * Math.cos(theta);

		PGpoints.push({ lat: PGlat, lng: PGlon });
	}

	PGpoints.push({ lat: lat2, lng: lon2 });
	PGpoints.push(centerPoint);

	return PGpoints;
}
