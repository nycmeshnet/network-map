import React, { PureComponent } from "react";
import Highlighter from "react-highlight-words";

import { nodeStatus } from "../utils";

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
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<g>
				<circle
					opacity="1"
					fill="#777"
					strokeWidth="2"
					stroke="#fff"
					r="8"
					cy="10"
					cx="10"
				/>
			</g>
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
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<circle
				cx="10"
				cy="10"
				r="8"
				stroke="#fff"
				strokeWidth="2"
				fill="rgb(255,59,48)"
				opacity="1"
			/>
		</svg>
	),
	hub: (
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
			<g>
				<circle
					opacity="1"
					fill="rgb(90,200,250)"
					strokeWidth="2"
					stroke="#fff"
					r="8"
					cy="10"
					cx="10"
				/>
			</g>
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
		return (
			<div className="h1 overflow-visible flex justify-start items-center">
				<div className="flex items-center justify-center">
					{icons[nodeStatus(node)]}
				</div>
				<h1 className="black f5 mv0 ml1">
					<Highlighter
						highlightClassName="bg-light-yellow"
						searchWords={[search]}
						autoEscape={true}
						textToHighlight={String(node.id)}
					/>
				</h1>
			</div>
		);
	}
}
