import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DocumentTitle from "react-document-title";

export default class Gallery extends PureComponent {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			panoramas: this.getPanoramas()
		};
	}

	componentDidMount() {
		this.keyDownHandler = this.handleKeyDown.bind(this);
		window.addEventListener("keydown", this.keyDownHandler, false);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.keyDownHandler, false);
	}

	handleKeyDown(event) {
		const { keyCode } = event;
		const { match } = this.props;
		const { panoramas } = this.state;
		const { nodeId, panoId } = match.params;
		const { history } = this.context.router;
		const panoIdInt = parseInt(panoId);
		if (keyCode === 27) {
			history.push(`/nodes/${nodeId}`);
		} else if (keyCode === 39) {
			const nextPanoId = panoIdInt < panoramas.length ? panoIdInt + 1 : 1;
			history.push(`/nodes/${nodeId}/panoramas/${nextPanoId}`);
		} else if (keyCode === 37) {
			const prevPanoId = panoId > 1 ? panoIdInt - 1 : panoramas.length;
			history.push(`/nodes/${nodeId}/panoramas/${prevPanoId}`);
		}
	}

	render() {
		const { match } = this.props;
		const { nodeId, panoId } = match.params;
		const { panoramas } = this.state;
		const src = panoramas[panoId - 1];

		return (
			<DocumentTitle
				title={`Panorama ${panoId} - Node ${nodeId} - NYC Mesh`}
			>
				<div className="fixed absolute--fill bg-black flex items-center justify-center z-max">
					<Link to=".." className="absolute top-0 left-0 ma3 white">
						<svg
							className="db ma0"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</Link>

					<img
						onClick={() =>
							window
								.open(
									`https://node-db.netlify.com/panoramas/${src}`,
									"_blank"
								)
								.focus()
						}
						className="db center mh-100 mw-100 zoom-in"
						src={`https://node-db.netlify.com/panoramas/${src}`}
						alt="Panorama"
					/>
				</div>
			</DocumentTitle>
		);
	}

	getPanoramas() {
		const { match, nodes } = this.props;
		const { nodeId, panoId } = match.params;
		const matchingNodes = nodes.filter(
			node => node.id === parseInt(nodeId, 10)
		);
		if (!matchingNodes || !matchingNodes.length) {
			return [];
		}

		const { panoramas } = matchingNodes[0];
		if (!panoramas || !panoramas.length) {
			return [];
		}

		return panoramas;
	}
}
