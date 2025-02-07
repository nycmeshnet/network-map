import React, { PureComponent } from "react";
import { OverlayView } from "react-google-maps";
import { Link } from "react-router-dom";

const getPixelPositionOffset = (width, height) => ({
	x: -width / 2,
	y: -height
});

export default class NodeDetail extends PureComponent {
    constructor(props) {
		super(props);
		this.state = {
			panoramas: []
		};
	}

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const panoResponse = await fetch(`http://127.0.0.1:8001/api/v1/install/${this.props.nodeId}`);
      const j = await panoResponse.json();
	  let urls = j.map(image => image.url);
      this.setState({ panoramas: urls });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
		const { id } = node;
		if (!this.state.panoramas || !this.state.panoramas.length) {
			return null;
		}
		const [firstPanorama] = this.state.panoramas;
		return (
			<Link to={`/nodes/${id}/panoramas/1`} className="db h2 w2">
				<div
					className="h-100 w-100 cover bg-center bg-near-white"
					style={{
						backgroundImage: `url("${firstPanorama}")`
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
