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
				<div className="flex flex-column bg-white h-100 absolute top-0 left-0 right-0 bottom-0">
					<Link className="link" to="/">
						<button className="blue flex items-center bg-transparent ph1 ph0 pv1 mv2 btn bn on pointer">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="15 18 9 12 15 6" />
							</svg>
							Back
						</button>
					</Link>
					<div className="h-100 overflow-y-scroll">
						<div className="ph3 f5  flex flex-column items-start">
							<NodeName node={node} />
							{rooftopaccess && (
								<div className="mt2 ph1 pv05 br1 bg-orange">
									<p className="ma0 f7 fw5 white">
										Roof Access
									</p>
								</div>
							)}
							<p className="mv1 i">{notes}</p>
						</div>
						{panoramas ? (
							<div className="pv2 flex flex-wrap ph3">
								{panoramas.map((panorama, index) => (
									<Link
										key={panorama}
										to={`/nodes/${id}/panoramas/${index +
											1}`}
										className="db w-100 h4 mv1"
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
						) : null}

						<div>
							{node.tickets
								? node.tickets.map(ticket => (
										<div
											key={ticket.created + ticket.poster}
											className="ph3"
										>
											<div className="pv3 bb b--light-gray ">
												<div className="f5 mb2 flex justify-between">
													<p className="mv0 fw6">{`${
														ticket.poster
													}`}</p>
													<time className="db mid-gray">
														{`${distanceInWordsToNow(
															parse(
																ticket.created
															)
														)} ago`}
													</time>
												</div>
												<div
													className="overflow-hidden word-wrap mv0"
													dangerouslySetInnerHTML={{
														__html: sanitizeHtml(
															ticket.body
														)
													}}
												/>
											</div>
										</div>
								  ))
								: null}
						</div>
					</div>
				</div>
			</DocumentTitle>
		);
	}
}
