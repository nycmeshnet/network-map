import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DocumentTitle from "react-document-title";

export default class Gallery extends PureComponent {
	static contextTypes = {
		router: PropTypes.object
	};

	componentDidMount() {
		this.keyDownHandler = this.handleKeyDown.bind(this);
		window.addEventListener("keydown", this.keyDownHandler, false);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.keyDownHandler, false);
	}

	handleKeyDown(event) {
		if (event.keyCode === 27) {
			const { match } = this.props;
			const { nodeId } = match.params;
			const { history } = this.context.router;
			history.push(`/nodes/${nodeId}`);
		}
	}

	render() {
		const { match, nodes } = this.props;
		const { nodeId, panoId } = match.params;
		const matchingNodes = nodes.filter(
			node => node.id === parseInt(nodeId, 10)
		);
		if (!matchingNodes || !matchingNodes.length) {
			return null;
		}

		const { panoramas } = matchingNodes[0];
		if (!panoramas || !panoramas.length) {
			return null;
		}

		const src = panoramas[panoId - 1];

		return (
			<DocumentTitle
				title={`Panorama ${panoId} - Node ${nodeId} - NYC Mesh`}
			>
				<div
					onKeyDown={e => this.onKeyPressed(e)}
					className="fixed absolute--fill bg-black flex items-center justify-center z-max"
				>
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

	onKeyPressed(e) {}
}
