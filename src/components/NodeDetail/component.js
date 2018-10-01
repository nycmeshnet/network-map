import React, { PureComponent } from "react";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import { Link } from "react-router-dom";

import { nodeName } from "../../utils";

export default class NodeDetail extends PureComponent {
	render() {
		if (!this.props.match) return null;

		const { match, nodes } = this.props;

		const matchingNodes = nodes.filter(
			node => node.id === parseInt(match.params.nodeId, 10)
		);

		if (!matchingNodes.length) return null;

		const node = matchingNodes[0];
		const { coordinates } = node;
		const [lng, lat] = coordinates;

		return (
			<InfoBox
				position={new window.google.maps.LatLng(lat, lng)}
				options={{
					boxStyle: { overflow: "visible" },
					boxClass: "overflow-visible pointer-events-none",
					alignBottom: true,
					closeBoxURL: ``,
					enableEventPropagation: false
				}}
			>
				<div
					style={{
						marginLeft: "-50%",
						marginRight: "50%"
					}}
					className="mb1 flex flex-column items-center pointer-events-all"
				>
					<div className="flex items-center bg-white br2 overflow-hidden shadow-2">
						{this.renderImage(node)}
						<div className="pv1 ph2">
							<span className="f5 fw6 nowrap sans-serif">
								{nodeName(node)}
							</span>
						</div>
					</div>
					<svg
						viewBox="0 5 12 12"
						version="1.1"
						width="12"
						height="12"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							fill="white"
							d="M0 5l6 6 6-6H0z"
						/>
					</svg>
				</div>
			</InfoBox>
		);
	}

	renderImage(node) {
		const { id, panoramas } = node;
		if (!panoramas || !panoramas.length) {
			return null;
		}
		const [firstPanorama] = panoramas;
		return (
			<Link
				key={firstPanorama}
				to={`/nodes/${id}/panoramas/1`}
				className="db node-image"
			>
				<div
					className="h-100 w-100 cover bg-center bg-near-white"
					style={{
						backgroundImage: `url("/img/panorama/${firstPanorama}")`
					}}
				/>
			</Link>
		);
	}
}
