import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import DocumentTitle from "react-document-title";
import { distanceInWordsToNow, parse } from "date-fns";
import sanitizeHtml from "sanitize-html";

import NodeName from "../NodeName";

export default class NodeInfo extends PureComponent {
	render() {
		const { match, nodes } = this.props;

		const matchingNodes = nodes.filter(
			node => node.id === parseInt(match.params.nodeId, 10)
		);

		if (!matchingNodes.length) return null;

		const node = matchingNodes[0];
		const { id, notes, rooftopaccess, panoramas } = node;

		return (
			<DocumentTitle title={`Node ${id} - NYC Mesh`}>
				<div className="absolute bottom-0 z-999 sidebar-width w-100 pa2">
					<div className="flex flex-column bg-white shadow-2 pa3">
						<div className="f5 flex flex-column items-start">
							<NodeName node={node} />
							{this.renderRoofAccess(rooftopaccess)}
							{this.renderNotes(notes)}
						</div>
						{this.renderPanoramas(node)}
					</div>
				</div>
			</DocumentTitle>
		);
	}

	renderRoofAccess(rooftopaccess) {
		if (!rooftopaccess) {
			return null;
		}
		return (
			<div className="mt2 ph1 pv05 br1 bg-orange">
				<p className="ma0 f7 fw5 white">Roof Access</p>
			</div>
		);
	}

	renderNotes(notes) {
		if (!notes) {
			return null;
		}
		return <p className="mt3 mb0 i">{notes}</p>;
	}

	renderPanoramas(node) {
		const { id, panoramas } = node;

		if (!panoramas) {
			return null;
		}
		return (
			<div className="mt3">
				<div className="flex overflow-x-scroll mn05">
					{panoramas.map((panorama, index) => (
						<Link
							key={panorama}
							to={`/nodes/${id}/panoramas/${index + 1}`}
							className="db pa1 h3 w3 min-w-3 mv1"
						>
							<div
								className="h-100 w-100 cover bg-center bg-near-white"
								style={{
									backgroundImage: `url("/img/panorama/${panorama}")`
								}}
							/>
						</Link>
					))}
				</div>
			</div>
		);
	}
}
