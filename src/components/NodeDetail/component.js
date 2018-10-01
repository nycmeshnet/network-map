import React, { PureComponent } from "react";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import { Link } from "react-router-dom";

export default class NodeDetail extends PureComponent {
	render() {
		if (!this.props.match) return null;

		const { match, nodes } = this.props;

		const matchingNodes = nodes.filter(
			node => node.id === parseInt(match.params.nodeId, 10)
		);

		if (!matchingNodes.length) return null;

		const node = matchingNodes[0];
		const { id, coordinates } = node;
		const [lng, lat] = coordinates;

		return (
			<InfoBox
				position={{
					lat,
					lng,
					lat: () => lat,
					lng: () => lng
				}}
				options={{
					boxStyle: { overflow: "visible" },
					alignBottom: true,
					closeBoxURL: ``,
					enableEventPropagation: true
				}}
			>
				<div
					style={{
						marginLeft: "-50%",
						marginRight: "50%"
					}}
					className="mb1 flex flex-column items-center"
				>
					<div className="flex items-center bg-white br2 overflow-hidden shadow-1">
						{this.renderImage(node)}
						<div className="pv1 ph2">
							<span className="f5 fw6 nowrap sans-serif">{id}</span>
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
				className="db h2 w2"
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
