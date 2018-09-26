import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import NodeName from "../NodeName";

export default class NodeRow extends PureComponent {
	render() {
		const { node, search, onClick } = this.props;
		const { id } = node;
		return (
			<Link className="link" to={`/nodes/${id}`}>
				<div
					onClick={onClick}
					key={id}
					className="pointer hover-bg-near-white bb b--light-gray pa3"
				>
					<NodeName node={node} search={search} />
				</div>
			</Link>
		);
	}
}
