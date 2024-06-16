import React, { PureComponent } from "react";
import { OverlayView } from "react-google-maps";
import { Link } from "react-router-dom";

const getPixelPositionOffset = (width, height) => ({
	x: -width / 2,
	y: -height
});

export default class NodeDetail extends PureComponent {
	render() {
		const { nodeId, nodesById } = this.props;

		if (!nodeId || !nodesById) {
			return null;
		}

		const node = nodesById[nodeId];
		if (!node) {
			return null;
		}

		const { coordinates } = node;
		const [lng, lat] = coordinates;

		return (
			<OverlayView
				position={new window.google.maps.LatLng(lat, lng)}
				mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
				getPixelPositionOffset={getPixelPositionOffset}
			>
				<div
					ref={ref =>
						ref &&
						window.google.maps.OverlayView.preventMapHitsFrom(ref)
					}
					className="flex flex-column items-center"
				>
					<div className="flex items-center bg-white br2 overflow-hidden shadow-2">
						{this.renderImage(node)}
						<div className="pv1 ph2 flex flex-column justify-end">
							<span className="f5 fw6 nowrap sans-serif">
								{node.name || node.id}
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
			</OverlayView>
		);
	}

	renderImage(node) {
		const { id, panoramas } = node;
		if (!panoramas || !panoramas.length) {
			return null;
		}
		const [firstPanorama] = panoramas;
		return (
			<Link to={`/nodes/${id}/panoramas/1`} className="db h2 w2">
				<div
					className="h-100 w-100 cover bg-center bg-near-white"
					style={{
						backgroundImage: `url("https://node-db.netlify.app/panoramas/${firstPanorama}")`
					}}
				/>
			</Link>
		);
	}

	renderNotes(node) {
		const { notes } = node;
		if (!notes) {
			return null;
		}
		return <span className="mv0 f7 gray truncate sans-serif">{notes}</span>;
	}
}
