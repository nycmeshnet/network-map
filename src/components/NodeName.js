import React, { PureComponent } from "react";
import Highlighter from "react-highlight-words";

export const icons = {
	dead: (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
			<circle
				cx="7"
				cy="7"
				r="5"
				stroke="#fff"
				strokeWidth="2"
				fill="#aaa"
				opacity="1"
			/>
		</svg>
	),
	potential: (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
			<circle
				cx="8"
				cy="8"
				r="6"
				stroke="#fff"
				strokeWidth="2"
				fill="#777"
				opacity="1"
			/>
		</svg>
	),
	"potential-hub": (
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
			<circle
				fill="#777"
				stroke="white"
				r="8"
				strokeWidth="3"
				cy="11"
				cx="11"
			/>
		</svg>
	),
	"potential-supernode": (
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
			<g>
				<circle
					opacity="1"
					fill="#777"
					strokeWidth="4"
					stroke="#fff"
					r="10"
					cy="14"
					cx="14"
				/>
			</g>
		</svg>
	),
	active: (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
			<circle
				fill="rgb(255,45,85)"
				stroke="white"
				r="6"
				strokeWidth="2"
				cx="8"
				cy="8"
			/>
		</svg>
	),
	hub: (
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
			<circle
				fill="rgb(90,200,250)"
				stroke="white"
				r="8"
				strokeWidth="3"
				cy="11"
				cx="11"
			/>
		</svg>
	),
	supernode: (
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
			<g>
				<circle
					opacity="1"
					fill="#007aff"
					strokeWidth="4"
					stroke="#fff"
					r="10"
					cy="14"
					cx="14"
				/>
			</g>
		</svg>
	),
	linkNYC: (
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<circle
				cx="10"
				cy="10"
				r="3"
				stroke="white"
				strokeWidth="0"
				fill="#01a2eb"
				opacity="1"
			/>
		</svg>
	)
};

export default class NodeName extends PureComponent {
	render() {
		const { node, search } = this.props;
		const name = node.name || `Node ${node.id}`;
		return (
			<div className="h1 w-100 overflow-visible flex justify-start items-center">
				<div className="h2 w2 min-h2 min-w2 flex items-center justify-center">
					{icons[node.type]}
				</div>
				<div className="pl1 flex-1 truncate">
					<span className="db f5 fw6 black mv0">
						<Highlighter
							highlightClassName="bg-light-yellow"
							searchWords={[search]}
							autoEscape={true}
							textToHighlight={name}
						/>
					</span>

					{node.notes ? (
						<span className="db f7 gray mv05 truncate">
							<Highlighter
								highlightClassName="bg-light-yellow dark-gray"
								searchWords={[search]}
								autoEscape={true}
								textToHighlight={node.notes}
							/>
						</span>
					) : null}
				</div>
			</div>
		);
	}
}
